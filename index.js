const express = require('express');
const app = express();
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


app.get('/', (req, res) => {
    res.redirect('/home');
});


app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/', require('./src/routes/index'));