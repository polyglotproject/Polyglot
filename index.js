const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views' , "./src/views");

//Routes
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use('/', require('./src/routes/index'));
const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT))

const db = require('./src/models/queries')
app.get('/users', db.getUsers)