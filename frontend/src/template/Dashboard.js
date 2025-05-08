import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <ul className="DashList">
      <li><Link to="/"><button>Accueil</button></Link></li>
      <li><Link to="/etudiant"><button>Etudiant</button></Link></li>
      <li><Link to="/cité"><button>Bloc</button></Link></li>
      <li><Link to="/paiement"><button>Paiement</button></Link></li>
      <li><Link to="/statistiques"><button>Statistiques</button></Link></li>
    </ul>
  );
}

export default Dashboard;