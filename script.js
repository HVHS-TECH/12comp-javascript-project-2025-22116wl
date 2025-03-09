var scene;

const canvasSizeX = 500;
const bulletSpeed = 25;
//canvas size Y is just window height

function preload() {

}

function setup() {
    cnv = new Canvas(windowWidth, windowHeight);

    mainGunTurret = new Sprite(windowWidth/2, windowHeight, 120, 20, 'k');
    mainGunTurret.color = 'red';

    mainGunBody = new Sprite(windowWidth/2, windowHeight, 150, 'k');
    mainGunBody.color = 'cyan';

    bullets = new Group();
}

function radToDeg(radian) {
    return 
}


function draw() {
    background('#FFFFD1');
    
    //Position main gun turret
    angleToMouse = Math.atan2((mouseY-mainGunBody.y), (mouseX - mainGunBody.x));
    
    distance = mainGunTurret.width;
    
    mainGunTurret.rotation = angleToMouse  * (180/Math.PI);
    
    mainGunTurret.x = mainGunBody.x + Math.cos(angleToMouse) * distance;
    mainGunTurret.y = mainGunBody.y + Math.sin(angleToMouse) * distance;


    if (mouseIsPressed == true) {
        spawnBullet();
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

    //spawn at end of gun turret
    bullet.x = mainGunTurret.x + Math.cos(angleToMouse) * mainGunTurret.width/2;
    bullet.y = mainGunTurret.y + Math.sin(angleToMouse) * mainGunTurret.width/2;

    bullet.rotation = mainGunTurret.rotation;

    bullet.vel.x = Math.cos(angleToMouse) * bulletSpeed;
    bullet.vel.y = Math.sin(angleToMouse) * bulletSpeed;
}