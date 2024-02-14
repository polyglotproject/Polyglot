const canvas = document.querySelector('canvas');
const realcanva = document.getElementById('canvait');
const c2 = realcanva.getContext('2d');
const c = canvas.getContext('2d');

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


//Init
firebase.initializeApp(firebaseConfig);
const database = firebase.database();




canvas.width = 1524;
canvas.height = 876;
canvas.style.borderRadius = '10px';
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 32) {
    collisionsMap.push(collisions.slice(i, 32 + i))
}

class Boundary {
    constructor({ position }) {
        this.position = position
        this.width = 64
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
    y: -500
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
            this.frames.val * (this.image.width / this.frames.max),
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        if (!this.moving) return;
        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
    draw2() {
        c2.drawImage(
            this.image,
            this.frames.val * (this.image.width / this.frames.max),
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        );
        if (!this.moving) return;
        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}


const player = new Sprite({

    position: {
        x: canvas.width / 2 - 192 / 4,
        y: canvas.width / 2 - 192 / 4
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

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function updatePlayerLocation(playerId, playerX, playerY, playerdirection) {

    database.ref('players/' + playerId).set({
        x: playerX,
        y: playerY,
        direction: playerdirection
    });
}


firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error(errorCode, errorMessage);
});


let allPlayers = [];

let playerSprites = {};



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const playerId = user.uid;
        const playerRef = firebase.database().ref(`players/${playerId}`);
        playerRef.set({
            id: playerId,
            name: "caca",
            direction: "down",
            x: 3,
            y: 3,
        });

        const playersRef = firebase.database().ref('players');
        playersRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const uid = childSnapshot.key;
                const playerData = childSnapshot.val();
                if (uid !== playerId) {
                    updateOrCreatePlayerSprite(uid, playerData);
                    gameLoop()
                    
                }
            });
          
        });
        playersRef.on('value', (snapshot) => {
            const playerData = snapshot.val();
            if (playerData) {
                updateOrCreatePlayerSprite(playerId, playerData);
                gameLoop()
            }
        });
    } else {
        
    }
});

function gameLoop() {
    drawOtherPlayers(); 
    requestAnimationFrame(drawOtherPlayers);

}


function drawOtherPlayers() {
    for (const uid in allPlayers) {
        if (uid !== firebase.auth().currentUser.uid) {
            const playerData = allPlayers[uid];
            updateOrCreatePlayerSprite(uid, playerData);
            console.log("TEST")
        }
    }
    
}



function updateOrCreatePlayerSprite(uid, playerData) {
    const { x, y, direction } = playerData;
    let sprite = playerSprites[uid];

    if (!sprite) {
        console.log("TEST3")

        sprite = createPlayerSprite(uid,x, y, direction);
        playerSprites[uid] = sprite;
    } else {
        console.log("TEST2")

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.direction = direction;
        sprite.moving = false;
        sprite.image = sprite.sprites[direction] || sprite.sprites.down;
        sprite.draw();
    }
}

function createPlayerSprite(uid, x, y, direction) {
    const sprite = new Sprite({
        position: { x, y },
        image: joueur,
        frames: { max: 4 },
        sprites: {
            up: joueurHaut,
            left: joueurGauche,
            right: joueurDroite,
            down: joueur
        }
    });
    sprite.direction = direction || 'down';
    sprite.image = sprite.sprites[sprite.direction];
    sprite.moving = true;
    return sprite;
}


function drawPlayerSprite(x, y, direction) {
    const sprite = new Sprite({
        position: {
            x: x,
            y: y
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
    });

    switch (direction) {
        case 'up':
            sprite.direction = 'up';
            sprite.image = sprite.sprites.up;
            break;
        case 'down':
            sprite.direction = 'down';
            sprite.image = sprite.sprites.down;
            break;
        case 'left':
            sprite.direction = 'left';
            sprite.image = sprite.sprites.left;
            break;
        case 'right':
            sprite.direction = 'right';
            sprite.image = sprite.sprites.right;
            break;
        default:
            sprite.direction = 'down';
            sprite.image = sprite.sprites.down;
            break;
    }
    sprite.moving = true;



    return sprite;
}



function animate() {
    window.requestAnimationFrame(animate);
    const cameraOffsetX = canvas.width / 2 - player.position.x;
    const cameraOffsetY = canvas.height / 2 - player.position.y;
    if (player.direction !== 'right' || player.direction !== 'left' || player.direction !== 'up' || player.direction !== 'down') {
        player.direction = 'down';
    }
    c.save();
/*     c.translate(cameraOffsetX, cameraOffsetY);
 */    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    if (keys.z.pressed && lastKey === 'z') {
        player.direction = 'up';
        player.image = player.sprites.up;
    } else if (keys.q.pressed && lastKey === 'q') {
        player.direction = 'left';
        player.image = player.sprites.left;
    } else if (keys.s.pressed && lastKey === 's') {
        player.direction = 'down';
        player.image = player.sprites.down;
    } else if (keys.d.pressed && lastKey === 'd') {
        player.direction = 'right';
        player.image = player.sprites.right;
    }
    player.draw();
    c.restore();
    let moving = true;
    player.moving = false;

    let playerX = player.position.x;
    let playerY = player.position.y;
    if (keys.z.pressed && lastKey === 'z') {
        playerY -= 1.3;
        player.moving = true;
        player.image = player.sprites.up;
    } else if (keys.q.pressed && lastKey === 'q') {
        playerX -= 1.3;
        player.moving = true;

        player.image = player.sprites.left;
    } else if (keys.s.pressed && lastKey === 's') {
        playerY += 1.3;
        player.moving = true;

        player.image = player.sprites.down;
    } else if (keys.d.pressed && lastKey === 'd') {
        playerX += 1.3;
        player.moving = true;

        player.image = player.sprites.right;
    }
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: boundary
        })) {
            console.log('collision');
            moving = false;
            break;
        }
    }
    if (moving) {
        player.position.x = playerX;
        player.position.y = playerY;
        if (!firebase.auth().currentUser) {
            return;
        }

        const playerId = firebase.auth().currentUser.uid;
        updatePlayerLocation(playerId, player.position.x, player.position.y, player.direction);
        movables.forEach((movable) => {
            movable.position.x += 0;
        });
    }
}
animate()



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