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
    aliens = new Group();

    function deleteBullet(alien, bullet) {
		bullet.remove();
        //alien.health 
	}

	bullets.collides(aliens, deleteBullet);
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
        lastFireFrame = frameCount
    }

    for (var i = 0; i < bullets.length; i++) {
        bullet = bullets[i];
        if (bullet.y < -10 || bullet.x < -10 || bullet.x > cnv.w + 10) {
            bullet.remove();
        }
    }

    
    for (var i = 0; i < aliens.length; i++) {
        alien = aliens[i];
        console.log(alien.startHealth);
        console.log(alien.health);

        if (alien.health <= 0) {
            alien.remove();
        }
    }
}


function spawnBullet() {
    bullet = new Sprite(0, 0, 20, 10, 'k');
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

function spawnAlien() {
    alien = new Sprite(random(0, cnv.w, -20), -10, 30, 'k');
    aliens.add(alien);

    alien.vel.y = 2;
    
    alien.startHealth = 100;
    alien.health = alien.startHealth;
    
    console.log('spawn alien');
}