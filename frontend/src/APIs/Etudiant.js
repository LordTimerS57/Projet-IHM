import { fetchInfoEtudiantPaiement } from "./Paiement";

async function fetchInfoEtudiant() {
    try {
        const response = await fetch("http://localhost:5000/Etudiant");
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const InfoEtudiant = await response.json();
        return InfoEtudiant.etudiants;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function ajouterEtudiant(Etudiant) {
    try {
        const response = await fetch(("http://localhost:5000/Etudiant/ajouterEtudiant") , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(Etudiant)
        });
        const resultQuery = await response.json();
        return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function supprimerEtudiant(matricule) {
    try {
        const data = await fetchInfoEtudiantPaiement(matricule);
        
        if(data.Success){
            const paiementInfo = data.PaiementRecherche[0];
            const transformedData = {
                ...paiementInfo,
                loyer: data.Loyer,
                nom_bloc: data.DesignBloc
            };
            const response = await fetch((`http://localhost:5000/cite/ajouterChambrePlace/${transformedData.num_bloc}/${transformedData.num_chambre}`) , {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            await response.json();
        }
        
        const response1 = await fetch((`http://localhost:5000/Etudiant/supprimerEtudiant/${matricule}`) , {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            });
        const resultQuery = await response1.json();

        return resultQuery.Success;
        
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function modifierEtudiant(Etudiant) {
    try {

        const response = await fetch((`http://localhost:5000/Etudiant/modifierEtudiant/${Etudiant.matricule}`) , {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Etudiant)
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

export { fetchInfoEtudiant, ajouterEtudiant, supprimerEtudiant, modifierEtudiant };