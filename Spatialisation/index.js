const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i =0;i < collisions.length; i+=32){
    collisionsMap.push(collisions.slice(i,32 + i))
}


class Boundary {
    constructor({position}){
        this.position = position
        this.width = 64 //Car on a zoomé la map en 400% donc 16x4
        this.height = 64
    }

    draw(){
        c.fillStyle =  'rgba(255,0,0,0)'
        c.fillRect(this.position.x, this.position.y,this.width,this.height)
    }
}

const boundaries = []

const offset = {
    x: 0,
    y : -1600
}

collisionsMap.forEach((row,i) =>{
    row.forEach((symbol,j) => {
        if (symbol == 488)
        boundaries.push(
            new Boundary({
                position:{
                    x: j * 64 + offset.x,
                    y: i * 64 + offset.y
                }
            })
        )
    })
})

console.log(boundaries)



const image = new Image();
image.src = './images/France.png';

const joueur = new Image()
joueur.src = './images/playerDown.png'

const joueurHaut = new Image()
joueurHaut.src = './images/playerUp.png'

const joueurDroite = new Image()
joueurDroite.src = './images/playerRight.png'

const joueurGauche = new Image()
joueurGauche.src = './images/playerLeft.png'

class Sprite {
    constructor({position,image,frames = { max: 1 }, sprites}){
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed : 0 }
        
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
        this.image.width / this.frames.max ,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max, // render
        this.image.height
        )
        if (!this.moving)  return
        if (this.frames.max > 1){
            this.frames.elapsed++
        }
        if (this.frames.elapsed % 10 === 0){
        if (this.frames.val < this.frames.max - 1)
            this.frames.val++
        else this.frames.val = 0
        }
    }
}



const player = new Sprite ({
    position: {
        x:canvas.width /2 - 192 /4,
        y:canvas.height /2 - 68 /2
    },
    image: joueur,
    frames : {
        max : 4
    },
    sprites: {
        up: joueurHaut,
        left : joueurGauche,
        right : joueurDroite,
        down : joueur
    }
})

const background = new Sprite({
    position: { 
        x: offset.x,
        y: offset.y
    },
    image : image
})

const keys = {
    z: {
        pressed : false
    },
    q : {
        pressed : false
    },
    s : {
        pressed : false
    },
    d : {
        pressed : false
    }
}

const testBoundary = new Boundary({
    position: {
        x:300,
        y:300
    }
})

const movables = [background,...boundaries]

function rectangularCollision ({rectangle1, rectangle2}){ //la fonction qui définit les collisions entre rectangle 1(joueur) et rectangle2 (bloc collision)
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary)=> {
        boundary.draw()
    })
    player.draw()
    let moving = true
    player.moving = false
    if (keys.z.pressed && lastKey === 'z') {
        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                console.log('collision')
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y += 3;
        });
    } else if (keys.q.pressed && lastKey == 'q') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                console.log('collision')
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x += 3;
        });
    } else if (keys.s.pressed && lastKey === 's') {
        player.moving = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                console.log('collision')
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.y -= 3;
        })
    } else if (keys.d.pressed && lastKey == 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x -3,
                        y: boundary.position.y
                    }
                }
            })) {
                console.log('collision')
                moving = false
                break
            }
        }
        if (moving)
        movables.forEach((movable) => {
            movable.position.x -= 3;
        });
    }
}
animate()

let lastKey = ''
window.addEventListener('keydown',(e) =>{
    switch (e.key){
        case 'z':
            keys.z.pressed = true
            lastKey = 'z'
            break
        case 'q':
            keys.q.pressed = true
            lastKey = 'q'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup',(e) =>{
    switch (e.key){
        case 'z':
            keys.z.pressed = false
            break
        case 'q':
            keys.q.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})