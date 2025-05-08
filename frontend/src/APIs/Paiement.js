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

async function ajouterPaiement(Paiement) {
    try {
        const response = await fetch((`http://localhost:5000/cite/enleverChambrePlace/${Paiement.num_bloc}/${Paiement.num_chambre}`) , {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
        const resultQuery = await response.json();
        if(resultQuery.Success)
        {
            const response1 = await fetch(("http://localhost:5000/Paiement/ajouterPaiement") , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Paiement)
            });
            const resultQuery1 = await response1.json();
            return resultQuery1.Success;
        }
        else {return false}
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
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