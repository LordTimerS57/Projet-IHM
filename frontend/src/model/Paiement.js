import { useState } from "react";
import { supprimerPaiement } from "../APIs/Paiement";
import { FaTrash, FaTimes, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "../css/Paiement.css";

// Composant Modal de confirmation
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, numPaie }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirmation de suppression</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <p>Voulez-vous vraiment supprimer le paiement #{numPaie} ?</p>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant de notification
function Notification({ message, type, isVisible, onClose }) {
  if (!isVisible) return null;

  const icon = type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />;

  return (
    <div className={`notification ${type} ${isVisible ? "show" : ""}`}>
      <div className="notification-content">
        <span className="notification-icon">{icon}</span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
}

// Bouton supprimer un paiement
function DeleteButton({ numPaie, matricule, numBloc, numChambre, refreshPaiement }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "" // "success" ou "error"
  });

  const showNotification = (message, type) => {
    setNotification({ isVisible: true, message, type });
    
    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  const handleDelete = async () => {
    try {
      const success = await supprimerPaiement(numPaie, matricule, numBloc, numChambre);
      if (success) {
        showNotification("Paiement supprimé avec succès", "success");
        await refreshPaiement();
      } else {
        showNotification("Échec de la suppression du paiement", "error");
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      showNotification("Une erreur est survenue lors de la suppression", "error");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        className="delete-button" 
        onClick={() => setIsModalOpen(true)}
      >
        <FaTrash />
      </button>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        numPaie={numPaie}
      />

      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </>
  );
}

// Affichage d'une ligne de l'historique de paiement (inchangé)
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
    <tr className="paiement-row">
      <td>{matricule}</td>
      <td>{numPaie}</td>
      <td>{nom_prenoms}</td>
      <td>{numBloc}</td>
      <td>{numChambre}</td>
      <td>{montant} Ar</td>
      <td>{mois_paye}</td>
      <td>{new Date(date_paiement).toLocaleDateString()}</td>
      <td>
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

export default ListePaiement;