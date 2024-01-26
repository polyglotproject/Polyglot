const accountModel = require('../models/queries');
const db = require("../models/queries");

const accountView = (req, res) => {
    const user = db.getUser(req.session.userEmail);
    res.render("account", {user});
};

const settingsView = (req, res) =>{
    const user = db.getUser(req.session.userEmail);
    res.render("settings", {user});
}

const profileView = (req, res) =>{
    const user = db.getUser(req.session.userEmail);
    res.render("profile", {user});
}

module.exports =  {
    accountView,
    settingsView,
    profileView
};