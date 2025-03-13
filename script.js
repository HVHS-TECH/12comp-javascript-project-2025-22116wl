var scene = 'menu';
const bulletSpeed = 10;
const bulletFireRate = 10; //frame gap between fires, lower # = more frequent

function setup() {
    cnv = new Canvas('5:7');

    mainGunTurret = new Sprite(cnv.hw, cnv.h - 120, 120, 20, 'k');
    mainGunTurret.color = 'red';
    mainGunTurret.rotation = 90;

    mainGunBody = new Sprite(cnv.hw, cnv.h, 150, 'k');
    mainGunBody.color = 'cyan';

    bulletGroup = new Group()
    alienGroup = new Group()

    bulletGroup.collides(alienGroup, function(bullet, alien){
        bullet.remove();
        alien.health -= 20;
        console.log(alien.health);
    });
}

function radToDeg(radian) {
    return radian * (180/Math.PI);
}

function degToRad(degrees) {
    return degrees * (Math.PI/180);
}


function drawButton(x, y, w, h, buttonFunction, fillColour, borderThickness) {
    //only draw the background if a fill colour is passed in
    if (fillColour != null) {
        fill(fillColour);
        strokeWeight(borderThickness);
        rect(x, y, w, h); // draw button
        strokeWeight(2);
    }


    if (mouseIsPressed == true) {
        //check if mouse is withing bounding box of mouse
        if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
            //clicked on button
            buttonFunction();
        }
    }
}


function draw() {
    background('#BBBBBB');
    
    if (scene == 'game') {
        gameScreen();
    } else if (scene == 'menu') {
        menuScreen();
    }
}
function menuScreen() {
    console.log('menu');
    textSize(50);

    drawButton(cnv.hw - 300/2, cnv.hh - 100/2, 300, 100, function() {
        scene = 'game';
        spawnAlien();
    }, '#DDDDDD', 3);

    
    fill('#000000');
    textAlign(CENTER, CENTER);
    text('Play!', cnv.hw - 300/2, cnv.h/2 - 100/2, 300, 100);
}

function gameScreen() {
    //Position main gun turret
    angleToMouse = Math.atan2((mouseY-mainGunBody.y), (mouseX - mainGunBody.x));
        
    distance = mainGunTurret.width;

    mainGunTurret.rotation = radToDeg(angleToMouse);

    mainGunTurret.x = mainGunBody.x + Math.cos(angleToMouse) * distance;
    mainGunTurret.y = mainGunBody.y + Math.sin(angleToMouse) * distance;

    if (kb.pressing('space') && frameCount%bulletFireRate == 0) {
        spawnBullet();
    }

    for (let i = 0; i < bulletGroup.length; i++) {
        let bullet = bulletGroup[i];
        if (bullet.y < -10 || bullet.x < -10 || bullet.x > cnv.w + 10) {
            bullet.remove();
        }
    }

    
    for (let i = 0; i < alienGroup.length; i++) {
        let alien = alienGroup[i];

        if (alien.health <= 0) {
            alien.remove();
        }


        //Health bars

        fill(230, 230, 230);
        rect(alien.x - 20, alien.y + 35, 40, 8);

        fill(0, 255, 0);
        rect(alien.x - 20, alien.y + 35, alien.health/alien.startHealth * 40, 8);
    }

    if (frameCount % 300 == 0) {
        spawnAlien();
    }
}


function spawnBullet() {
    let bullet = new Sprite(0, 0, 20, 10);
    bulletGroup.add(bullet);

    bullet.width = 20;
    bullet.height = 10;
    
    bullet.color = "yellow";


    bullet.rotation = mainGunTurret.rotation;

    //spawn at end of gun turret
    bullet.x = mainGunTurret.x + Math.cos(degToRad(mainGunTurret.rotation)) * mainGunTurret.width/2;
    bullet.y = mainGunTurret.y + Math.sin(degToRad(mainGunTurret.rotation)) * mainGunTurret.width/2;


    bullet.vel.x = Math.cos(degToRad(bullet.rotation)) * bulletSpeed;
    bullet.vel.y = Math.sin(degToRad(bullet.rotation)) * bulletSpeed;
}

function spawnAlien() {
    let alien = new Sprite(cnv.hw, -10, 30, 30, "k");
    alienGroup.add(alien);

    alien.vel.y = 2;
    
    alien.startHealth = 100;
    alien.health = alien.startHealth;
}