const express = require("express");
const routeStat = express.Router();
const connexion = require("../MainPool");

// 
routeStat.get("/", async(_req,res) => {
    const resultNbEtudiant = await connexion.query("SELECT * FROM Nb_Etudiant");
    const resultNbBloc = await connexion.query("SELECT COUNT(*) FROM Bloc");
    const resultNbChambres = await connexion.query("SELECT COUNT(*) FROM Chambre");
    const totalEtudiant = resultNbEtudiant.rows.reduce((acc,row) => acc + parseInt(row.etudiant_par_niveau), 0);
    
    res.json({
        nombreParNiveau : resultNbEtudiant,
        totalEtudiant : totalEtudiant,
        totalBloc : resultNbBloc,
        totalChambres : resultNbChambres
    });
});

routeStat.get("/Paiement", async(_req,res) => {
    const resultMontantPaiement = await connexion.query("SELECT * FROM Montant_Paiement_Spec");
    const totalPaiement = resultMontantPaiement.rows.reduce((acc,row) => acc + parseInt(row.total_paiement), 0);
    
    res.json({
        montantParMoisAnnee : resultMontantPaiement.rows,
        totalPaiement : totalPaiement
    });
});

module.exports = routeStat;