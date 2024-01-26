const accountModel = require('../models/queries');

const accountView = (req, res) => {
    res.render("account", {});
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