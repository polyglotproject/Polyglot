const accountModel = require('../models/queries');
const db = require("../models/queries");

const accountView = (req, res) => {
    const userName = db.getUser(req.session.userEmail);
    res.render("account", {userName});
};


const settingsView = (req, res) =>{
    const userName = db.getUser(req.session.userEmail);
    const country = db.getUserCountry(req.session.userEmail);
    const userEmail = req.session.userEmail;
    res.render("settings", {userName, userEmail, country});
}

const profileView = (req, res) =>{
    const userName = db.getUser(req.session.userEmail);
    const country =  db.getUserCountry(req.session.userEmail);
    const date = db.getUserDate(req.session.userEmail);
    res.render("profile", {userName, country, date});
}

const friendsView = (req, res) =>{
    const userName = db.getUser(req.session.userEmail);
    res.render("friends", {userName});
}

const Logout = (req, res) => {
    res.render("logout");
}

module.exports =  {
    accountView,
    settingsView,
    profileView,
    friendsView,
    Logout
};