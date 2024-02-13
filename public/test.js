const firebaseConfig = {
    apiKey: "AIzaSyDqfseKZixdZbCtrnl-vn5G1rbDLmDY6J4",
    authDomain: "polyglot-f007f.firebaseapp.com",
    databaseURL: "https://polyglot-f007f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "polyglot-f007f",
    storageBucket: "polyglot-f007f.appspot.com",
    messagingSenderId: "399111766205",
    appId: "1:399111766205:web:d1296d3c2bc779f0ff77d4",
    measurementId: "G-W8DHMR88LL"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

function calculateCameraPosition(playerX, playerY) {
    const cameraX = playerX - canvas.width / 2;
    const cameraY = playerY - canvas.height / 2;
    return { x: cameraX, y: cameraY };
}

function calculatePlayerPositionsRelativeToCamera(playerX, playerY, cameraX, cameraY) {
    const playerXRelativeToCamera = playerX - cameraX;
    const playerYRelativeToCamera = playerY - cameraY;
    return { x: playerXRelativeToCamera, y: playerYRelativeToCamera };
}

let players = {};

// Function to update player positions in Firebase
function updatePlayerPositionsInFirebase(playerX, playerY) {
    const playerId = firebase.auth().currentUser.uid;
    if (playerId) {
        database.ref('players/' + playerId).update({
            x: playerX,
            y: playerY
        });
    } else {
        console.error("No authenticated user found.");
    }
}

// Function to display players on screen
function displayPlayersOnScreen(cameraX, cameraY) {
    for (const playerId in players) {
        if (Object.hasOwnProperty.call(players, playerId)) {
            const playerData = players[playerId];
            const playerXRelativeToCamera = playerData.x - cameraX;
            const playerYRelativeToCamera = playerData.y - cameraY;
            // Draw the player on screen at the relative position (playerXRelativeToCamera, playerYRelativeToCamera)
        }
    }
}

function gameLoop() {
    const cameraPosition = calculateCameraPosition(player.position.x, player.position.y);
    const playerPositionsRelativeToCamera = calculatePlayerPositionsRelativeToCamera(player.position.x, player.position.y, cameraPosition.x, cameraPosition.y);
    updatePlayerPositionsInFirebase(playerId,playerPositionsRelativeToCamera.x, playerPositionsRelativeToCamera.y);
    displayPlayersOnScreen( cameraPosition.x, cameraPosition.y);
    requestAnimationFrame(gameLoop);
}

function waitForCurrentUser(callback) {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Once the user is available, call the callback function with the user
            callback(user);
            // Unsubscribe from the auth state listener as we don't need it anymore
            unsubscribe();
        }
    });
}

// Usage:
waitForCurrentUser((user) => {
    const playerId = user.uid;
    console.log(playerId);

    // Now you can proceed with your logic that requires the current user
    // For example, call your animate function here
    animate(playerId);
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const playerId = user.uid;
        gameLoop();
        console.log("Authenticated Sucessfully")
    } else {
        console.log("No authenticated user found. Please log in or sign up.");
    }
});


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
canvas.style.borderRadius = '10px';
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 32) {
    collisionsMap.push(collisions.slice(i, 32 + i))
}


class Boundary {
    constructor({ position }) {
        this.position = position
        this.width = 64 //Car on a zoomé la map en 400% donc 16x4
        this.height = 64
    }

    draw() {
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []

const offset = {
    x: -100,
    y: -1400
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 488)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * 64 + offset.x,
                        y: i * 64 + offset.y
                    }
                })
            )
    })
})

console.log(boundaries)



const image = new Image();
image.src = './images/mapFrance.png';

const joueur = new Image()
joueur.src = './images/playerDown.png'

const joueurHaut = new Image()
joueurHaut.src = './images/playerUp.png'

const joueurDroite = new Image()
joueurDroite.src = './images/playerRight.png'

const joueurGauche = new Image()
joueurGauche.src = './images/playerLeft.png'

class Sprite {
    constructor({ position, image, frames = { max: 1 }, sprites }) {
        this.position = position
        this.image = image
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.width,          // lignes sur le decoupage du joueur
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, // render
            this.image.height
        )
        if (!this.moving) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1)
                this.frames.val++
            else this.frames.val = 0
        }
    }
}



const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4,
        y: canvas.height / 2 - 68 / 2
    },
    image: joueur,
    frames: {
        max: 4
    },
    sprites: {
        up: joueurHaut,
        left: joueurGauche,
        right: joueurDroite,
        down: joueur
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const keys = {
    z: {
        pressed: false
    },
    q: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const testBoundary = new Boundary({
    position: {
        x: 300,
        y: 300
    }
})

const movables = [background, ...boundaries]

function rectangularCollision({ rectangle1, rectangle2 }) { //la fonction qui définit les collisions entre rectangle 1(joueur) et rectangle2 (bloc collision)
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate() {
    window.requestAnimationFrame(animate);
    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();
    let moving = true;
    player.moving = false;

    // Calculate camera position based on the player's position
    const cameraPosition = calculateCameraPosition(player.position.x, player.position.y);

    if (keys.z.pressed && lastKey === 'z') {
        player.moving = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) movables.forEach((movable) => { 
            movable.position.y += 1.3;
            updatePlayerPositionsInFirebase(movable.position.x,movable.position.y)

         });
    } else if (keys.q.pressed && lastKey === 'q') {
        player.moving = true;
        player.image = player.sprites.left;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) movables.forEach((movable) => { movable.position.x += 1.3;             updatePlayerPositionsInFirebase(movable.position.x,movable.position.y)
        });
    } else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) movables.forEach((movable) => { movable.position.y -= 1.3;             updatePlayerPositionsInFirebase(movable.position.x,movable.position.y)
        });
    } else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
                console.log('collision');
                moving = false;
                break;
            }
        }
        if (moving) movables.forEach((movable) => { movable.position.x -= 1.3;             updatePlayerPositionsInFirebase(movable.position.x,movable.position.y)
        });
    }

    // Update player positions in Firebase, relative to the camera
    const playerPositionsRelativeToCamera = calculatePlayerPositionsRelativeToCamera(player.position.x, player.position.y, cameraPosition.x, cameraPosition.y);
  

   
 }


let lastKey = ''
function keydownHandler(e) {
    switch (e.key) {
        case 'z':
            keys.z.pressed = true;
            lastKey = 'z';
            break;
        case 'q':
            keys.q.pressed = true;
            lastKey = 'q';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
}

function keyupHandler(e) {
    switch (e.key) {
        case 'z':
            keys.z.pressed = false;
            break;
        case 'q':
            keys.q.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
}

function addEventListeners() {
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
}

function removeEventListeners() {
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('keyup', keyupHandler);
}

