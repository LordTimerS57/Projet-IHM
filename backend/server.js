const express  = require('express');
const cors = require('cors');
const serveur = express();
const traitementEtudiant = require('./controles/Etudiant');
const traitementBlocsChambres = require('./controles/Bloc-Chambre');
const traitementPaiement = require('./controles/Paiement');
const traitementStat = require('./controles/Statistique');

serveur.use(express.json());

serveur.use(cors());

serveur.use('/General', traitementStat);

serveur.use('/Etudiant', traitementEtudiant);

serveur.use('/cite', traitementBlocsChambres);

serveur.use('/Paiement', traitementPaiement);

serveur.get('/', (req, res) => res.redirect('/Etudiant'))

serveur.listen(5000, () => {
    try {
        console.log("Server is running on http://localhost:5000");
    } catch (error) {
        console.error(error);
    }
})