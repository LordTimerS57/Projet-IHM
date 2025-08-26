import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Acceuil from './template/pages/Acceuil';
import Etudiant from './template/pages/Etudiant';
import Cite from './template/pages/Bloc-Chambre';  
import Paiement from './template/pages/Paiement';
import Statistiques from './template/pages/Statistique';
import Dashboard from './template/Dashboard';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <title>Gestion Cités Universitaires</title>
        
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <button 
                className="menu-toggle"
                onClick={() => {
                  toggleSidebar();
                  toggleMobileSidebar();
                }}
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <h1>Gestion Cités Universitaires</h1>
            </div>
            <div className="header-right">
              <div className="notifications">
                <button className="icon-button" aria-label="Notifications">
                  🔔
                  <span className="notification-badge">3</span>
                </button>
              </div>
              <div className="user-menu">
                <div className="user-avatar">A</div>
                <span className="user-name">Administrateur</span>
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <div className={`sidebar-container ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
            <Dashboard isCollapsed={sidebarCollapsed} />
          </div>
          
          {/* Overlay pour mobile */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay open" 
              onClick={closeMobileSidebar}
            ></div>
          )}
          
          <div className={`content-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <Routes>
              <Route path="/" element={<Acceuil />} />
              <Route path="/etudiant" element={<Etudiant />} />
              <Route path='/cité' element={<Cite />} />
              <Route path='/paiement' element={<Paiement />} />
              <Route path='/statistiques' element={<Statistiques />} />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>© 2025 Système de Gestion des Cités Universitaires</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;