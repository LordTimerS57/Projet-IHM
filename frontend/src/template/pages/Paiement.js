import { useEffect, useState } from 'react';
import { fetchInfoPaiement } from '../../APIs/Paiement';
import ListePaiement from '../../model/Paiement';

function Paiement() {
  const [infoPaiement, setInfoPaiement] = useState([]);

  const fetchData = async () => {
    const PaiementData = await fetchInfoPaiement();
    setInfoPaiement(PaiementData);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {infoPaiement.length > 0 ? (
        <table className='tablePaiement'>
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
        <p>Aucun paiement trouvé.</p>
      )}
    </div>
  );
}

export default Paiement;
