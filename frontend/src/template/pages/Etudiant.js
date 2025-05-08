import { useEffect, useState } from 'react';
import { fetchInfoEtudiant } from '../../APIs/Etudiant';
import { AddButton, ListeEtudiant } from '../../model/Etudiant';

function Etudiant() {
  const [infoEtudiant, setInfoEtudiant] = useState([]);

  const fetchData = async () => {
    const EtudiantData = await fetchInfoEtudiant();
    setInfoEtudiant(EtudiantData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>

      <div>
        { /* Bouton manao ajout étudiant */ }
        <AddButton refreshEtudiant={fetchData} />
      </div>

      {infoEtudiant.length > 0 ? (
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
            {infoEtudiant.map((etudiant) => (
              <ListeEtudiant
                key={etudiant.matricule}
                etudiant={etudiant}
                refresh={fetchData}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun étudiant</p>
      )}
    </div>
  );
}

export default Etudiant;
