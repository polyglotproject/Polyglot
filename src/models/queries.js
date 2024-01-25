const { request, response } = require('express')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM Utilisateurs ORDER BY id_utilisateur ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const AddUser = (request, response) => {
    const { nom_utilisateur, email, mot_de_passe, pays_preferee } = request.body;

    pool.query(
      'INSERT INTO Utilisateurs (nom_utilisateur, email, mot_de_passe, pays_preferee) VALUES ($1, $2, $3, $4)',
      [nom_utilisateur, email, mot_de_passe, pays_preferee],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  };

const getUser = (userEmail, callback) => {
    pool.query('SELECT nom_utilisateur FROM Utilisateurs WHERE email = $1', [userEmail], (error, results) => {
        if (error) {
            callback(error, null);
        }
        else {
            const user = results.rows[0];
            callback(null, user);
        }
    });
};

const addSalon = (channelData, callback) => {
  const { nom } = channelData;
  pool.query('INSERT INTO Salons (nom) VALUES ($1) RETURNING *', [nom], (error, results) => {
      callback(error, results.rows[0]);
  });
};

const getSalonByID = (id_salon, callback) => {
  pool.query('SELECT * FROM Salons WHERE id = $1', [id_salon], (error, results) => {
      callback(error, results.rows[0]);
  });
};

const deleteMessage = (messageId, callback) => {
  pool.query('DELETE FROM Messages WHERE id = $1', [messageId], (error, results) => {
      callback(error, results.rowCount);
  });
};

const addMessage = (messageData, callback) => {
  const { salon_id, utilisateur_id, contenu } = messageData;
  pool.query('INSERT INTO Messages (salon_id, utilisateur_id, contenu) VALUES ($1, $2, $3) RETURNING *',
      [salon_id, utilisateur_id, contenu],
      (error, results) => {
          callback(error, results.rows[0]);
      });
};

const getMessagesBySalon= (id_salon, callback) => {
  pool.query('SELECT * FROM Messages WHERE salon_id = $1', [id_salon], (error, results) => {
      callback(error, results.rows);
  });
};

module.exports = {
  getUsers,
  getUser,
  AddUser,
  addSalon,
  getSalonByID,
  addMessage,
  deleteMessage,
  getMessagesBySalon
}