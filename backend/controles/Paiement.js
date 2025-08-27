const express = require("express");
const routePaiement = express.Router();
const connexion = require("../MainPool");

// Liste des paiements  
routePaiement.get("/", async(_req,res) => {
    const resultPaiement = await connexion.query("SELECT * FROM Paiement_Spec");
    res.json({
        Paiements : resultPaiement.rows,
    });
});

// Création du numero de paiement @manaraka (automatique)
function apresNum(num_paie) {
    const prefix = "P";
    const numStr = num_paie.slice(1); 
    const num = BigInt(numStr);
    const nouveauNum = (num + 1n).toString().padStart(19, "0");
    return prefix + nouveauNum;
}

routePaiement.post("/ajouterPaiement", async(req,res) => {
    const {matricule, num_bloc, num_chambre, date_paiement, mois_paye, montant} = req.body;
    try {
        const resultNumPaie = await connexion.query("SELECT num_paie FROM Paiement_Spec ORDER BY num_paie DESC LIMIT 1");
        const nouvNumPaie = resultNumPaie.rows.length > 0 ? apresNum(resultNumPaie.rows[0].num_paie) : "P"+"0".repeat(18)+"1";
        await connexion.query(
            "INSERT INTO Paiement (num_paie, matricule, num_bloc, num_chambre, date_paiement, mois_paye, montant) VALUES ($1, $2, $3, $4, $5, $6, $7)" ,
            [nouvNumPaie, matricule, num_bloc, num_chambre, date_paiement, mois_paye, montant]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un paiement"});
    }
});



// Recherche de la dernière paiement du loyer d'un étudiant 
routePaiement.get("/:matricule", async(req,res) => {
    const {matricule} = req.params;
    try {
        const resultPaiementRecherche = await connexion.query("SELECT * FROM Paiement_Spec WHERE matricule = $1 ORDER BY date_paiement DESC LIMIT 1",[matricule]);
        if( resultPaiementRecherche.rows.length === 0 ){
            res.json({
                Success : false
            });
        }
        else{
            const { num_bloc , num_chambre } = resultPaiementRecherche.rows[0];
        
            const resultLoyer = await connexion.query("SELECT loyer FROM Chambre WHERE num_bloc = $1 AND num_chambre = $2", [num_bloc, num_chambre]);
            const loyer = resultLoyer.rows.length > 0 ? resultLoyer.rows[0].loyer : null;
            
            const resultDesignBloc = await connexion.query("SELECT design_bloc FROM Bloc WHERE num_bloc = $1", [num_bloc]);
            const designBloc = resultDesignBloc.rows.length > 0 ? resultDesignBloc.rows[0].design_bloc : null;

            res.json({
                PaiementRecherche : resultPaiementRecherche.rows,
                Loyer : loyer,
                DesignBloc: designBloc,
                Success : true,
            });
        }
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un paiement"});
    }
});

// Existence de paiement d'un étudiant 
routePaiement.get("/verifierPaiement/:matricule/:numBloc/:numChambre", async(req,res) => {
    const {matricule, numBloc, numChambre} = req.params;
    try {
        const resultPaiementRecherche = await connexion.query("SELECT * FROM Paiement_Spec WHERE matricule = $1 AND num_bloc = $2 AND num_chambre = $3",[matricule, numBloc, numChambre]);
        if( resultPaiementRecherche.rows.length === 0 ){
            res.json({
                Success : true
            });
        }
        else{
            res.json({
                Success : false,
            });
        }
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un paiement"});
    }
});

// Modification d'un enregistrement d'un paiement
routePaiement.put("/modifierPaiement/:matricule/:paie/:bloc/:chambre", async(req,res) => {
    const { matricule, paie, bloc, chambre } = req.params;
    const {mois_paye, montant} = req.body;
    try {
        await connexion.query(
            "UPDATE Paiement SET mois_paye = $1, montant = $2 WHERE matricule = $3 AND num_paie = $4 AND num_bloc = $5 AND num_chambre = $6" ,
            [ mois_paye, montant, matricule, paie, bloc, chambre ]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la modification d'un enregistrement d'un paiement"});
    }
});

// Suppression d'un enregistrement d'un paiement
routePaiement.delete("/supprimerPaiement/:matricule/:paie/:bloc/:chambre", async(req,res) => {
    const { matricule, paie, bloc, chambre } = req.params;
    try {
        await connexion.query(
            "DELETE FROM Paiement WHERE matricule = $1 AND num_paie = $2 AND num_bloc = $3 AND num_chambre = $4" ,
            [matricule, paie, parseInt(bloc), parseInt(chambre)]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la suppression d'un enregistrement d'un paiement"});
        res.json({
            Success : false
        });
    }
});

module.exports = routePaiement;