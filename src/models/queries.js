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
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  const AddUser = (request, response) => {
    const { nom_utilisateur, email, mot_de_passe, pays_preferee } = request.body;

    pool.query(
      'INSERT INTO users (nom_utilisateur, email, mot_de_passe, pays_preferee) VALUES ($1, $2, $3, $4)',
      [nom_utilisateur, email, mot_de_passe, pays_preferee],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json(results.rows);
      }
    );
  };
  

  module.exports = {
    getUsers
  }