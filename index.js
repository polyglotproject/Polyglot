const express = require('express');
const session = require('express-session');
const app = express();
const bcrypt = require("bcryptjs");
const strftime = require('strftime');
const saltRounds = 12;

async function verifyPassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}
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

// Socket.io configuration
const { Server } = require('socket.io')
const http = require('http');
const server = http.createServer(app);
const expressServer = server.listen(PORT, console.log("Server has started at port " + PORT));

const io = new Server(expressServer);

const ADMIN = "Admin"


// BDD
const db = require('./src/models/queries')
const { homeView } = require("./src/controllers/indexController");
const { router } = require("express/lib/application");

app.get('/users', db.getUsers);

app.post("/signIn/verification", (req, res) => {

})
app.post("/updateStatut", async (req, res) => {
    if (req.body.statut !== null) {
        if (db.getUserStatut !== req.body.statut) {
            console.log("statut changed")
            await db.updateUserStatut(req.session.userEmail, req.body.statut);

        }
        else {
            console.log("same statut")
        }
    }
})
app.post("/updateAvatar", (req, res) => {
    if (req.body.avatar !== null) {

        if (db.getUserAvatar !== req.body.avatar) {
            db.updateUserAvatar(req.session.userEmail, req.body.avatar);
        }
        else {
            console.log("same avatar")
        }
    }
})
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
                userName = req.session.userName;
                isAdmin = false;
                req.session.userEmail = req.body.email;
                req.session.country = req.body.flag;
                req.session.date = req.body.date_inscription;
                req.session.userError = false;
                res.render('account', { userName, isAdmin });
            }
        })
        .catch((error) => {
            console.error('Error checking user existence:', error);
        });



});

app.post("/signUp/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [mdp, mail] = await Promise.all([
            db.getUserPass(email),
            db.getUserEmail(email)
        ]);

        if (mdp && mail) {
            const isPasswordMatch = await verifyPassword(password, mdp.mot_de_passe_hashed);
        
            if (isPasswordMatch && email === mail.email) {
                const userIsAdmin = await db.isAdmin(email);
                console.log(userIsAdmin);
                if (userIsAdmin.isadmin === false) {
                    const userName = await db.getUser(email);
                    const country = await db.getUserCountry(email);
                    const date = await db.getUserDate(email);

                    req.session.userName = userName.nom_utilisateur;
                    req.session.userEmail = email;
                    req.session.userError = false;
                    req.session.date_inscription = date.date_inscription;
                    req.session.country = country.pays_preferee;

                    res.redirect('/account');
                }    else {
                    res.redirect('/signUp?Adminuser=true');
                }
        
            } else {
                res.redirect('/signUp?credentialsError=true');
            }
        } else {
            res.redirect('/signUp?credentialsError=true');
        }
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }

});

app.post("/adminsignUp/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [mdp, mail] = await Promise.all([
            db.getUserPass(email),
            db.getUserEmail(email)
        ]);

        if (mdp && mail) {
            const isPasswordMatch = await verifyPassword(password, mdp.mot_de_passe_hashed);
        
            if (isPasswordMatch && email === mail.email) {
                const userIsAdmin = await db.isAdmin(email);
                console.log(userIsAdmin);

                if (userIsAdmin.isadmin === true) {
                    const userName = await db.getUser(email);
                    const country = await db.getUserCountry(email);
                    const date = await db.getUserDate(email);

                    req.session.userName = userName.nom_utilisateur;
                    req.session.userEmail = email;
                    req.session.userError = false;
                    req.session.date_inscription = date.date_inscription;
                    req.session.country = country.pays_preferee;

                    res.redirect('/account');
                }    else {
                    res.redirect('/adminsignUp?Adminuser=true');
                }
        
            } else {
                res.redirect('/adminsignUp?credentialsError=true');
            }
        } else {
            res.redirect('/adminsignUp?credentialsError=true');
        }
    }
    catch (error) {
        // Handle errors
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
        const isAdmin = await db.isAdmin(req.session.userEmail);
        res.render('account', { userName, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/gestion', async (req, res) => {
    try {
        const userName = req.session.userName;
        const isAdmin = await db.isAdmin(req.session.userEmail);
        const userdata = await db.getUsers();
        const currentPage = req.query.page || 1;
        console.log(currentPage);
        
        if(isAdmin.isadmin){
            res.render('gestion', { userName, isAdmin, userdata, currentPage });
        }
        else{
            res.redirect('/home');

        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});
app.post('/search', async (req, res) => {
    try {
        const userName = req.session.userName;
        const isAdmin = await db.isAdmin(req.session.userEmail);
        const userdata = await db.getAllUser(req.body.username);
        const currentPage = req.query.page || 1;
        console.log("The username : " + userdata);

        if(isAdmin.isadmin){
            res.render('gestion', { userName, isAdmin, userdata,currentPage });
        }
        else{
            res.redirect('/home');

        }
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
        const statut = await db.getUserStatut(req.session.userEmail);
        const avatar = await db.getUserAvatar(req.session.userEmail);
        const isAdmin = await db.isAdmin(req.session.userEmail);

        res.render('profile', { userName, country, date, statut, avatar, isAdmin });
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
        const isAdmin = await db.isAdmin(req.session.userEmail);

        res.render('settings', { userName, userEmail, country, error, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});

app.get('/friends', async (req, res) => {
    try {
        const userName = req.session.userName;
        const isAdmin = await db.isAdmin(req.session.userEmail);

        res.render('friends', { userName, isAdmin });
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

app.post('/updateInfo', async (req, res) => {
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
    const isPasswordMatch = await verifyPassword(oldPass, mdp.mot_de_passe_hashed);
    if (isPasswordMatch) {
        db.updateUserPass(req.session.userEmail, newPass);
        req.session.userError = false;
        res.redirect('/settings');
    }
    else {
        req.session.userError = 'Mot de passe incorrect. Veuillez réessayer.';
        res.redirect('/settings')
    }
});
app.get('/general', async (req, res) => {
    try {
        const userName = req.session.userName;
        const country = req.session.country;
        const userEmail = req.session.userEmail;
        res.render('general', { userName, userEmail, country });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des données utilisateur.');
    }
});


// Chat messaging configuration

// state
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Upon connection - only to user
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat App!"))

    socket.on('enterRoom', ({ name, room }) => {

        console.log('ok for room');
        // leave previous room
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`))
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room users list until after the state update in activate user
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            })
        }

        // join room
        socket.join(user.room)

        // To user who joined
        socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))

        // To everyone else
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

        // Update user list for room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

    })

    // When user disconnects - to all others
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    // Listening for a message event
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
        console.log('message sent')
    })

    // Listen for activity
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
        console.log('activity detected')
    })
})

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

// User functions
function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}



// End of file
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/', require('./src/routes/index'));