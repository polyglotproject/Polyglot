// For View
const homeView = (req, res) => {

    res.render("home", {
    } );
}

const connectionView = (req, res) =>{
    res.render("connection", {});
}

module.exports =  {
    homeView,
    connectionView
};