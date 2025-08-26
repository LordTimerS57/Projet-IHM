import { useEffect, useState } from 'react';
import { fetchInfoGeneral } from '../../APIs/InfoGeneral';
import { FaUserGraduate, FaBuilding, FaBed, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import '../../css/Accueil.css';

function Acceuil() {
  const [infoGeneral, setInfoGeneral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const generalData = await fetchInfoGeneral();
        setInfoGeneral(generalData);
      } catch (err) {
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="page-content">
      <div className="container">
        <header className="page-header">
          <h1>Tableau de Bord Administratif</h1>
          <p>Gérez les cités universitaires en un seul endroit</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des données...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">
              <FaExclamationTriangle size={30} color="red" />
            </div>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              <FaRedo /> Réessayer
            </button>
          </div>
        )}

        {infoGeneral && !loading && (
          <div className="dashboard-cards">
            <div className="card">
              <div className="card-icon student-icon">
                <FaUserGraduate size={32} color="#2c3e50" />
              </div>
              <div className="card-content">
                <h3>Étudiants</h3>
                <p className="stat-number">{infoGeneral.totalEtudiant}</p>
                <p className="stat-label">Total inscrits</p>
              </div>
            </div>

            <div className="card">
              <div className="card-icon bloc-icon">
                <FaBuilding size={32} color="#2c3e50" />
              </div>
              <div className="card-content">
                <h3>Blocs</h3>
                <p className="stat-number">{infoGeneral.totalBloc.rows[0].count}</p>
                <p className="stat-label">Blocs disponibles</p>
              </div>
            </div>

            <div className="card">
              <div className="card-icon room-icon">
                <FaBed size={32} color="#2c3e50" />
              </div>
              <div className="card-content">
                <h3>Chambres</h3>
                <p className="stat-number">{infoGeneral.totalChambres.rows[0].count}</p>
                <p className="stat-label">Chambres au total</p>
              </div>
            </div>

            {/* <div className="card">
              <div className="card-icon occupancy-icon">
                <FaChartPie size={32} color="#2c3e50" />
              </div>
              <div className="card-content">
                <h3>Taux d'occupation</h3>
                <p className="stat-number">
                  {infoGeneral.totalEtudiant && infoGeneral.totalChambres.rows[0].count 
                    ? Math.round((infoGeneral.totalEtudiant / infoGeneral.totalChambres.rows[0].count) * 100) 
                    : 0}%
                </p>
                <p className="stat-label">Chambres occupées</p>
              </div>
            </div> */}
          </div>
        )}

        <div className="recent-activity">
          <h2>Activité récente</h2>
          <div className="placeholder-activity">
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Acceuil;
