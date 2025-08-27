async function fetchInfoPaiement() {
    try {
        const response = await fetch("http://localhost:5000/Paiement");
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const InfoPaiement = await response.json();
        return InfoPaiement.Paiements;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

// Maka anle info ilaina @ fandoavam-bola @mois payé manaraka 
async function fetchInfoEtudiantPaiement(matricule) {
    try {
        const response = await fetch((`http://localhost:5000/Paiement/${matricule}`),{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const InfoPaiement = await response.json();
        return InfoPaiement;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

// Fonction d'ajout de paiement
async function ajouterPaiement(Paiement) {
  try {
    // 1️⃣ Vérifier si le paiement existe
    const response = await fetch(
      `http://localhost:5000/Paiement/verifierPaiement/${Paiement.matricule}/${Paiement.num_bloc}/${Paiement.num_chambre}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const verif = await response.json();

    let canProceed = false;

    if (!verif.Success) {
      // Paiement inexistant → on peut procéder directement
      canProceed = true;
    } else {
      // Paiement déjà existant → on décrémente une place avant d'ajouter
      const responseChambre = await fetch(
        `http://localhost:5000/cite/enleverChambrePlace/${Paiement.num_bloc}/${Paiement.num_chambre}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const chambreUpdate = await responseChambre.json();
      canProceed = chambreUpdate.Success;
    }

    // Si on peut ajouter, on enregistre le paiement
    if (canProceed) {
      const responsePaiement = await fetch(
        "http://localhost:5000/Paiement/ajouterPaiement",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Paiement),
        }
      );
      const resultPaiement = await responsePaiement.json();
      return resultPaiement.Success;
    }

    // Échec si on ne peut pas continuer
    return false;

  } catch (error) {
    console.error("Erreur réseau ou serveur :", error);
    return false;
  }
}


async function supprimerPaiement(numPaie, matricule, numBloc, numChambre) {
    try {
        const response = await fetch((`http://localhost:5000/Paiement/supprimerPaiement/${matricule}/${numPaie}/${numBloc}/${numChambre}`) , {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function modifierPaiement(numPaie, matricule, numBloc, numChambre, Paiement) {
    try {
        const response = await fetch((`http://localhost:5000/Paiement/modifierPaiement/${matricule}/${numPaie}/${numBloc}/${numChambre}`) , {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Paiement)
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

export { fetchInfoPaiement, fetchInfoEtudiantPaiement, ajouterPaiement, supprimerPaiement, modifierPaiement };