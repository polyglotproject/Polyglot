// For View
const homeView = (req, res) => {
    res.render("home", {});
}

const signUpView = (req, res) =>{
    res.render("signup", {});
}

const signInView = (req, res) =>{
    res.render("signin", {});
}
const aboutView = (req, res) =>{
    res.render("about", {});
}

module.exports =  {
    homeView,
    signUpView,
    signInView,
    aboutView
};