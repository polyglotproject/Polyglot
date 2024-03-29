const { request, response } = require('express')
const bcrypt = require("bcryptjs");
const saltRounds = 12; 
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'polyglot',
  password: 'postgres', //lol j'ai ton mdp #hacker
  port: 5432,
})
async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

const UserExist = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM Utilisateurs WHERE email= $1',
      [email],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.rowCount !== 0) {
            console.log('User in database');
            resolve(true);
          } else {
            console.log('NOT User in database');
            resolve(false);
          }
        }
      }
    );
  });
};
const getUsers = () => {
  return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM Utilisateurs ORDER BY id_utilisateur ASC', (error, results) => {
          if (error) {
              reject(error);
          }

          // Initialize an empty object
          const usersObject = {};

          // Use forEach to iterate through the array
          results.rows.forEach((user) => {
              usersObject[user.id_utilisateur] = {
                  date: user.date_inscription,
                  username: user.nom_utilisateur,
                  email: user.email,
                  statut: user.statut,
                  pays: user.pays_preferee,
                  // Add other properties as needed
              };
          });

          console.log("TEST");

          resolve(usersObject);
      });
  });
};

  const AddUser = async (request, response, callback) => {
    const { user, email, password, flag , date_inscription } = request.body;
    const hash_pass = await hashPassword(request.body.password);
    const statut = 1 ;
    const avatar = 1 ;
    const isAdmin = false ;
    pool.query(
      'INSERT INTO Utilisateurs (nom_utilisateur, email, mot_de_passe_hashed, date_inscription, pays_preferee, statut, avatar, isadmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [user, email, hash_pass, date_inscription, flag, statut, avatar, isAdmin],
      (error, results) => {
        if (error) {
          console.error(error);
          return false; // Return false if an error occurs
        } else {
          console.log('User added successfully');
          return true; // Return true if the user is added successfully
        }
      }
    );
  };

const getUser = (userEmail) => {
    return pool.query('SELECT nom_utilisateur FROM Utilisateurs WHERE email = $1 ', [userEmail])
        .then((results) => results.rows[0])
        .catch((error) => {
            throw error;
        });
};


const getAllUser = (name) => {
  return new Promise((resolve, reject) => {
    console.log("The IN username"+name);
      pool.query(
          ' SELECT * FROM Utilisateurs WHERE nom_utilisateur ILIKE $1 ORDER BY id_utilisateur ASC ',
          [`${name}%`],
          (error, results) => {
              if (error) {
                  reject(error);
              }

              // Initialize an empty object
              const usersObject = {};

              // Use forEach to iterate through the array
              results.rows.forEach((user) => {
                  usersObject[user.id_utilisateur] = {
                      date: user.date_inscription,
                      username: user.nom_utilisateur,
                      email: user.email,
                      statut: user.statut,
                      pays: user.pays_preferee,
                      // Add other properties as needed
                  };
              });

              console.log("TEST");
              console.log(usersObject);

              resolve(usersObject);
          }
      );
  });
};


const isAdmin = (userEmail) => {
  return pool.query('SELECT isadmin FROM Utilisateurs WHERE email = $1', [userEmail])
      .then((results) => results.rows[0])
      .catch((error) => {
          throw error;
      });
};


const getUserStatut = (userEmail) => {

  return pool.query('SELECT statut FROM Utilisateurs WHERE email = $1', [userEmail])
  .then((results) => results.rows[0])
  .catch((error) => {
      throw error;
  });
};

const getUserAvatar = (userEmail) => {

  return pool.query('SELECT avatar FROM Utilisateurs WHERE email = $1', [userEmail])
  .then((results) => results.rows[0])
  .catch((error) => {
      throw error;
  });
};
const getUserPass = (userEmail) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT mot_de_passe_hashed FROM Utilisateurs WHERE email = $1', [userEmail])
      .then((results) => resolve(results.rows[0]))
      .catch((error) => reject(error));
  });
};

const getUserEmail = (userEmail) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT email FROM Utilisateurs WHERE email = $1', [userEmail])
      .then((results) => resolve(results.rows[0]))
      .catch((error) => reject(error));
  });
};

const getUserCountry = (userEmail) => {
    return pool.query('SELECT pays_preferee FROM Utilisateurs WHERE email = $1', [userEmail])
        .then((results) => results.rows[0])
        .catch((error) => {
            throw error;
        });
};

const getUserDate = (userEmail) => {
    return pool.query('SELECT date_inscription FROM Utilisateurs WHERE email = $1', [userEmail])
        .then((results) => results.rows[0])
        .catch((error) => {
            throw error;
        });
};

const updateUserInfo = (email, user, country) => {
    return pool.query('UPDATE Utilisateurs SET nom_utilisateur = $2, pays_preferee = $3 WHERE email = $1', [email, user, country]),
        (error, results) => {
            if (error) {
                console.error(error);
                return false;
            } else {
                console.log('Updated successfully');
                return true;
            }
        }
}

const updateUserPass = async (email, newPass) => {
    const hash_pass = await hashPassword(newPass);
    return pool.query('UPDATE Utilisateurs SET mot_de_passe_hashed = $2 WHERE email = $1', [email, hash_pass]),
        (error, results) => {
            if (error) {
                console.error(error);
                return false;
            } else {
                console.log('Updated successfully');
                return true;
            }
        }
}

const updateUserStatut = async (email, statut) => {
  
  return pool.query('UPDATE Utilisateurs SET statut = $2 WHERE email = $1', [email, statut]),
      (error, results) => {
          if (error) {
              console.error(error);
              return false;
          } else {
              console.log('Updated successfully');
              return true;
          }
      }
}
const updateUserAvatar = async (email, avatar) => {
  
  return pool.query('UPDATE Utilisateurs SET avatar = $2 WHERE email = $1', [email, avatar]),
      (error, results) => {
          if (error) {
              console.error(error);
              return false;
          } else {
              console.log('Updated successfully');
              return true;
          }
      }
}
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

const getAllCountries = (callback) => {
  pool.query('SELECT * FROM Pays', (error, results) => {
      callback(error, results.rows);
  });
};

const getCountryByNom = (countryId, callback) => {
  pool.query('SELECT * FROM Pays WHERE nom_pays = $1', [countryId], (error, results) => {
      callback(error, results.rows[0]);
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
  getMessagesBySalon,
  getAllCountries,
  getCountryByNom,
    getUserCountry,
    getUserDate,
    getUserPass,
    updateUserInfo,
    UserExist,
    updateUserPass,
    getUserEmail,
    getUserStatut,
    updateUserStatut,
    updateUserAvatar,
    getUserAvatar,
    isAdmin,
    getAllUser
}