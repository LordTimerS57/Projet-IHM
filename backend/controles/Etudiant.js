const express = require("express");
const routeEtudiant = express.Router();
const connexion = require("../MainPool");

// Liste des étudiants et autres spécifications (Statistiques)
routeEtudiant.get("/", async(_req,res) => {
    const resultEtudiant = await connexion.query("SELECT * FROM Etudiant_Spec");
    res.json({
        etudiants : resultEtudiant.rows,
    });
});

// Ajout d'un étudiant
routeEtudiant.post("/ajouterEtudiant", async(req, res) => {
    const { matricule, nom, prenom, etablissement, niveau, contact, sexe, date_naiss, date_inscription, sit_parent } = req.body;
    
    try {
        // Exécution de la requête d'insertion
        await connexion.query(
            "INSERT INTO Etudiant (matricule, nom, prenom, etablissement, niveau, contact, resident, sexe, date_naiss, date_inscription, sit_parent) VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8, $9, $10)" ,
            [matricule, nom, prenom, etablissement, niveau, contact, sexe, date_naiss, date_inscription, sit_parent]
        );
        
        // Réponse de succès
        return res.json({
            Success: true
        });
    } catch (error) {
        console.error("Erreur SQL :", error);
        console.log("Code d'erreur PostgreSQL :", error.code);

        if (error.code === '23505') {
            return res.status(409).json({
                Success: false,
                error: "Le matricule est déjà utilisé."
            });
        } else {
            // Envoi de la réponse d'erreur, et utilisation du return pour éviter un envoi supplémentaire
        return res.status(500).json({ 
            Success: false,
            error: "Erreur à l'ajout d'un étudiant" 
        });
        }
        
    }
});


// Modification d'un enregistrement d'un étudiant
routeEtudiant.put("/modifierEtudiant/:matricule", async(req,res) => {
    const { matricule } = req.params;
    const { nouv_matricule, nom, prenom, etablissement, niveau, contact, sexe, date_naiss, sit_parent } = req.body;
    try {
        await connexion.query(
            "UPDATE Etudiant SET matricule = $1, nom = $2, prenom = $3, etablissement = $4, niveau = $5, contact = $6, sexe = $7, date_naiss = $8, sit_parent = $9 WHERE matricule = $10" ,
            [ nouv_matricule, nom, prenom, etablissement, niveau, contact, sexe, date_naiss, sit_parent, matricule ]
        );
        res.json({
            Success : true
        });
    } catch (error) {
        res.json({
            Success : false
        });
        console.error("Erreur SQL :", error);
        res.status(500).json({error : "Erreur à la modification d'un enregistrement d'un étudiant"});
    }
});

// Suppression d'un enregistrement d'un étudiant
routeEtudiant.delete("/supprimerEtudiant/:matricule", async(req,res) => {
    const { matricule } = req.params;
    try {
        await connexion.query(
            "UPDATE Etudiant SET resident = false WHERE matricule = $1" ,
            [matricule]
        );
        res.json({
            Success : true
        })
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.json({
            Success : false
        })
        res.status(500).json({error : "Erreur à la suppression d'un enregistrement d'un étudiant"});
    }
});

module.exports = routeEtudiant;