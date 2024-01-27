const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require("bcryptjs");

app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())
app.use(session({
    secret: "&4$r1(_&@+*swk_c=&^nwfgw4optf=^o9lvd&@%^@@=04&!$",
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views' , "./src/views");

//Routes
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT));


// BDD
const db = require('./src/models/queries')
const {homeView} = require("./src/controllers/indexController");
const {router} = require("express/lib/application");
app.get('/users', db.getUsers);

app.post("/signIn/register", (req, res) => {
    console.log(req.body);
    db.AddUser(req,res);
    req.session.userName = req.body.user;
    req.session.userEmail = req.body.email;
    req.session.country = req.body.flag;
    res.redirect('/account')
})

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/account', async (req, res) => {
    try {
        const userName = req.session.userName;
        res.render('account', {userName});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/profile', async (req, res) => {
    try {
        const userName = req.session.userName;
        const country = req.session.country;
        const date = await db.getUserDate(req.session.userEmail);
        res.render('profile', {userName, country, date});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/settings', async (req, res) => {
    try {
        const userName = req.session.userName;
        const country = req.session.country;
        const userEmail = req.session.userEmail;
        res.render('settings', {userName, userEmail, country});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/', require('./src/routes/index'));
