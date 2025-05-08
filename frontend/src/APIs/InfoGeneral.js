async function fetchInfoGeneral() {
    try {
        const response = await fetch("http://localhost:5000/General");
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const InfoGeneral = await response.json();
        return InfoGeneral;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}
    
async function fetchMontantPaiement() {
    try {
        const response = await fetch("http://localhost:5000/General/Paiement");
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const montantPaiement = await response.json();
        return montantPaiement;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

export {fetchInfoGeneral , fetchMontantPaiement};