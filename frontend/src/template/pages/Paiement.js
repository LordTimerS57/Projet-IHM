import { useEffect, useState } from 'react';
import { fetchInfoPaiement } from '../../APIs/Paiement';
import ListePaiement from '../../model/Paiement';
import '../../css/Paiement.css';

function Paiement() {
  const [infoPaiement, setInfoPaiement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const paiementData = await fetchInfoPaiement();
      setInfoPaiement(paiementData);
    } catch (err) {
      setError('Erreur lors du chargement des données de paiement. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <header className="page-header">
          <h1>Gestion des Paiements</h1>
          <p>Suivez et gézrez tous les paiements des étudiants</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des données de paiement...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchData} className="retry-button">
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="table-container">
            {infoPaiement.length > 0 ? (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Numéro de paie</th>
                    <th>Nom & Prénoms</th>
                    <th>Bloc</th>
                    <th>Chambre</th>
                    <th>Montant (en Ar)</th>
                    <th>Mois de paye</th>
                    <th>Date de paiement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {infoPaiement.map((paiement) => (
                    <ListePaiement
                      key={paiement.num_paie}
                      matricule={paiement.matricule}
                      numPaie={paiement.num_paie}
                      nom_prenoms={paiement.nom_prenoms}
                      numBloc={paiement.num_bloc}
                      numChambre={paiement.num_chambre}
                      montant={paiement.montant}
                      mois_paye={paiement.mois_paye}
                      date_paiement={paiement.date_paiement}  
                      refresh={fetchData}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Aucun paiement trouvé</h3>
                <p>Il n'y a aucun paiement enregistré pour le moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Paiement;