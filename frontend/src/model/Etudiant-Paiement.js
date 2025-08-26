import { useState, useEffect } from "react";
import "../css/Facture.css"
import { ajouterPaiement, fetchInfoEtudiantPaiement, /*fetchInfoPaiement*/ } from "../APIs/Paiement";
import { fetchInfoBloc, fetchInfoBlocChambre } from "../APIs/Bloc-Chambre";
import { Document, Page, Text, View, StyleSheet, /*PDFViewer,*/ PDFDownloadLink } from '@react-pdf/renderer';

// Ato partie mamoaka ny info chambre ilaina
function ChoiceChambre({ chambre, onSelect }) {
  const { num_chambre, nb_place_dispo, loyer } = chambre;

  return (
    <button
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        margin: "4px",
        width: "100%",
        textAlign: "left",
        cursor: nb_place_dispo > 0 ? "pointer" : "not-allowed",
        backgroundColor: nb_place_dispo > 0 ? "#fff" : "#eee",
      }}
      disabled={nb_place_dispo <= 0}
      onClick={() => onSelect(chambre)}
    >
      <strong>Chambre {num_chambre}</strong>
      <div>
        <p>Nombre de place disponibles: {nb_place_dispo}</p>
        <p>Loyer: {loyer} Ar</p>
      </div>
    </button>
  );
}

// Ato le misafidy chambre sy bloc @ fandoavana hofatrano @voalohany
function ChoiceBloc({ onChambreSelected }) {
  const [blocs, setBlocs] = useState([]);
  const [chambres, setChambres] = useState([]);
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlocs = async () => {
      try {
        const data = await fetchInfoBloc();
        setBlocs(data);
      } catch (err) {
        console.error("Erreur lors du chargement des blocs :", err);
      }
    };
    fetchBlocs();
  }, []);

  const handleSelectBloc = async (bloc) => {
    setSelectedBloc(bloc);
    setLoading(true);
    try {
      const chambres = await fetchInfoBlocChambre(bloc.num_bloc);
      setChambres(chambres || []);
    } catch (err) {
      console.error("Erreur chargement chambres :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!selectedBloc ? (
        <>
          <h4>Choisissez un bloc</h4>
          {blocs.map((bloc) => (
            <button
              key={bloc.num_bloc}
              onClick={() => handleSelectBloc(bloc)}
              style={{ margin: "5px", padding: "10px" }}
            >
              {bloc.design_bloc} ({bloc.nb_chambres} chambres)
            </button>
          ))}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedBloc(null)}>← Retour aux blocs</button>
          <h4>Chambres dans le {selectedBloc.design_bloc}</h4>
          {loading ? (
            <p>Chargement...</p>
          ) : chambres.length ? (
            chambres.map((chambre) => (
              chambre.etat && (
                <ChoiceChambre
                key={chambre.num_chambre}
                chambre={chambre}
                onSelect={(ch) => onChambreSelected(selectedBloc, ch)}
              />
              )
            ))
          ) : (
            <p>Aucune chambre disponible</p>
          )}
        </>
      )}
    </div>
  );
}

// Mamoaka num facture
function genererNumFacture(matricule, numBloc, numChambre) {
  const date = new Date();
  const mois = String(date.getMonth() + 1).padStart(2, '0'); // Mois en deux chiffres (01 à 12)
  const annee = date.getFullYear();
  return `${matricule}-${numBloc}-${numChambre}-${mois}/${annee}`;
}

// Formulaire @ fandoavana vola @voalohany
function AddPay({ etudiant , refreshEtudiant }) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [infoEtudiant, setInfoEtudiant] = useState(null);
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [selectedChambre, setSelectedChambre] = useState(null);
  const [factureData, setFactureData] = useState(null);

  const datePaiement = new Date().toISOString().split('T')[0];

  const getData = () => {
    if (!selectedChambre || !selectedBloc || !etudiant) return null;

    return {
      matricule: etudiant.matricule,
      num_bloc: selectedChambre.num_bloc,
      num_chambre: selectedChambre.num_chambre,
      date_paiement: datePaiement,
      mois_paye: moisActuel(),
      montant: selectedChambre.loyer,
      nom_prenoms: (etudiant.nom).toUpperCase() + " " + etudiant.prenom,
      loyer: selectedChambre.loyer,
      penalite: 0,
      jour_retard: 0,
      num_facture: genererNumFacture(
        etudiant.matricule,
        selectedBloc.num_bloc,
        selectedChambre.num_chambre
      ),
      design_bloc: selectedBloc.design_bloc,
    };
  };

  function moisActuel() {
    const mois = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return mois.charAt(0).toUpperCase() + mois.slice(1);
  }

  useEffect(() => {
    if (showModal) {
      setInfoEtudiant(etudiant);
    }
  }, [etudiant, showModal]);

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedBloc(null);
    setSelectedChambre(null);
    setInfoEtudiant(null);
    setFactureData(null);
  };

  const handleChambreSelected = (bloc, chambre) => {
    setSelectedBloc(bloc);
    setSelectedChambre(chambre);
    setStep(3);
  };

  const afficherFacture = () =>{
    // raha hanao anle voulez vous ... dia atao eto

    const formData = getData();
    setFactureData(formData);
    setStep(4);
  }
  const confirmPaiement = async () => {
    // raha hanao anle voulez vous ... dia atao eto

    const formData = getData();
    const success = await ajouterPaiement(formData);
    if(success){
      await refreshEtudiant();
      alert("Paiement effectuée");
    }
    else{
      alert("Erreur dans le paiement");
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Payer le premier loyer</button>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: "80%", maxWidth: 600 }}>
            <button onClick={closeModal} style={{ float: "right" }}>✖</button>

            {step === 1 && infoEtudiant && (
              <div>
                <h3>Étape 1 : Vérification de l'étudiant</h3>
                <p><strong>Nom et prénoms :</strong> {infoEtudiant.nom + " " + infoEtudiant.prenom}</p>
                <p><strong>Matricule :</strong> {infoEtudiant.matricule}</p>
                <button onClick={() => setStep(2)}>→ Étape suivante</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3>Étape 2 : Choix du bloc et chambre</h3>
                <ChoiceBloc onChambreSelected={handleChambreSelected} />
                <button onClick={() => setStep(1)}>← Retour</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3>Étape 3 : Confirmation</h3>
                <p><strong>Nom et prénoms :</strong> {infoEtudiant.nom + " " + infoEtudiant.prenom}</p>
                <p><strong>Bloc :</strong> {selectedBloc.design_bloc}</p>
                <p><strong>Chambre :</strong> {selectedChambre.num_chambre}</p>
                <p><strong>Loyer :</strong> {selectedChambre.loyer} Ar</p>
                <button onClick={afficherFacture}>Confirmer</button>
                <button onClick={() => setStep(2)}>← Retour</button>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3>Étape 4 : Facture générée</h3>
                {factureData && <ModelPDF formData={factureData} onClose={() => {confirmPaiement(); closeModal();}} />}
                <button onClick={() => setStep(3)}>← Retour</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Formulaire @fandoavana hofatrano isam-bolana
function AddForm({ onSubmit, onCancel, initialData = {} }) {
  const [penalite, setPenalite] = useState(0);
  const [addForm, setAddForm] = useState(true);
  const [formData, setFormData] = useState({});
  const [factureData, setFactureData] = useState(null);

  // Fonction pour calculer les jours de retard
  function calculRetardJours(date) {
    const date1 = new Date(date);
  
    const date2 = new Date(new Date(date1).setMonth(new Date(date1).getMonth() + 1));
    
    const dateActuel = new Date();      

    const diffInMs = dateActuel - date2;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? diffInDays : 0;  
  }

  // Calcul de la pénalité à chaque changement de la date de paiement
  const joursDeRetard = calculRetardJours(initialData.date_paiement);
  
  useEffect(() => {
    const penaliteCalcul = joursDeRetard * 20;  // 20 Ar par jour de retard
    setPenalite(penaliteCalcul);
  }, [initialData.date_paiement, joursDeRetard]);  // On recalcule chaque fois que la date de paiement change

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      matricule: initialData.matricule,
      num_bloc: initialData.num_bloc,
      num_chambre: initialData.num_chambre,
      montant: initialData.loyer + penalite,
      mois_paye: moisSuivant(initialData.mois_paye),
      date_paiement: new Date().toISOString().split('T')[0],
      loyer: initialData.loyer,
      nom_prenoms: initialData.nom_prenoms,
      penalite: penalite,
      jour_retard: joursDeRetard, 
      num_facture: genererNumFacture(initialData.matricule, initialData.num_bloc, initialData.num_chambre),
      design_bloc: initialData.nom_bloc
    };
    
    setFactureData(formData);
    setAddForm(false);
    setFormData(formData);

  };

  function moisSuivant(moisAnnee) {
    const moisMap = {
      "janvier": 0, "fevrier": 1, "mars": 2,
      "avril": 3, "mai": 4, "juin": 5,
      "juillet": 6, "aout": 7, "septembre": 8,
      "octobre": 9, "novembre": 10, "decembre": 11
    };

    const moisMapInverse = Object.entries(moisMap).reduce((obj, [cle, val]) => {
      obj[val] = cle.charAt(0).toUpperCase() + cle.slice(1); // Pour retourner le nom avec majuscule
      return obj;
    }, {});

    const [moisStr, anneeStr] = moisAnnee.toLowerCase().split(" ");
    const mois = moisMap[moisStr];
    const annee = parseInt(anneeStr);

    if (mois === undefined || isNaN(annee)) {
      return "Format invalide";
    }

    const date = new Date(annee, mois + 1, 1); // +1 pour obtenir le mois suivant
    const moisSuivantNom = moisMapInverse[date.getMonth()];
    const anneeSuivante = date.getFullYear();

    return `${moisSuivantNom} ${anneeSuivante}`;
  }

  return (
    <>
    { addForm ? (
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={onCancel}>X Fermer</button>
        <legend>Ajout Paiement</legend>

        <div>
          <div>
            <label>Matricule : {initialData.matricule || ''} </label>
          </div>
          <div>
            <label>Nom et Prénoms : {initialData.nom_prenoms || ''} </label>
          </div>
          <div>
            <label>Bloc : {initialData.nom_bloc || ''} </label>
          </div>
          <div>
            <label>Chambre : {initialData.num_chambre || ''}  </label>
          </div>
        </div>
        <fieldset>
          <legend>
            <label>Mois à payer : {moisSuivant(initialData.mois_paye) || ''}</label>
          </legend>
          <div>
            <label>Loyer :</label>
            <input type="text" value={initialData.loyer || ''} readOnly />
          </div>
          <div>
            <label>Jour de retard: {joursDeRetard} </label>
          </div>
          <div>
            <div>
            <label>Pénalités de retard </label>
            <span> (20 Ar par jour) </span>
            </div>
            <input type="text" value={penalite} readOnly />
          </div>
          <div>
            <label>Total à payer </label>
            <input type="text" value={initialData.loyer+penalite} readOnly />
          </div>
        </fieldset>
        <button type="submit">Valider</button>
      </form>
      ) : (
        <div>
          <h3>Étape 2 : Facture générée</h3>
          {factureData && <ModelPDF formData={factureData} onClose={()=>{setAddForm(true); onSubmit(formData); onCancel(); }}/>}
          <button onClick={()=>setAddForm(true)}>← Retour</button>
        </div>
      ) }
  </>
  );
}

// Fenetre maneho anle Formulaire andoavana hofatrano isam-bolana
function ModalAdd({ onClose, onSubmit, initialData }) {
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%",
            height: "100%", backgroundColor: "rgba(0,0,0,0.5)"
        }}>
            <div style={{
                background: "#fff", margin: "5% auto", padding: 20,
                width: "fit-content", maxWidth: "90%"
            }}>
                <AddForm
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    initialData={initialData}
                />
            </div>
        </div>
    );
}

// Bouton manao anle fandoavam-bola isam-bolana
function AddPayButton({ matricule }) {
    const [showModal, setShowModal] = useState(false);
    const [paiementData, setPaiementData] = useState(null);

    const fetchPaiement = async () => {
      try {
          const data = await fetchInfoEtudiantPaiement(matricule);
          const paiementInfo = data.PaiementRecherche[0]; // extraction des infos principales
  
          const transformedData = {
              ...paiementInfo,
              loyer: data.Loyer,
              nom_bloc: data.DesignBloc
          };
          console.log(transformedData);
          setPaiementData(transformedData);
          setShowModal(true);
      } catch (error) {
          console.error("Erreur lors du chargement des infos étudiant :", error);
      }
    };
  

    const handleAdd = async (formData) => {
        // raha hanao anle voulez vous ... dia atao eto

        ajouterPaiement(formData);
        alert("Paiement ajouté avec succès !");
        setShowModal(false);
    };

    return (
        <>
            <button onClick={fetchPaiement}>Payer le loyer</button>
            {showModal && (
                <ModalAdd
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAdd}
                    initialData={paiementData}
                />
            )}
        </>
    );
}

const ModelPDF = ({ formData, onClose }) => {
  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { fontSize: 18, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
    section: { marginBottom: 10 },
    contentSection: { padding: 2.5 },
    field: { marginBottom: 5 },
    label: { fontWeight: 'bold' },
    table: { display: "table", width: "auto", borderStyle: "solid", borderColor: "#000", borderWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, marginBottom: 10},
    tableSpec: { display: "table", width: "auto", borderStyle: "solid", borderColor: "#000"},
    tableRow: { flexDirection: "row" },
    tableCol: { width: "25%", borderStyle: "solid", borderColor: "#000", borderBottomWidth: 1, borderRightWidth: 1, padding: 5 },
    tableColSpec: { width: "25%", borderStyle: "solid", borderColor: "#000", padding: 5},
    precisCol: { borderBottomWidth: 1 },
    tableHeader: { backgroundColor: "#eee", fontWeight: "bold" },
    tableHeaderSpec: { fontWeight: "bold" }
    
  });
  
  // facture PDF alefa atao telechargement
  const FacturePDF = ({data}) => (
    <Document >
      <Page size="A4" style={styles.page}>
  
        <View style={styles.section}>
          <Text style={styles.contentSection}>
            <Text style={{ fontWeight: 'bold' }}>N° facture : </Text>{data.num_facture}
          </Text>
          <Text style={styles.contentSection}>
            <Text style={{ fontWeight: 'bold' }}>Matricule : </Text>{data.matricule}
          </Text>
          <Text style={styles.contentSection}>
            <Text style={{ fontWeight: 'bold' }}>Nom et prénoms : </Text>{data.nom_prenoms}
          </Text>
          <Text style={styles.contentSection}>
            <Text style={{ fontWeight: 'bold' }}>Date de paiement : </Text>{data.date_paiement.split("-").reverse().join("/")}
          </Text>
        </View>
  
        {/* Tableau de facture */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Bloc</Text>
            <Text style={styles.tableCol}>Chambre</Text>
            <Text style={styles.tableCol}>Mois payé</Text>
            <Text style={styles.tableCol}>Loyer</Text>
          </View>
  
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{data.design_bloc}</Text>
            <Text style={styles.tableCol}>{data.num_chambre}</Text>
            <Text style={styles.tableCol}>{data.mois_paye}</Text>
            <Text style={styles.tableCol}>{data.loyer} Ar</Text>
          </View>
        </View>
        <View style={styles.tableSpec}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColSpec}></Text>
            <Text style={styles.tableColSpec}></Text>
            <Text style={[styles.tableColSpec, styles.tableHeaderSpec]}>Montant</Text>
            <Text style={[styles.tableColSpec, styles.precisCol]}>{data.loyer} Ar</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColSpec}></Text>
            <Text style={styles.tableColSpec}></Text>
            <Text style={[styles.tableColSpec, styles.tableHeaderSpec]}>Jours de retard</Text>
            <Text style={styles.tableColSpec}>{data.jour_retard}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColSpec}></Text>
            <Text style={styles.tableColSpec}></Text>
            <Text style={[styles.tableColSpec, styles.tableHeaderSpec]}>Pénalités</Text>
            <Text style={styles.tableColSpec}>{data.penalite} Ar</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColSpec}></Text>
            <Text style={styles.tableColSpec}></Text>
            <Text style={[styles.tableColSpec, styles.tableHeaderSpec]}>Net à payer</Text>
            <Text style={[styles.tableColSpec, { backgroundColor: "#eee", }]}>{data.montant} Ar</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  // Zavatra havoakan'ny facture
  const FactureRender = ({ data }) => (
    <div className="facture-container">

      <div className="document">
        <div className="section">
          <div className="content-section"><strong>N° facture :</strong> {data.num_facture}</div>
          <div className="content-section"><strong>Matricule :</strong> {data.matricule}</div>
          <div className="content-section"><strong>Nom et prénoms :</strong> {data.nom_prenoms}</div>
          <div className="content-section"><strong>Date de paiement :</strong> {data.date_paiement.split("-").reverse().join("/")}</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Bloc</th>
              <th>Chambre</th>
              <th>Mois payé</th>
              <th>Loyer</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-thick">
              <td>{data.design_bloc}</td>
              <td>{data.num_chambre}</td>
              <td>{data.mois_paye}</td>
              <td>{data.loyer} Ar</td>
            </tr>
            <tr className="border-spec1">
              <td colSpan="2"></td>
              <td className="label-spec">Montant</td>
              <td className="bottom-border">{data.loyer} Ar</td>
            </tr>
            <tr className="border-spec">
              <td colSpan="2"></td>
              <td className="label-spec">Jours de retard</td>
              <td>{data.jour_retard}</td>
            </tr>
            <tr className="border-spec">
              <td colSpan="2"></td>
              <td className="label-spec">Pénalités</td>
              <td>{data.penalite} Ar</td>
            </tr>
            <tr className="border-spec">
              <td colSpan="2"></td>
              <td className="label-spec">Net à payer</td>
              <td className="highlight">{data.montant} Ar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Facture de Paiement</h2>

      <div className="mb-6" style={{ width: '100%', height: '500px' }}>
        <FactureRender data={formData}/>
      </div>

      <button className="mb-4">
      <PDFDownloadLink
        document={<FacturePDF data={formData} />}
        fileName={`facture-${formData.num_facture}.pdf`}
        onClick={() => {
          setTimeout(() => {
            onClose();
          }, 500);
        }}
      >
        {({ loading }) =>
          loading ? 'Préparation du PDF...' : 'Imprimer la facture'
        }
      </PDFDownloadLink>
      </button>
    </div>
  );
};

export { AddPayButton, AddPay };