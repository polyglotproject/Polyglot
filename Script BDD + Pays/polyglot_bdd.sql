CREATE TABLE Pays (
    nom_pays VARCHAR(50) PRIMARY KEY
);

CREATE TABLE Utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(255),
    email VARCHAR(255),
    mot_de_passe_hashed VARCHAR(255),
    date_inscription DATE,
    pays_preferee VARCHAR(50),
    FOREIGN KEY (pays_preferee) REFERENCES         Pays(nom_pays)
);

CREATE TABLE Espace_Communs (
    id_espace INT PRIMARY KEY,
    nom_espace VARCHAR(255),
    description TEXT,
    pays_associé VARCHAR(50), -- clé étrangère référençant la table Pays
    FOREIGN KEY (pays_associé) REFERENCES Pays(nom_pays)
);


CREATE TABLE Salons (
    id_salon INT PRIMARY KEY,
    nom_salon VARCHAR(255),
    type_salon VARCHAR(50),
    espace_associé INT, -- clé étrangère référençant la table Espace_Communs
    créateur_salon INT, -- clé étrangère référençant la table Utilisateurs
    FOREIGN KEY (espace_associé) REFERENCES Espace_Communs(id_espace),
    FOREIGN KEY (créateur_salon) REFERENCES Utilisateurs(id_utilisateur)
);

CREATE TABLE Messages (
    id_message INT PRIMARY KEY,
    contenu_message TEXT,
    date_envoi TIMESTAMP,
    expéditeur INT, 
    destinataire INT,
    salon_associé INT, 
    statut_message VARCHAR(20),
    date_lecture TIMESTAMP,
    FOREIGN KEY (expéditeur) REFERENCES Utilisateurs(id_utilisateur),
    FOREIGN KEY (destinataire) REFERENCES Utilisateurs(id_utilisateur),
    FOREIGN KEY (salon_associé) REFERENCES Salons(id_salon)
); 
