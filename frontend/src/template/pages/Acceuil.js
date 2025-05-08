import { useEffect, useState } from 'react';
import { fetchInfoGeneral } from '../../APIs/InfoGeneral';

function Acceuil() {
  const [infoGeneral, setInfoGeneral] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const generalData = await fetchInfoGeneral();
      console.log(generalData);
      setInfoGeneral(generalData);

    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      <p>Ceci est la page d'accueil du site.</p>

      {infoGeneral && (
        <div>
          <h2>Données générales</h2>
          <p>Total étudiants : {infoGeneral.totalEtudiant}</p>
          <p>Total blocs : {infoGeneral.totalBloc.rows[0].count}</p>
          <p>Total chambres : {infoGeneral.totalChambres.rows[0].count}</p>
        </div>
      )}
    </div>
  );
}

export default Acceuil;
