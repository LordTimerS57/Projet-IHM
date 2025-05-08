const express = require("express");
const routeBlocChambre = express.Router();
const connexion = require("../MainPool");

// Liste des blocs
routeBlocChambre.get("/", async(_req,res) => {
    const Blocs = await connexion.query("SELECT * FROM Bloc");
    res.json({
        Blocs : Blocs.rows
    });
});

// Liste des chambres par bloc 
routeBlocChambre.get("/:bloc", async(req,res) => {
    const { bloc } = req.params;
    try {
        if (!bloc || isNaN(bloc)) {
            return res.status(400).json({ error: "Paramètre 'bloc' invalide" });
          }          
        const Chambres = await connexion.query(
            "SELECT c.*, CASE WHEN EXISTS ( SELECT 1 FROM Paiement p WHERE p.num_bloc = c.num_bloc AND p.num_chambre = c.num_chambre ) THEN TRUE ELSE FALSE END AS habitee FROM Chambre c WHERE c.num_bloc = $1;"
            ,[parseInt(bloc)]
        );
        res.json({
            Chambres : Chambres.rows
        });        
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un chambre à un bloc spécifique"});
    }
});

// Ajout d'une chambre dans un bloc spécifique 
routeBlocChambre.post("/ajouterChambre", async(req,res) => {
    const { num_bloc, num_chambre, loyer, nb_place_dispo } = req.body;
    try {
        await connexion.query(
            "UPDATE Bloc SET nb_chambres = nb_chambres + 1 WHERE num_bloc = $1" ,
            [ num_bloc ]
        );
        await connexion.query(
            "INSERT INTO Chambre (num_bloc, num_chambre, nb_place_dispo, etat, loyer) VALUES ($1, $2, $3, true, $4)" ,
            [ num_bloc, num_chambre, loyer, nb_place_dispo ]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un chambre à un bloc spécifique"});
    }
});

// Ajout d'un bloc avec plusieurs chambres 
routeBlocChambre.post("/ajouterBlocChambre", async(req,res) => {
    const {num_bloc, design_bloc, nb_chambres, nb_place_dispo, loyer} = req.body;
    try {
        await connexion.query("INSERT INTO Bloc (num_bloc, design_bloc, nb_chambres) VALUES ($1,$2,$3)",[num_bloc, design_bloc, parseInt(nb_chambres)]);
        for(i = 1; i <= parseInt(nb_chambres); i++){
            valeurChambre = num_bloc * 100 + i;
            await connexion.query(
                "INSERT INTO Chambre (num_bloc, num_chambre, nb_place_dispo, etat, loyer) VALUES ($1, $2, $3, true, $4)" ,
                [num_bloc, valeurChambre, nb_place_dispo, loyer]
            );
        }
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à l'ajout d'un bloc avec plusieurs chambres"});
    }
});

// Modification d'un enregistrement d'une chambre d'un bloc
routeBlocChambre.put("/modifierChambre/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    const { nb_place_dispo, loyer } = req.body;
    try {
        await connexion.query(
            "UPDATE Chambre SET nb_place_dispo = $1, loyer = $2 WHERE num_bloc = $3 AND num_chambre = $4" ,
            [ nb_place_dispo, loyer, bloc, chambre ]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la modification d'un enregistrement d'une chambre d'un bloc"});
    }
});

// Modification de l'habitabilité d'une chambre (non)
routeBlocChambre.put("/modifierChambreEtat/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    try {
        await connexion.query(
            "UPDATE Chambre SET etat = false WHERE num_bloc = $1 AND num_chambre = $2" ,
            [bloc, chambre]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Suppression d'une chambre d'un bloc"});
    }
});

// Modification du nombre de place disponible d'une chambre d'un bloc
routeBlocChambre.put("/enleverChambrePlace/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    try {
        await connexion.query(
            "UPDATE Chambre SET nb_place_dispo = nb_place_dispo - 1 WHERE num_bloc = $1 AND num_chambre = $2" ,
            [bloc, chambre]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la modification du nombre de place disponible d'une chambre d'un bloc"});
    }
});

// Rehefa misy étudiant miala @cité ohatra.
routeBlocChambre.put("/ajouterChambrePlace/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    try {
        await connexion.query(
            "UPDATE Chambre SET nb_place_dispo = nb_place_dispo + 1 WHERE num_bloc = $1 AND num_chambre = $2" ,
            [bloc, chambre]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la modification du nombre de place disponible d'une chambre d'un bloc"});
    }
});

// Suppression d'une chambre " non active " d'un bloc 
routeBlocChambre.delete("/supprimerChambre/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    try {
        await connexion.query(
            "UPDATE Bloc SET nb_chambres = nb_chambres - 1 WHERE num_bloc = $1" ,
            [ bloc ]
        );
        await connexion.query(
            "DELETE FROM Chambre WHERE num_bloc = $1 AND num_chambre = $2" ,
            [bloc, chambre]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Suppression d'une chambre d'un bloc"});
    }
});

// Suppression d'un bloc " non active " 
routeBlocChambre.delete("/supprimerBloc/:bloc", async(req,res) => {
    const { bloc } = req.params;
    try {
        await connexion.query(
            "DELETE FROM Chambre WHERE num_bloc = $1" ,
            [bloc]
        );
        await connexion.query(
            "DELETE FROM Bloc WHERE num_bloc = $1" ,
            [bloc]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Suppression d'une chambre d'un bloc"});
    }
});

// Modification de l'activité d'une chambre (Chambre tsy azo ampiasaina @ le etat avadika non)
routeBlocChambre.put("/modifierChambreEtat/:bloc/:chambre", async(req,res) => {
    const { bloc, chambre } = req.params;
    try {
        await connexion.query(
            "UPDATE Chambre SET etat = false WHERE num_bloc = $1 AND num_chambre = $2" ,
            [bloc, chambre]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Suppression d'une chambre d'un bloc"});
    }
});

module.exports = routeBlocChambre