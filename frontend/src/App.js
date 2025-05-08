import './css/App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Acceuil from './template/pages/Acceuil';
import Etudiant from './template/pages/Etudiant';
import Cite from './template/pages/Bloc-Chambre';  
import Paiement from './template/pages/Paiement';
import Statistiques from './template/pages/Statistique';

import Dashboard from './template/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <title>Cité Universitaire</title>
        <header className="App-header">
          <p>Header</p>
        </header>
        <main>
          <div className='LeftBox'>
            <Dashboard />
          </div>
          <div className='RightBox'>
            <Routes>
              <Route path="/" element={<Acceuil />} />
              <Route path="/etudiant" element={<Etudiant />} />
              <Route path='/cité' element={<Cite />} />
              <Route path='/paiement' element={<Paiement />} />
              <Route path='/statistiques' element={<Statistiques />} />
            </Routes>
          </div>
        </main>
        <footer className="App-header">
          <p>Footer</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
