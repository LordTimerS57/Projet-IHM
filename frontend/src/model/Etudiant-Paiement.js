import { useState, useEffect } from "react";
import { ajouterPaiement, fetchInfoEtudiantPaiement } from "../APIs/Paiement";
import { fetchInfoBloc, fetchInfoBlocChambre } from "../APIs/Bloc-Chambre";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { FaTimes, FaCheck, FaArrowLeft, FaArrowRight, FaMoneyBillWave, FaBuilding, FaBed } from "react-icons/fa";
import Portal from './Portal';
import '../css/Facture.css';

// Composant pour afficher une chambre sélectionnable
function ChoiceChambre({ chambre, onSelect }) {
  const { num_chambre, nb_place_dispo, loyer } = chambre;

  return (
    <button
      className={`chambre-card ${nb_place_dispo > 0 ? 'available' : 'unavailable'}`}
      disabled={nb_place_dispo <= 0}
      onClick={() => onSelect(chambre)}
    >
      <div className="chambre-header">
        <FaBed className="chambre-icon" />
        <span className="chambre-number">Chambre {num_chambre}</span>
      </div>
      <div className="chambre-details">
        <p className="chambre-places">{nb_place_dispo} place{nb_place_dispo !== 1 ? 's' : ''} disponible{nb_place_dispo !== 1 ? 's' : ''}</p>
        <p className="chambre-price">{loyer} Ar/mois</p>
      </div>
    </button>
  );
}

// Composant pour choisir un bloc et une chambre
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
    <div className="bloc-selection">
      {!selectedBloc ? (
        <>
          <h3 className="selection-title">Choisissez un bloc</h3>
          <div className="bloc-grid">
            {blocs.map((bloc) => (
              <button
                key={bloc.num_bloc}
                onClick={() => handleSelectBloc(bloc)}
                className="bloc-card"
              >
                <FaBuilding className="bloc-icon" />
                <div className="bloc-info">
                  <span className="bloc-name">{bloc.design_bloc}</span>
                  <span className="bloc-rooms">{bloc.nb_chambres} chambre{bloc.nb_chambres !== 1 ? 's' : ''}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedBloc(null)} className="back-button">
            <FaArrowLeft /> Retour aux blocs
          </button>
          <h3 className="selection-title">Chambres dans {selectedBloc.design_bloc}</h3>
          {loading ? (
            <div className="loading-chambres">
              <div className="spinner-small"></div>
              <p>Chargement des chambres...</p>
            </div>
          ) : chambres.length ? (
            <div className="chambre-grid">
              {chambres.map((chambre) => (
                chambre.etat && (
                  <ChoiceChambre
                    key={chambre.num_chambre}
                    chambre={chambre}
                    onSelect={(ch) => onChambreSelected(selectedBloc, ch)}
                  />
                )
              ))}
            </div>
          ) : (
            <p className="no-chambres">Aucune chambre disponible</p>
          )}
        </>
      )}
    </div>
  );
}

// Génération du numéro de facture
function genererNumFacture(matricule, numBloc, numChambre) {
  const date = new Date();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const annee = date.getFullYear();
  return `${matricule}-${numBloc}-${numChambre}-${mois}/${annee}`;
}

// Composant principal pour le paiement du premier loyer
function AddPay({ etudiant, refreshEtudiant }) {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [infoEtudiant, setInfoEtudiant] = useState(null);
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [selectedChambre, setSelectedChambre] = useState(null);
  const [factureData, setFactureData] = useState(null);

  useEffect(() => {
    if (showModal && etudiant) {
      setInfoEtudiant(etudiant);
    }
  }, [showModal, etudiant]);

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

  const handleConfirmation = () => {
    // Générer les données de facture
    const facture = {
      num_facture: genererNumFacture(infoEtudiant.matricule, selectedBloc.num_bloc, selectedChambre.num_chambre),
      matricule: infoEtudiant.matricule,
      nom_prenoms: `${infoEtudiant.nom} ${infoEtudiant.prenom}`,
      num_bloc: selectedBloc.num_bloc,
      design_bloc: selectedBloc.design_bloc,
      num_chambre: selectedChambre.num_chambre,
      loyer: selectedChambre.loyer,
      montant: selectedChambre.loyer,
      date_paiement: new Date().toISOString().split('T')[0],
      mois_paye: getCurrentMonthYear(),
      penalite: 0,
      jour_retard: 0
    };
    
    setFactureData(facture);
    setStep(4);
  };

  const getCurrentMonthYear = () => {
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", 
                   "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="btn btn-primary btn-icon"
      >
        <FaMoneyBillWave /> Payer le premier loyer
      </button>

      {showModal && (
        <Portal>
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Paiement du premier loyer</h2>
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body">
                <div className="progress-steps">
                  <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Vérification</span>
                  </div>
                  <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Sélection</span>
                  </div>
                  <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Confirmation</span>
                  </div>
                  <div className={`step ${step >= 4 ? 'active' : ''}`}>
                    <span className="step-number">4</span>
                    <span className="step-label">Facture</span>
                  </div>
                </div>

                {step === 1 && infoEtudiant && (
                  <div className="modal-step">
                    <h3>Vérification des informations</h3>
                    <div className="student-info">
                      <div className="info-row">
                        <span className="info-label">Nom complet:</span>
                        <span className="info-value">{infoEtudiant.nom} {infoEtudiant.prenom}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Matricule:</span>
                        <span className="info-value">{infoEtudiant.matricule}</span>
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={closeModal}>
                        Annuler
                      </button>
                      <button className="btn btn-primary" onClick={() => setStep(2)}>
                        Suivant <FaArrowRight />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="modal-step">
                    <h3>Sélection du bloc et de la chambre</h3>
                    <ChoiceBloc onChambreSelected={handleChambreSelected} />
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={() => setStep(1)}>
                        <FaArrowLeft /> Retour
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && selectedChambre && (
                  <div className="modal-step">
                    <h3>Confirmation de la sélection</h3>
                    <div className="selection-confirmation">
                      <div className="confirmation-card">
                        <div className="confirmation-header">
                          <FaBuilding className="confirmation-icon" />
                          <h4>Informations de réservation</h4>
                        </div>
                        <div className="confirmation-details">
                          <div className="detail-item">
                            <span className="detail-label">Bloc:</span>
                            <span className="detail-value">{selectedBloc.design_bloc}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Chambre:</span>
                            <span className="detail-value">{selectedChambre.num_chambre}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Loyer mensuel:</span>
                            <span className="detail-value price">{selectedChambre.loyer} Ar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={() => setStep(2)}>
                        <FaArrowLeft /> Retour
                      </button>
                      <button className="btn btn-success" onClick={handleConfirmation}>
                        Confirmer <FaCheck />
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && factureData && (
                  <div className="modal-step">
                    <h3>Facture générée</h3>
                    <ModelPDF formData={factureData} onClose={closeModal} />
                    <div className="modal-actions">
                      <button className="btn btn-secondary" onClick={() => setStep(3)}>
                        <FaArrowLeft /> Retour
                      </button>
                      <button className="btn btn-primary" onClick={closeModal}>
                        Terminer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

// Composant pour le paiement mensuel
function AddPayButton({ matricule }) {
  const [showModal, setShowModal] = useState(false);
  const [paiementData, setPaiementData] = useState(null);

  const fetchPaiement = async () => {
    try {
      const data = await fetchInfoEtudiantPaiement(matricule);
      const paiementInfo = data.PaiementRecherche[0];
      
      const transformedData = {
        ...paiementInfo,
        loyer: data.Loyer,
        nom_bloc: data.DesignBloc
      };
      
      setPaiementData(transformedData);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors du chargement des infos étudiant :", error);
    }
  };

  const handleAdd = async (formData) => {
    try {
      await ajouterPaiement(formData);
      alert("Paiement ajouté avec succès !");
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du paiement :", error);
      alert("Une erreur s'est produite lors du paiement.");
    }
  };

  return (
    <>
      <button onClick={fetchPaiement} className="btn btn-info btn-sm btn-icon" style={{
             backgroundColor: '#539DFD',
            // background: 'rgba(120, 120, 120, 0.5)',   
            border: 'none',             
            outline: 'none',            
            boxShadow: 'none',          
            padding: 0,                 
            margin: 0,                  
            width: '80%',        
            textAlign: 'left',          
            color: 'white',       
            font: 'inherit',            
            cursor: 'pointer'         
          }}>
        <FaMoneyBillWave /> Payer le loyer
      </button>
      
      {showModal && (
        <Portal>
          <ModalAdd
            onClose={() => setShowModal(false)}
            onSubmit={handleAdd}
            initialData={paiementData}
          />
        </Portal>
      )}
    </>
  );
}

// Formulaire de paiement mensuel
function AddForm({ onSubmit, onCancel, initialData = {} }) {
  const [penalite, setPenalite] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({});
  const [factureData, setFactureData] = useState(null);

  // Calcul des jours de retard
  const calculRetardJours = (date) => {
    const datePaiement = new Date(date);
    const dateLimite = new Date(datePaiement.setMonth(datePaiement.getMonth() + 1));
    const aujourdhui = new Date();
    
    const diffInMs = aujourdhui - dateLimite;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? diffInDays : 0;
  };

  const joursDeRetard = calculRetardJours(initialData.date_paiement);
  
  useEffect(() => {
    const penaliteCalcul = joursDeRetard * 20;
    setPenalite(penaliteCalcul);
  }, [initialData.date_paiement, joursDeRetard]);

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
    setShowForm(false);
    setFormData(formData);
  };

  const moisSuivant = (moisAnnee) => {
    const moisMap = {
      "janvier": 0, "février": 1, "mars": 2,
      "avril": 3, "mai": 4, "juin": 5,
      "juillet": 6, "août": 7, "septembre": 8,
      "octobre": 9, "novembre": 10, "décembre": 11
    };

    const moisMapInverse = Object.entries(moisMap).reduce((obj, [cle, val]) => {
      obj[val] = cle.charAt(0).toUpperCase() + cle.slice(1);
      return obj;
    }, {});

    const [moisStr, anneeStr] = moisAnnee.toLowerCase().split(" ");
    const mois = moisMap[moisStr];
    const annee = parseInt(anneeStr);

    if (mois === undefined || isNaN(annee)) {
      return "Format invalide";
    }

    const date = new Date(annee, mois + 1, 1);
    const moisSuivantNom = moisMapInverse[date.getMonth()];
    const anneeSuivante = date.getFullYear();

    return `${moisSuivantNom} ${anneeSuivante}`;
  };

  return (
    <>
      {showForm ? (
        <div className="payment-form">
          <div className="form-header">
            <h3>Paiement du loyer</h3>
            <button className="close-btn" onClick={onCancel}>×</button>
          </div>
          
          <div className="student-details">
            <h4>Informations de l'étudiant</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Matricule:</span>
                <span className="detail-value">{initialData.matricule || ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nom:</span>
                <span className="detail-value">{initialData.nom_prenoms || ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Bloc:</span>
                <span className="detail-value">{initialData.nom_bloc || ''}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Chambre:</span>
                <span className="detail-value">{initialData.num_chambre || ''}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4>Détails du paiement</h4>
              
              <div className="form-group">
                <label>Mois à payer</label>
                <input type="text" value={moisSuivant(initialData.mois_paye) || ''} readOnly />
              </div>
              
              <div className="form-group">
                <label>Loyer mensuel</label>
                <input type="text" value={initialData.loyer || ''} readOnly />
              </div>
              
              <div className="form-group">
                <label>Jours de retard</label>
                <input type="text" value={joursDeRetard} readOnly />
              </div>
              
              <div className="form-group">
                <label>Pénalités de retard (20 Ar/jour)</label>
                <input type="text" value={penalite} readOnly />
              </div>
              
              <div className="form-group total">
                <label>Total à payer</label>
                <input type="text" value={initialData.loyer + penalite} readOnly />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Procéder au paiement
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="facture-step">
          <h3>Facture générée</h3>
          {factureData && (
            <ModelPDF 
              formData={factureData} 
              onClose={() => {
                setShowForm(true);
                onSubmit(formData);
                onCancel();
              }}
            />
          )}
          <button 
            className="btn btn-secondary"
            onClick={() => setShowForm(true)}
          >
            ← Retour
          </button>
        </div>
      )}
    </>
  );
}

// Modal pour le paiement mensuel
function ModalAdd({ onClose, onSubmit, initialData }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container medium">
        <AddForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialData={initialData}
        />
      </div>
    </div>
  );
}

// Composant pour afficher/générer la facture
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
  
  const FacturePDF = ({ data }) => (
    <Document>
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
            <Text style={[styles.tableColSpec, { backgroundColor: "#eee" }]}>{data.montant} Ar</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  const FactureRender = ({ data }) => (
    <div className="facture-container">
      <div className="facture-header">
        <h3>Facture de Paiement</h3>
        <div className="facture-meta">
          <div><strong>N° facture:</strong> {data.num_facture}</div>
          <div><strong>Date:</strong> {data.date_paiement.split("-").reverse().join("/")}</div>
        </div>
      </div>

      <div className="facture-client">
        <div className="client-info">
          <div><strong>Matricule:</strong> {data.matricule}</div>
          <div><strong>Nom:</strong> {data.nom_prenoms}</div>
        </div>
      </div>

      <table className="facture-table">
        <thead>
          <tr>
            <th>Bloc</th>
            <th>Chambre</th>
            <th>Mois payé</th>
            <th>Loyer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.design_bloc}</td>
            <td>{data.num_chambre}</td>
            <td>{data.mois_paye}</td>
            <td>{data.loyer} Ar</td>
          </tr>
        </tbody>
      </table>

      <table className="facture-totals">
        <tbody>
          <tr>
            <td colSpan="2"></td>
            <td><strong>Montant:</strong></td>
            <td>{data.loyer} Ar</td>
          </tr>
          <tr>
            <td colSpan="2"></td>
            <td><strong>Jours de retard:</strong></td>
            <td>{data.jour_retard}</td>
          </tr>
          <tr>
            <td colSpan="2"></td>
            <td><strong>Pénalités:</strong></td>
            <td>{data.penalite} Ar</td>
          </tr>
          <tr className="total-row">
            <td colSpan="2"></td>
            <td><strong>Net à payer:</strong></td>
            <td>{data.montant} Ar</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="facture-modal">
      <div className="facture-preview">
        <FactureRender data={formData} />
      </div>

      <div className="facture-actions">
        <PDFDownloadLink
          document={<FacturePDF data={formData} />}
          fileName={`facture-${formData.num_facture}.pdf`}
          className="btn btn-primary"
          onClick={() => setTimeout(onClose, 500)}
        >
          {({ loading }) => loading ? 'Génération...' : 'Télécharger la facture'}
        </PDFDownloadLink>
        
        <button className="btn btn-secondary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
};

export { AddPayButton, AddPay };