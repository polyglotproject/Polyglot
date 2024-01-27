const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require("bcryptjs");

app.use(express.urlencoded({ extended: 'false' }))
app.use(express.json())
app.use(session({
    secret: "&4$r1(_&@+*swk_c=&^nwfgw4optf=^o9lvd&@%^@@=04&!$",
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', "./src/views");

//Routes
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT));


// BDD
const db = require('./src/models/queries')
const { homeView } = require("./src/controllers/indexController");
const { router } = require("express/lib/application");
app.get('/users', db.getUsers);

app.post("/signIn/register", (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    db.UserExist(email)
        .then((userExists) => {
            if (userExists) {
                res.redirect('/signin?userExist=true')
            } else {
                db.AddUser(req, res);
                req.session.userName = req.body.user;
                req.session.userEmail = req.body.email;
                req.session.country = req.body.flag;
                req.session.userError = false;
                res.redirect('/account')            }
        })
        .catch((error) => {
            console.error('Error checking user existence:', error);
        });
  


});

app.post("/signUp/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Use Promise.all to run both queries concurrently
      const [mdp, mail] = await Promise.all([
        db.getUserPass(email),
        db.getUserEmail(email)
      ]);



      if (mdp && mail && password === mdp.mot_de_passe_hashed && email === mail.email) {
        const userName = await db.getUser(email);
        req.session.userName = userName.nom_utilisateur;
        req.session.userEmail = email;
        req.session.userError = false;
        const country = await db.getUserCountry(email);
        req.session.country = country.pays_preferee;
        res.redirect('/account');
      } else {
        res.redirect('/signUp?credentialsError=true');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/account', async (req, res) => {
    try {
        const userName = req.session.userName;
        res.render('account', { userName });
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
        res.render('profile', { userName, country, date });
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
        const error = req.session.userError;
        res.render('settings', {userName, userEmail, country, error});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error ending session');
        } else {
            res.redirect('/home'); // Redirect to home page or login page after logging out
        }
    });
});

app.post('/updateInfo',  async (req, res) => {
    const { user, country } = req.body;
    db.updateUserInfo(req.session.userEmail, user, country);
    const userName = await db.getUser(req.session.userEmail);
    req.session.userName = userName.nom_utilisateur;
    const countryName = await db.getUserCountry(req.session.userEmail);
    req.session.country = countryName.pays_preferee;
    res.redirect('/settings');
});

app.post('/updatePass', async (req, res) => {
    const { oldPass, newPass } = req.body;
    const mdp = await db.getUserPass(req.session.userEmail);
    if (oldPass === mdp.mot_de_passe_hashed) {
        db.updateUserPass(req.session.userEmail, newPass);
        req.session.userError = false;
        res.redirect('/settings');
    }
    else {
        req.session.userError = 'Mot de passe incorrect. Veuillez réessayer.';
        res.redirect('/settings')
    }
});

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/', require('./src/routes/index'));
