var scene;

const bulletSpeed = 25;
const bulletFireRate = 10;
//canvas size Y is just window height

function preload() {

}

function setup() {
    cnv = new Canvas('5:7');

    mainGunTurret = new Sprite(cnv.width/2, cnv.height, 120, 20, 'k');
    mainGunTurret.color = 'red';

    mainGunBody = new Sprite(cnv.width/2, cnv.height, 150, 'k');
    mainGunBody.color = 'cyan';

    bullets = new Group();
}

function radToDeg(radian) {
    return radian * (180/Math.PI);
}

function degToRad(degrees) {
    return degrees * (Math.PI/180);
}



function draw() {
    background('#FFFFD1');
    
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
        if (bullet.y < -10) {
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