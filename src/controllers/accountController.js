const accountModel = require('../models/queries');
const db = require("../models/queries");

const accountView = async (req, res) => {
    const userName = db.getUser(req.session.userEmail);
    const isAdmin = await db.isAdmin(req.session.userEmail);

    res.render("account", { userName, isAdmin });
};


const settingsView = async (req, res) => {
    const userName = db.getUser(req.session.userEmail);
    const country = db.getUserCountry(req.session.userEmail);
    const userEmail = req.session.userEmail;
    const isAdmin = await db.isAdmin(req.session.userEmail);
    res.render("settings", { userName, userEmail, country, isAdmin });
}

const profileView = async (req, res) => {
    const userName = await db.getUser(req.session.userEmail);
    const country = awidb.getUserCountry(req.session.userEmail);
    const date = db.getUserDate(req.session.userEmail);
    const mystatut = db.getUserStatut(req.session.userEmail);
    const myavatar = db.getUserAvatar(req.session.userEmail);
    const isAdmin = await db.isAdmin(req.session.userEmail);

    res.render("profile", { userName, country, date, mystatut, myavatar, isAdmin });
}

const friendsView = async (req, res) => {
    const userName = db.getUser(req.session.userEmail);
    const isAdmin = await db.isAdmin(req.session.userEmail);

    res.render("friends", { userName, isAdmin });
}

const gestionView = async (req, res) => {
    const userdata = db.getUsers();
    const userselect = db.getAllUser();
    const userName = db.getUser(req.session.userEmail);
    const isAdmin = await db.isAdmin(req.session.userEmail);
    const currentPage = req.params.page || 1;
    res.render("gestion", { userName, isAdmin, userdata, userselect });
}

const searchView = async (req, res) => {
    const userdata = db.getAllUser(req.body.username);
    const userName = db.getUser(req.session.userEmail);
    const isAdmin = await db.isAdmin(req.session.userEmail);
    const currentPage = req.params.page || 1;

    res.render("gestion", { userName, isAdmin, userdata,currentPage });
}
const Logout = (req, res) => {
    res.render("logout");
}

module.exports = {
    accountView,
    settingsView,
    profileView,
    friendsView,
    Logout,
    gestionView,
    searchView
};