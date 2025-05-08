async function fetchInfoBloc() {
    try {
        const response = await fetch("http://localhost:5000/cite");
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des données");
        }
        const InfoBloc = await response.json();
        return InfoBloc.Blocs;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

// maka anle info chambres @bloc safidiana
async function fetchInfoBlocChambre(numBloc) {
    try {
        const response = await fetch((`http://localhost:5000/cite/${numBloc}`) , {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const InfoBlocChambres = await response.json();
          return InfoBlocChambres.Chambres;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}


async function ajouterBloc(Bloc) {
    try {
        const response = await fetch(("http://localhost:5000/cite/ajouterBlocChambre") , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Bloc)
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function ajouterChambre(Chambre) {
    try {
        const response = await fetch(("http://localhost:5000/cite/ajouterChambre") , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Chambre)
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

async function supprimerChambre(numBloc, numChambre) {
    try {
        const response = await fetch((`http://localhost:5000/cite/supprimerChambre/${numBloc}/${numChambre}`) , {
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

async function supprimerBloc(numBloc) {
    try {
        const response = await fetch((`http://localhost:5000/cite/supprimerBloc/${numBloc}`) , {
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

async function modifierChambre(Chambre) {
    try {
        const response = await fetch((`http://localhost:5000/cite/modifierChambre/${Chambre.num_bloc}/${Chambre.num_chambre}`) , {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Chambre)
          });
          const resultQuery = await response.json();
          return resultQuery.Success;
    } catch (error) {
        console.error("Error fetching data:", error);
        return;
    }
}

export { fetchInfoBloc, fetchInfoBlocChambre, ajouterBloc, ajouterChambre, supprimerBloc, supprimerChambre, modifierChambre };