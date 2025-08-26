const { Pool } = require('pg');
const connexion = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cite_univ',
<<<<<<< HEAD
    password: 'Jeremstar',
=======
    password: '1234',
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
    port: 5432
});

module.exports = connexion;