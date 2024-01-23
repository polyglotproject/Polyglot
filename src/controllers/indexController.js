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

module.exports =  {
    homeView,
    connectionView,
    inscriptionView
};