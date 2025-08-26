// import { useState } from "react";
import { /* modifierPaiement , */ supprimerPaiement } from "../APIs/Paiement";

// Affichage de l'historique de paiement
function ListePaiement({
  matricule,
  numPaie,
  nom_prenoms,
  numBloc,
  numChambre,
  montant,
  mois_paye,
  date_paiement,
  refresh
}) {
  return (
    <tr>
      <td>{matricule}</td>
      <td>{numPaie}</td>
      <td>{nom_prenoms}</td>
      <td>{numBloc}</td>
      <td>{numChambre}</td>
      <td>{montant}</td>
      <td>{mois_paye}</td>
      <td>{new Date(date_paiement).toLocaleDateString()}</td>
      <td>
        {/*
          <ModifyButton 
            numPaie={numPaie} 
            montant={montant} 
            mois_paye={mois_paye} 
            date_paiement={date_paiement}
            matricule={matricule}
            numBloc={numBloc}
            numChambre={numChambre}
            refreshPaiement={refresh}
          />
        */}
        <DeleteButton
          numPaie={numPaie}
          matricule={matricule}
          numBloc={numBloc}
          numChambre={numChambre}
          refreshPaiement={refresh}
        />
      </td>
    </tr>
  );
}
/*
function ModifyButton({ numPaie, montant, mois_paye, date_paiement, matricule, numBloc, numChambre, refreshPaiement}) {
  const [showModal, setShowModal] = useState(false);

  const handleModify = async (formData) => {
    try {
      const success = await modifierPaiement(numPaie, matricule, numBloc, numChambre, formData);
      if (success) {
        await refreshPaiement();
        setShowModal(false);
      } else {
        alert("Échec de la suppression.");
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Modifier</button>
      {showModal && (
        <ModalModify 
          onClose={() => setShowModal(false)} 
          onSubmit={handleModify}
          montant={montant}
          mois_paye={mois_paye}
          date_paiement={date_paiement}
          matricule={matricule}
          numBloc={numBloc}
          numChambre={numChambre}
          numPaie={numPaie}
        />
      )}
    </>
  );
}
*/

// Bouton supprimer un paiement
function DeleteButton({ numPaie, matricule, numBloc, numChambre, refreshPaiement }) {
  const handleSubmit = async () => {
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer le paiement avec le numéro de paiement ${numPaie} ?`);
        if (!confirmDelete) return;

    try {
      // Raha hanao anle voulez vous ... dia atao eto

      const success = await supprimerPaiement(numPaie, matricule, numBloc, numChambre);
      if (success) {
        await refreshPaiement();
      } else {
        alert("Échec de la suppression.");
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Une erreur est survenue.");
    }
  };

  return <button onClick={handleSubmit}>Supprimer</button>;
}

/*

function ModifyForm({ onSubmit, onCancel, montant, mois_paye, date_paiement, matricule, numBloc, numChambre, numPaie }) {
  const [formData, setFormData] = useState({
    montant: montant,
    mois_paye: mois_paye,
    date_paiement: date_paiement ? new Date(date_paiement).toISOString().split('T')[0] : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>X <br />Fermer</button>
        <legend> Modifier </legend>
      </div>
      
      <div style={{ display: 'none' }}>
        <label>
          Numéro de paie :
          <input 
            type="text" 
            value={numPaie} 
            disabled 
          />
        </label>
      </div>
      <div style={{ display: 'none' }}>
        <label>
          Matricule :
          <input 
            type="text" 
            value={matricule} 
            disabled 
          />
        </label>
      </div>
      <div style={{ display: 'none' }}>
        <label>
          Numéro de bloc :
          <input 
            type="text" 
            value={numBloc} 
            disabled 
          />
        </label>
      </div>
      <div style={{ display: 'none' }}>
        <label>
          Numéro de chambre :
          <input 
            type="text" 
            value={numChambre} 
            disabled 
          />
        </label>
      </div>

      <div>
        <label>
          Montant :
          <input 
            type="number" 
            name="montant" 
            value={formData.montant} 
            onChange={handleChange} 
          />
        </label>
      </div>
      <div>
        <label>
          Mois payé :
          <input 
            type="text" 
            name="mois_paye" 
            value={formData.mois_paye} 
            onChange={handleChange} 
          />
        </label>
      </div>
      <div>
        <label>
          Date de paiement :
          <input 
            type="date" 
            name="date_paiement" 
            value={formData.date_paiement} 
            onChange={handleChange} 
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <button type="submit" style={{ marginLeft: '10px' }}>Modifier</button>
      </div>
    </form>
  );
}
*/

/*
function ModalModify({ onClose, onSubmit, montant, mois_paye, date_paiement, matricule, numBloc, numChambre, numPaie }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%",
      height: "100%", backgroundColor: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "#fff", margin: "5% auto", padding: 20,
        width: "fit-content", maxWidth: "90%"
      }}>
        <ModifyForm 
          onSubmit={onSubmit} 
          onCancel={onClose} 
          montant={montant}
          mois_paye={mois_paye}
          date_paiement={date_paiement}
          matricule={matricule}
          numBloc={numBloc}
          numChambre={numChambre}
          numPaie={numPaie}
        />
      </div>
    </div>
  );
}
*/

export default ListePaiement;
