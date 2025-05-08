\c postgres;
DROP DATABASE IF EXISTS cite_univ;
CREATE DATABASE cite_univ;
\c cite_univ;

CREATE TYPE niv AS ENUM('L1','L2','L3','M1','M2');
CREATE TYPE sex AS ENUM('Masculin','Feminin');
CREATE TYPE sp AS ENUM('Divorces','Veuf(ve)','Maries','Morts');

CREATE TABLE Etudiant(
    matricule varchar(13) NOT NULL PRIMARY KEY,
    nom varchar(60) NOT NULL,
    prenom varchar(100),
    etablissement varchar(50),
    niveau niv,
    contact varchar(10) NOT NULL,
    resident boolean,
    sexe sex,
    date_naiss date,
    date_inscription date DEFAULT CURRENT_DATE,
    sit_parent sp
);

CREATE TABLE Bloc(
    num_bloc varchar(3) NOT NULL PRIMARY KEY,
    design_bloc varchar(20),
    nb_chambres int
);

CREATE TABLE Chambre(
    num_bloc varchar(3),
    num_chambre varchar(4),
    nb_place_dispo int,
    etat boolean,
    loyer real,
    PRIMARY KEY (num_bloc, num_chambre),             
    FOREIGN KEY (num_bloc) REFERENCES Bloc(num_bloc)
);

CREATE TABLE Paiement (
    num_paie varchar(20) NOT NULL PRIMARY KEY,               
    matricule VARCHAR(13) NOT NULL,               
    num_bloc varchar(3) NOT NULL,                         
    num_chambre varchar(4) NOT NULL,                      
    date_paiement date NOT NULL DEFAULT CURRENT_DATE,
    mois_paye varchar(30) NOT NULL,             
    montant real DEFAULT 0.0,                        

    FOREIGN KEY (matricule) REFERENCES Etudiant(matricule) ON UPDATE CASCADE,
    FOREIGN KEY (num_bloc, num_chambre) REFERENCES Chambre(num_bloc, num_chambre)
);

CREATE VIEW Etudiant_Spec AS
SELECT 
    e.matricule,
    e.nom,
    e.prenom,
    e.sexe,
    e.contact,
    e.niveau,
    e.etablissement,
    e.sit_parent,
    e.date_naiss,
    CASE 
        WHEN COUNT(p.num_paie) > 0 THEN TRUE
        ELSE FALSE
    END AS a_paye
FROM 
    Etudiant e
LEFT JOIN 
    Paiement p ON e.matricule = p.matricule
WHERE 
    e.resident = TRUE
GROUP BY 
    e.matricule, e.nom, e.prenom, e.sexe, e.contact, e.niveau, e.date_naiss
ORDER BY 
    e.niveau, e.nom, e.prenom;
 
CREATE VIEW Nb_etudiant AS
    SELECT 
        niveau,
        COUNT(*) AS etudiant_par_niveau
    FROM 
        Etudiant
    WHERE
        resident = TRUE
    GROUP BY
        niveau
    ORDER BY
        niveau;

CREATE VIEW Paiement_Spec AS 
    SELECT
        e.matricule,
        CONCAT(e.nom, ' ', e.prenom) AS nom_prenoms,
        p.num_paie,
        p.date_paiement,
        p.mois_paye,
        p.montant,
        p.num_bloc,
        p.num_chambre
    FROM
        Etudiant e
    JOIN
        Paiement p ON e.matricule = p.matricule;

CREATE VIEW Montant_Paiement_Spec AS 
    SELECT 
        mois_paye,
        SUM(montant) AS total_paiement
    FROM 
        Paiement
    GROUP BY 
        mois_paye;

INSERT INTO Bloc (num_bloc, design_bloc, nb_chambres)
VALUES (1, 'Bloc A', 5);

INSERT INTO Chambre (num_bloc, num_chambre, nb_place_dispo, etat, loyer)
VALUES 
    (1, 101, 2, TRUE, 25000.0),
    (1, 102, 2, TRUE, 25000.0),
    (1, 103, 2, TRUE, 30000.0),
    (1, 104, 1, TRUE, 30000.0),
    (1, 105, 5, TRUE, 25000.0);

INSERT INTO Etudiant (matricule, nom, prenom, etablissement, niveau, contact, resident, sexe, date_naiss, sit_parent)
VALUES 
('E001', 'Rakoto', 'Jean', 'Informatique', 'L1', '0341234567', TRUE, 'Masculin', '2003-05-10', 'Maries'),
('E002', 'Rasoanaivo', 'Marie', 'Gestion', 'L2', '0342234567', TRUE, 'Feminin', '2002-03-15', 'Divorces'),
('E003', 'Randrianarisoa', 'Paul', 'Droit', 'L3', '0343234567', TRUE, 'Masculin', '2001-12-21', 'Veuf(ve)'),
('E004', 'Andriamasinoro', 'Hanta', 'Informatique', 'M1', '0344234567', TRUE, 'Feminin', '2000-07-19', 'Maries'),
('E005', 'Raharinirina', 'Eric', 'Médecine', 'M2', '0345234567', TRUE, 'Masculin', '1999-11-11', 'Morts'),
('E006', 'Rakotovao', 'Fara', 'Lettres', 'L1', '0346234567', TRUE, 'Feminin', '2003-08-30', 'Maries'),
('E007', 'Rasolo', 'Mamy', 'Sciences', 'L2', '0347234567', TRUE, 'Masculin', '2002-06-09', 'Veuf(ve)'),
('E008', 'Andriamanana', 'Sarah', 'Informatique', 'L3', '0348234567', TRUE, 'Feminin', '2001-04-27', 'Divorces'),
('E009', 'Rakotonirina', 'Joël', 'Gestion', 'M1', '0349234567', TRUE, 'Masculin', '2000-01-18', 'Maries'),
('E010', 'Ramanantsoa', 'Lala', 'Droit', 'M2', '0340334567', TRUE, 'Feminin', '1999-09-09', 'Morts'),
('E011', 'Rakoto', 'Jean Marie Boniface', 'Informatique', 'L1', '0341236577', TRUE, 'Masculin', '2003-05-10', 'Maries');

INSERT INTO Paiement (num_paie, matricule, num_bloc, num_chambre, date_paiement, mois_paye, montant)
VALUES 
('P0000000000000000001', 'E001', 1, 101, '2025-01-10', 'Janvier 2025', 25000.0),
('P0000000000000000002', 'E001', 1, 101, '2025-02-10', 'Fevrier 2025', 25000.0),
('P0000000000000000003', 'E001', 1, 101, '2025-03-10', 'Mars 2025', 25000.0),

('P0000000000000000004', 'E002', 1, 101, '2025-01-15', 'Janvier 2025', 25000.0),
('P0000000000000000005', 'E002', 1, 101, '2025-02-15', 'Fevrier 2025', 25000.0),
('P0000000000000000006', 'E002', 1, 101, '2025-03-15', 'Mars 2025', 25000.0),

('P0000000000000000007', 'E003', 1, 102, '2025-01-12', 'Janvier 2025', 25000.0),
('P0000000000000000008', 'E003', 1, 102, '2025-02-12', 'Fevrier 2025', 25000.0),
('P0000000000000000009', 'E003', 1, 102, '2025-03-12', 'Mars 2025', 25000.0),

('P0000000000000000010', 'E004', 1, 102, '2025-01-18', 'Janvier 2025', 25000.0),
('P0000000000000000011', 'E004', 1, 102, '2025-02-18', 'Fevrier 2025', 25000.0),
('P0000000000000000012', 'E004', 1, 102, '2025-03-18', 'Mars 2025', 25000.0),

('P0000000000000000013', 'E005', 1, 103, '2025-01-20', 'Janvier 2025', 30000.0),
('P0000000000000000014', 'E005', 1, 103, '2025-02-20', 'Fevrier 2025', 30000.0),
('P0000000000000000015', 'E005', 1, 103, '2025-03-20', 'Mars 2025', 30000.0),

('P0000000000000000016', 'E006', 1, 103, '2025-01-22', 'Janvier 2025', 30000.0),
('P0000000000000000017', 'E006', 1, 103, '2025-02-22', 'Fevrier 2025', 30000.0),
('P0000000000000000018', 'E006', 1, 103, '2025-03-22', 'Mars 2025', 30000.0),

('P0000000000000000019', 'E007', 1, 104, '2025-01-10', 'Janvier 2025', 30000.0),
('P0000000000000000020', 'E007', 1, 104, '2025-02-10', 'Fevrier 2025', 30000.0),
('P0000000000000000021', 'E007', 1, 104, '2025-03-10', 'Mars 2025', 30000.0),

('P0000000000000000022', 'E008', 1, 104, '2025-01-15', 'Janvier 2025', 30000.0),
('P0000000000000000023', 'E008', 1, 104, '2025-02-15', 'Fevrier 2025', 30000.0),
('P0000000000000000024', 'E008', 1, 104, '2025-03-15', 'Mars 2025', 30000.0),

('P0000000000000000025', 'E009', 1, 104, '2025-01-20', 'Janvier 2025', 30000.0),
('P0000000000000000026', 'E009', 1, 104, '2025-02-20', 'Fevrier 2025', 30000.0),
('P0000000000000000027', 'E009', 1, 104, '2025-03-20', 'Mars 2025', 30000.0),

('P0000000000000000028', 'E010', 1, 104, '2025-01-25', 'Janvier 2025', 30000.0),
('P0000000000000000029', 'E010', 1, 104, '2025-02-25', 'Fevrier 2025', 30000.0),
('P0000000000000000030', 'E010', 1, 104, '2025-03-25', 'Mars 2025', 30000.0);

