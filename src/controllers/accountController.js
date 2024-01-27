const accountModel = require('../models/queries');
const db = require("../models/queries");

const accountView = (req, res) => {

    if (req.session && req.session.userEmail) {
        const data = db.getUser(req.session.userEmail);
        res.render("account", { data });
    }
    else {
        res.render("home");
    }
};

const settingsView = (req, res) => {

    if (req.session && req.session.userEmail) {
        const user = db.getUser(req.session.userEmail);
        const userEmail = req.session.userEmail;
        res.render("settings", { user, userEmail });
    }
    else {
        res.render("home");
    }
}

const profileView = (req, res) => {
    if (user && user.nom_utilisateur) {
        db.getUser(req.session.userEmail)
          .then((user) => {
            res.render('profile', { user });
          })
          .catch((error) => {
            console.error(error);
            res.render('error', { message: 'Error fetching user profile' });
          });
      } else {
        res.render('home');
      }
}
const Logout = (req, res) => {
    res.render("logout");
}

module.exports = {
    accountView,
    settingsView,
    profileView,
    Logout
};