import { useEffect, useState } from 'react';
import { fetchInfoEtudiant } from '../../APIs/Etudiant';
import { AddButton, ListeEtudiant } from '../../model/Etudiant';
import '../../css/Etudiant.css';

function Etudiant() {
  const [infoEtudiant, setInfoEtudiant] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');

  const fetchData = async () => {
    const EtudiantData = await fetchInfoEtudiant();
    setInfoEtudiant(EtudiantData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrage des étudiants
  const filteredEtudiants = infoEtudiant.filter(etudiant => {
    const matchesSearch = etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         etudiant.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterNiveau === '' || etudiant.niveau === filterNiveau;
    
    return matchesSearch && matchesFilter;
  });

  // Extraire les niveaux uniques pour le filtre
  const niveauxUniques = [...new Set(infoEtudiant.map(etudiant => etudiant.niveau))];

  return (
    <div className="etudiant-page">
      <div className="page-header">
        <h1 className="page-title">Gestion des Étudiants</h1>
      </div>

      <div className="add-button-container">
        <AddButton refreshEtudiant={fetchData} />
      </div>

      <div className="controls-container">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-container">
          <select 
            className="filter-select"
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
          >
            <option value="">Tous les niveaux</option>
            {niveauxUniques.map(niveau => (
              <option key={niveau} value={niveau}>{niveau}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredEtudiants.length > 0 ? (
        <div className="table-container">
          <table className='tableEtudiant'>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom & Prénoms</th>
                <th>Sexe</th>
                <th>Contact</th>
                <th>Niveau</th>
                <th>Etablissement</th>
                <th>Date de Naissance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEtudiants.map((etudiant) => (
                <ListeEtudiant
                  key={etudiant.matricule}
                  etudiant={etudiant}
                  refresh={fetchData}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>{infoEtudiant.length === 0 ? 'Aucun étudiant enregistré' : 'Aucun étudiant ne correspond à votre recherche'}</p>
        </div>
      )}
    </div>
  );
}

export default Etudiant;