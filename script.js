var scene = 'menu';
const bulletSpeed = 25;
const bulletFireRate = 10; //frame gap between fires, lower # = more frequent

function setup() {
    cnv = new Canvas('5:7');

    mainGunTurret = new Sprite(cnv.hw, cnv.h - 120, 120, 20, 'k');
    mainGunTurret.color = 'red';
    mainGunTurret.rotation = 90;

    mainGunBody = new Sprite(cnv.hw, cnv.h, 150, 'k');
    mainGunBody.color = 'cyan';

    bullets = new Group();
}

function radToDeg(radian) {
    return radian * (180/Math.PI);
}

function degToRad(degrees) {
    return degrees * (Math.PI/180);
}


function drawButton(x, y, w, h, buttonFunction, fillColour, borderThickness) {

    //only draw the actual button if a fill colour is passed in
    if (fillColour != null) {
        fill(fillColour);
        strokeWeight(borderThickness);
        rect(x, y, w, h); // draw button
    }


    if (mouseIsPressed == true) {
        //check if mouse is withing bounding box of mouse (x pos minus half width, x pos plus half width etc.)
        if (mouseX > x-w/2 && mouseX < x +w/2 && mouseY < y+h/2 && mouseY > y-h/2) {
            //clicked on button
            buttonFunction();
        }
    }
}


function draw() {
    background('#FFFFD1');
    
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
    } '#DDDDDD', 3);

    
    fill('#000000');
    textAlign('center');
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
        lastFireFrame = frameCount
    }

    for (var i = 0; i < bullets.length; i++) {
        bullet = bullets[i];
        if (bullet.y < -10 || bullet.x < -10 || bullet.x > cnv.w + 10) {
            bullet.remove();
        }
    }
}


function spawnBullet() {
    bullet = new Sprite()
    bullets.add(bullet);

    bullet.width = 20;
    bullet.height = 10;
    
    bullet.color = "yellow"


    bullet.rotation = mainGunTurret.rotation;

    //spawn at end of gun turret
    bullet.x = mainGunTurret.x + Math.cos(degToRad(mainGunTurret.rotation)) * mainGunTurret.width/2;
    bullet.y = mainGunTurret.y + Math.sin(degToRad(mainGunTurret.rotation)) * mainGunTurret.width/2;


    bullet.vel.x = Math.cos(degToRad(bullet.rotation)) * bulletSpeed;
    bullet.vel.y = Math.sin(degToRad(bullet.rotation)) * bulletSpeed;
}