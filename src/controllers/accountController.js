const accountModel = require('../models/queries');

const accountView = (req, res) => {
    const userEmail = req.body.email;
    accountModel.getUser(userEmail, (error, user) => {
        if (error) {
            res.status(500).send('Erreur lors de la récupération des données utilisateur.');
        } else {
            res.render("account", {user});
        }
    });
};

const settingsView = (req, res) =>{
    res.render("settings", {});
}

const profileView = (req, res) =>{
    res.render("profile", {});
}

module.exports =  {
    accountView,
    settingsView,
    profileView
};