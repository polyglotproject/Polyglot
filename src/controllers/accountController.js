const accountView = (req, res) =>{
    res.render("account", {});
}

const settingsView = (req, res) =>{
    res.render("settings", {});
}

module.exports =  {
    accountView,
    settingsView
};