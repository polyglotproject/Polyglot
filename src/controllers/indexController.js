// For View
const homeView = (req, res) => {

    res.render("home", {
    } );
}

const connectionView = (req, res) =>{
    res.render("connection", {});
}

const inscriptionView = (req, res) =>{
    res.render("inscription", {});
}
const accountView = (req, res) =>{
    res.render("account", {});
}

const settingsView = (req, res) =>{
    res.render("settings", {});
}

module.exports =  {
    homeView,
    connectionView,
    inscriptionView,
    accountView,
    settingsView
};