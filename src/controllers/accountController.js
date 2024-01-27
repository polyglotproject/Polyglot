const accountModel = require('../models/queries');
const db = require("../models/queries");

const accountView = (req, res) => {
    const data = db.getUser(req.session.userEmail);
    res.render("account", {data});
};


const settingsView = (req, res) =>{
    const user = db.getUser(req.session.userEmail);
    const country = db.getUserCountry(req.session.userEmail);
    const userEmail = req.session.userEmail;
    res.render("settings", {user, userEmail, country});
}

const profileView = (req, res) =>{
    const user = db.getUser(req.session.userEmail);
    const country =  db.getUserCountry(req.session.userEmail);
    const date = db.getUserDate(req.session.userEmail);
    res.render("profile", {user, country, date});
}

const Logout = (req, res) => {
    res.render("logout");
}

module.exports =  {
    accountView,
    settingsView,
    profileView,
    Logout
};