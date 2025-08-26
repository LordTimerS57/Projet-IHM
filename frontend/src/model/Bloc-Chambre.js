import { useState, useEffect } from 'react';
import { ajouterBloc, ajouterChambre, fetchInfoBlocChambre , supprimerChambre, supprimerBloc, modifierChambre } from '../APIs/Bloc-Chambre';
import '../css/Bloc-Chambre.css';
import { FaPlus } from 'react-icons/fa';

function ModalChambre({ chambre, onClose, refreshChambre, refreshChambre1 }) {
  const [showModify, setShowModify] = useState(false);

  const handleSave = async (updatedChambre) => {
    try {
      const success = await modifierChambre(updatedChambre);
      if(success){    
        setShowModify(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  return (
    <div className="modal-overlay">
      {showModify ? (
        <ModifyChambreModal
          chambre={chambre}
          onClose={() => {
            setShowModify(false); 
            refreshChambre1(chambre.num_bloc);
          }}
          onSave={handleSave}
        />
      ) : (
        <div className="modal-content">
          <div className="modal-header">
            <h2>Détails de la chambre {chambre.num_chambre}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="chambre-details">
            <p><strong>Places disponibles :</strong> {chambre.nb_place_dispo}</p>
            <p><strong>Habitable :</strong> {chambre.etat ? 'Oui' : 'Non' }</p>
            <p><strong>Habitée :</strong> {chambre.habitee ? 'Oui' : 'Non' }</p>
            <p><strong>Loyer :</strong> {chambre.loyer} Ar</p>
          </div>
          <div className="form-buttons">
            <button className="btn-primary" onClick={() => setShowModify(true)}>Modifier</button>
            {chambre.habitee ? null : (
              <DeleteButtonChambre
                numChambre={chambre.num_chambre}
                numBloc={chambre.num_bloc}
                refreshChambre={refreshChambre}
              />
            )}
            <button className="btn-secondary" onClick={onClose}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Ajouter un bloc</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Nom du bloc :
              <input
                type="text"
                value={nomBloc}
                onChange={(e) => {
                  const onlyValidChars =  e.target.value.replace(/[^\p{L}0-9 '-]/gu, "");
                  setNomBloc(onlyValidChars);
                }}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Nombre de chambres :
              <input
                type="text"
                value={nbChambres}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); 
                  setNbChambres(onlyDigits);
                }}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Nombre de places par chambre :
              <input
                type="text"
                value={nbPlaces}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); 
                  setNbPlaces(onlyDigits);
                }}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Loyer par chambre :
              <input
                type="text"
                value={loyer}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, ""); 
                  setLoyer(onlyDigits);
                }}
                required
              />
            </label>
          </div>

          <div className="form-buttons">
            <button className="btn-primary" type="submit">Ajouter</button>
            <button className="btn-secondary" type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListeChambre({ num_chambre, nb_place_dispo, habitee, loyer, num_bloc, etat, onSuccess }) {
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
        className="chambre-button"
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
      <div className="bloc-card">
        
        <button 
          onClick={onSelect} 
          style={{
            background: 'transparent',  
            border: 'none',             
            outline: 'none',            
            boxShadow: 'none',          
            padding: 0,                 
            margin: 0,                  
            width: '100%',        
            textAlign: 'left',          
            color: 'inherit',       
            font: 'inherit',            
            cursor: 'pointer'         
          }}
        >
          <h3>{nomBloc}</h3>
          <p>Nombre de chambres : {nbChambres}</p>
        </button>
        {!habite && <DeleteButtonBloc numBloc={numBloc} refreshBloc={refresh}/>}
      </div>
    );
  } else {
    return (
      <div>
        <button className="back-button" onClick={onBack}>← Retour à la liste des blocs</button>
        <h3>Chambres du {nomBloc}</h3>
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des chambres...</p>
          </div>
        ) : (
          <>
            {(petitPremierNumChambreOublie > Math.max(...chambres.map(b => parseInt(b.num_chambre))) && Math.max(...chambres.map(b => parseInt(b.num_chambre) % 100)) === 99) ? null : (
              <button className="add-button" onClick={() => setShowAddModalChambre(true)}>
                <FaPlus />
                Ajouter une chambre
              </button>
            )}

            <div className="chambre-list">
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
            </div>

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

function trouverPetitPremierNumChambre(arr) {
  arr.sort((a, b) => a - b);
  for (let i = 1; i < arr.length; i++) {
    if (parseInt(arr[i]) - parseInt(arr[i-1]) > 1) {
      return parseInt(arr[i-1]) + 1;
    }
  }
  return parseInt(arr[arr.length - 1]) + 1;
}

function AddModalChambre({ onClose, onSuccess, chambres, numChambre}) {
  const [loyer, setLoyer] = useState('');
  const [nbPlaces, setNbPlaces] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Ajouter une chambre</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Numéro de chambre :
              <input type="text" value={numChambre} disabled />
            </label>
          </div>

          <div className="form-group">
            <label>
              Nombre de places par chambre :
              <input 
                type="text" 
                value={nbPlaces} 
                placeholder={nbPlacesParDefaut}
                maxLength="2" 
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setNbPlaces(onlyDigits);
                }} 
                required 
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Loyer par chambre :
              <input 
                type="text" 
                value={loyer} 
                placeholder={loyerParDefaut}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setLoyer(onlyDigits);
                }} 
                required 
              />
            </label>
          </div>

          <div className="form-buttons">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'Ajouter'}
            </button>
            <button className="btn-secondary" type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modifier Chambre {num_chambre}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="form-group">
          <label>
            Loyer :
            <input 
              type="text" 
              value={loyer} 
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setLoyer(onlyDigits);
              }} 
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Places :
            <input 
              type="text" 
              value={places} 
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setPlaces(onlyDigits);
              }} 
              required
            />
          </label>
        </div>

        <div className="form-buttons">
          <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

function DeleteButtonChambre({ numBloc, numChambre, refreshChambre }){
  const handleSubmit = async () => {
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer la chambre avec le numéro de chambre ${numChambre} ?`);
    if (!confirmDelete) return;

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
    <button className="btn-danger" onClick={handleSubmit}>Supprimer</button>
  )
}

function DeleteButtonBloc({ numBloc, refreshBloc }){
  const handleSubmit = async () => {
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer le bloc avec le numéro de bloc ${numBloc} ?`);
    if (!confirmDelete) return;

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
    <button className="btn-danger" onClick={handleSubmit}>Supprimer</button>
  )
}

export {ListeBloc , AddModalBloc};