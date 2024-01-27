// Initialisation
const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require("bcryptjs");
const url = require('node:url');

// Configuration
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



// SignIn POST
app.post("/signIn/register", async (req, res) => {
    try{
        const { user, email, password, flag } = req.body;
        await db.AddUser(req,res)
        const data = await db.getUser(email);
        req.session.userEmail = email;
        res.render('account', {data});
        
        
       
    }
    catch(error){
        console.error(error);
        res.status(500).send('Erreur lors de l\'inscription de l\'utilisateur');
    }
})


// SignUp POST
app.post("/signUp/login", async (req, res) => {
    try{
        const { email, password} = req.body;
        const data = await db.getUser(email);
        if (password === data.mot_de_passe_hashed) {
            req.session.userEmail = email;
            res.render('account', {data});
        }
        else{
            res.redirect('/signUp');
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send('Erreur lors de la connexion email ou mot de passe incorrect.');
    }
})

app.get('/', (req, res) => {
    res.redirect('/home');
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
function test(){

app.get('/account', async (req, res) => {
    try {
        const user = await db.getUser(req.session.userEmail);
        if(user.nom_utilisateur){
            res.render('account', {user});

        }
     
    } catch (error) {
        console.error(error);
/*         res.status(500).send('Erreur lors de la récupération des données utilisateur. Veuillez vous reconnecter');
 */        res.redirect('/home');
    }
});
}

app.get('/profile', async (req, res) => {
    try {
        const user = await db.getUser(req.session.userEmail);
        if(user.nom_utilisateur){
            res.render('profile', {user});

        }
    } catch (error) {
        console.error(error);
/*         res.status(500).send('Erreur lors de la récupération des données utilisateur. Veuillez vous reconnecter');
 */        res.redirect('/home');

    }
});

app.get('/settings', async (req, res) => {
    try {
        const user = await db.getUser(req.session.userEmail);
        const userEmail = req.session.userEmail;
        if(user.nom_utilisateur){
            res.render('settings', {user, userEmail});

        }
    } catch (error) {
        console.error(error);
/*         res.status(500).send('Erreur lors de la récupération des données utilisateur. Veuillez vous reconnecter');
 */        res.redirect('/home');
    }
});

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/', require('./src/routes/index'));
