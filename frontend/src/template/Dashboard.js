import { Link, useLocation } from 'react-router-dom';
import '../css/Dashboard.css';

function Dashboard({ isCollapsed }) {
  const location = useLocation();

  return (
    <div className={`admin-dashboard ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>{isCollapsed ? 'GU' : 'Gestion Universitaire'}</h2>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">
                <span className="nav-icon">🏠</span>
                {!isCollapsed && <span className="nav-text">Accueil</span>}
              </Link>
            </li>
            <li className={location.pathname === '/etudiant' ? 'active' : ''}>
              <Link to="/etudiant">
                <span className="nav-icon">👨‍🎓</span>
                {!isCollapsed && <span className="nav-text">Étudiants</span>}
              </Link>
            </li>
            <li className={location.pathname === '/cité' ? 'active' : ''}>
              <Link to="/cité">
                <span className="nav-icon">🏢</span>
                {!isCollapsed && <span className="nav-text">Blocs</span>}
              </Link>
            </li>
            <li className={location.pathname === '/paiement' ? 'active' : ''}>
              <Link to="/paiement">
                <span className="nav-icon">💳</span>
                {!isCollapsed && <span className="nav-text">Paiements</span>}
              </Link>
            </li>
            <li className={location.pathname === '/statistiques' ? 'active' : ''}>
              <Link to="/statistiques">
                <span className="nav-icon">📊</span>
                {!isCollapsed && <span className="nav-text">Statistiques</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            {!isCollapsed && (
              <div className="user-details">
                <p className="user-name">Administrateur</p>
                <p className="user-role">Gestionnaire</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;