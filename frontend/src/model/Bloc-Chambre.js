import { useState, useEffect } from 'react';
import { ajouterBloc, ajouterChambre, fetchInfoBlocChambre , supprimerChambre, supprimerBloc, modifierChambre } from '../APIs/Bloc-Chambre';

// @ty le fenetre mamoaka anle détails anle chambre avy natao clic
function ModalChambre({ chambre, onClose, refreshChambre, refreshChambre1 }) {
  const [showModify, setShowModify] = useState(false);

  const handleSave = async (updatedChambre) => {
    // raha hanao anle voulez vous ... dia atao eto

    try {
      const success = await modifierChambre(updatedChambre);
      if(success){    
        setShowModify(false); // ferme la modale de modification
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      
        {showModify ? (
          <ModifyChambreModal
            chambre={chambre}
            onClose={() => {
              setShowModify(false); 
              refreshChambre1(chambre.num_bloc)}
            }
            onSave={handleSave}
          />
        ) : (
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            minWidth: '300px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
              <button onClick={onClose} style={{ marginTop: '10px' }}>Fermer</button>
              <h2>Détails de la chambre {chambre.num_chambre}</h2>
              <p><strong>Places disponibles :</strong> {chambre.nb_place_dispo}</p>
              <p><strong>Habitable :</strong> {chambre.etat ? 'Oui' : 'Non' }</p>
              <p><strong>Habitée :</strong> {chambre.habitee ? 'Oui' : 'Non' }</p>
              <p><strong>Loyer :</strong> {chambre.loyer} Ar</p>
              <button onClick={() => setShowModify(true)}>Modifier</button>
              {
                chambre.habitee ? (<></>) : (
                  <DeleteButtonChambre
                    numChambre={chambre.num_chambre}
                    numBloc={chambre.num_bloc}
                    refreshChambre={refreshChambre}
                  />
                )
              }
              
          </div>
        )}
    </div>
  );
}

// Formulaire ajout d'un bloc + chambres
function AddModalBloc({ onClose, onSuccess, numBloc }) {
  const [nomBloc, setNomBloc] = useState('');
  const [nbChambres, setNbChambres] = useState(1);
  const [nbPlaces, setNbPlaces] = useState(1);
  const [loyer, setLoyer] = useState('');

  const formData = {
    num_bloc: numBloc,
    design_bloc: nomBloc,
    nb_chambres: nbChambres,
    nb_place_dispo: nbPlaces,
    loyer: loyer
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // raha hanao anle voulez vous ... dia atao eto
    try {
      const success = await ajouterBloc(formData);
      if (success){
        onClose();
        onSuccess(); 
      }
    } catch (error) {
      console.error('Erreur lors de l’ajout du bloc :', error);
      alert('Erreur lors de l’ajout du bloc.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        minWidth: '400px'
      }}>
        <h2>Ajouter un bloc</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nom du bloc :
            <input type="text" value={nomBloc} onChange={(e) => setNomBloc(e.target.value)} required />
          </label><br /><br />
          <label>
            Nombre de chambres :
            <input type="number" min="1" max="99" value={nbChambres} onChange={(e) => setNbChambres(e.target.value)} required />
          </label><br /><br />
          <label>
            Nombre de places par chambre :
            <input type="number" min="1" value={nbPlaces} onChange={(e) => setNbPlaces(e.target.value)} required />
          </label><br /><br />
          <label>
            Loyer par chambre :
            <input type="text" value={loyer} onChange={(e) => setLoyer(e.target.value)} required />
          </label><br /><br />
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Annuler</button>
        </form>
      </div>
    </div>
  )
}

// @ty le mamoaka anle chambres anaty bloc
function ListeChambre({ num_chambre, nb_place_dispo, habitee, loyer, num_bloc, etat, onSuccess }) 
{
  const [showModal, setShowModal] = useState(false);

  const chambreData = {
    num_chambre,
    nb_place_dispo,
    habitee,
    etat,
    loyer,
    num_bloc
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          border: '1px solid #ccc', padding: '8px', margin: '4px',
          width: '100%', textAlign: 'left'
        }}
      >
        <strong>Chambre {num_chambre}</strong>
      </button>

      {showModal && 
        <ModalChambre 
        chambre={chambreData} 
        onClose={() => setShowModal(false)} 
        refreshChambre={ () => { 
          setShowModal(false); 
          onSuccess(num_bloc); 
        } }
        refreshChambre1={onSuccess}
      />
      }
    </>
  );
}

// @ty mamoaka anle bloc
function ListeBloc({ numBloc, nomBloc, nbChambres, habite, onSelect, onBack, refresh }) {
  const [chambres, setChambres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModalChambre, setShowAddModalChambre] = useState(false);
  const showChambres = !onSelect;

  useEffect(() => {
    if (showChambres) {
      setLoading(true);
      fetchInfoBlocChambre(numBloc)
        .then((BlocChambres) => setChambres(BlocChambres || []))
        .catch((error) => console.error("Erreur :", error))
        .finally(() => setLoading(false));
    }
  }, [numBloc, showChambres]);

  const petitPremierNumChambreOublie = trouverPetitPremierNumChambre(chambres.map(ch => ch.num_chambre));

  if (!showChambres) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <button onClick={onSelect}>
          <p><strong>{nomBloc}</strong></p>
          <p>Nombre de chambres : {nbChambres}</p>
        </button>
        {!habite && <DeleteButtonBloc numBloc={numBloc} refreshBloc={refresh}/>}
      </div>
    );
  }
 else
  {
    return (
      <div>
        <button onClick={onBack}>← Retour à la liste des blocs</button>
        <h3>Chambres du {nomBloc}</h3>
        {loading ? (
          <p>Chargement des chambres...</p>
        ) : (
          <>
            {(petitPremierNumChambreOublie > Math.max(...chambres.map(b => parseInt(b.num_chambre))) && Math.max(...chambres.map(b => parseInt(b.num_chambre) % 100)) === 99) ? null : (
              <button onClick={() => setShowAddModalChambre(true)}>➕ Ajouter une chambre</button>
            )}

            {chambres.map((chambre) => (
              <ListeChambre
                key={chambre.num_chambre}
                num_chambre={chambre.num_chambre}
                nb_place_dispo={chambre.nb_place_dispo}
                habitee={chambre.habitee}
                loyer={chambre.loyer}
                etat={chambre.etat}
                num_bloc={chambre.num_bloc}
                onSuccess={() => {
                  fetchInfoBlocChambre(numBloc).then((BlocChambres) => setChambres(BlocChambres || []));
                }}
              />
            ))}

            {showAddModalChambre && (
              <AddModalChambre
                onClose={() => setShowAddModalChambre(false)}
                onSuccess={() => {
                  setShowAddModalChambre(false);
                  fetchInfoBlocChambre(numBloc).then((BlocChambres) => setChambres(BlocChambres || []));
                }}
                numChambre={petitPremierNumChambreOublie}
                chambres={chambres}
              />
            )}
          </>
        )}
      </div>
    );
  }
}


// Fonction pour calculer le plus petit numéro de chambre manquant
function trouverPetitPremierNumChambre(arr) {
  arr.sort((a, b) => a - b);
  for (let i = 1; i < arr.length; i++) {
    if (parseInt(arr[i]) - parseInt(arr[i-1]) > 1) {
      return parseInt(arr[i-1]) + 1;
    }
  }
  return parseInt(arr[arr.length - 1]) + 1;
}

// Formulaire ajouter chambre
function AddModalChambre({ onClose, onSuccess, chambres, numChambre}) {

  const [loyer, setLoyer] = useState('');
  const [nbPlaces, setNbPlaces] = useState('');
  const [loading, setLoading] = useState(false);

  // Définir le loyer et le nombre de places à ceux des autres chambres existantes
  const loyerParDefaut = chambres.length > 0 ? chambres[0].loyer : '';
  const nbPlacesParDefaut = chambres.length > 0 ? chambres[0].nb_place_dispo : '';
  const numBloc = chambres.length > 0 ? chambres[0].num_bloc : '';
  
  const nouvelleChambre = {
    num_bloc: numBloc,
    num_chambre: numChambre,
    loyer: loyer || loyerParDefaut,
    nb_place_dispo: nbPlaces || nbPlacesParDefaut,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // raha hanao anle voulez vous ... dia atao eto
    setLoading(true);
    try {
      const success = await ajouterChambre(nouvelleChambre);
      if(success){
        onSuccess(); 
        onClose();
      }  
    } catch (err) {
      console.error('Erreur lors de l’ajout de la chambre :', err);
      alert('Erreur lors de l’ajout de la chambre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        minWidth: '400px'
      }}>
        <h2>Ajouter une chambre</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Numéro de chambre :
            <input type="text" value={numChambre} disabled />
          </label><br /><br />
          <label>
            Nombre de places par chambre :
            <input type="number" value={nbPlacesParDefaut} max="99" onChange={(e) => setNbPlaces(e.target.value)} required />
          </label><br /><br />
          <label>
            Loyer par chambre :
            <input type="text" value={loyerParDefaut} onChange={(e) => setLoyer(e.target.value)} required />
          </label><br /><br />
          <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Ajouter'}</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Annuler</button>
        </form>
      </div>
    </div>
  );
}

// Formulaire modifier chambre
function ModifyChambreModal({ chambre, onClose, onSave }) {
  const [loyer, setLoyer] = useState(chambre.loyer);
  const [places, setPlaces] = useState(chambre.nb_place_dispo);
  const num_chambre = chambre.num_chambre;
  const num_bloc = chambre.num_bloc;

  const handleSave = () => {
    const updatedChambre = {
      num_bloc,
      num_chambre,
      loyer: loyer,
      nb_place_dispo: places
    };
    onSave(updatedChambre);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Modifier Chambre {num_chambre}</h2>
        <label>
          Loyer :
          <input type="text" value={loyer} onChange={(e) => setLoyer(e.target.value)} />
        </label><br />
        <label>
          Places :
          <input type="number" min="0" value={places} onChange={(e) => setPlaces(e.target.value)} />
        </label><br />
        <button onClick={handleSave}>Enregistrer</button>
        <button onClick={onClose} style={{ marginLeft: '10px' }}>Annuler</button>
      </div>
    </div>
  );
}

// Bouton supprimer chambre
function DeleteButtonChambre({ numBloc, numChambre, refreshChambre }){
  const handleSubmit = async () => {
      // raha hanao anle voulez vous ... dia atao eto

      try {
          const success = await supprimerChambre(numBloc, numChambre);
          if (success) {
            await refreshChambre();

          } else {
            alert("Échec de la suppression.");
          }
        } catch (error) {
          console.error("Erreur de suppression :", error);
          alert("Une erreur est survenue.");
        }
  }
 
  return(
      <button onClick={handleSubmit}>Supprimer</button>
  )
}


// Bouton supprimer bloc
function DeleteButtonBloc({ numBloc, refreshBloc }){
  const handleSubmit = async () => {
      // raha hanao anle voulez vous ... dia atao eto

      try {
          const success = await supprimerBloc(numBloc);
          if (success) {
            await refreshBloc(numBloc);

          } else {
            alert("Échec de la suppression.");
          }
        } catch (error) {
          console.error("Erreur de suppression :", error);
          alert("Une erreur est survenue.");
        }
  }
 
  return(
      <button onClick={handleSubmit}>Supprimer</button>
  )
}

export {ListeBloc , AddModalBloc};