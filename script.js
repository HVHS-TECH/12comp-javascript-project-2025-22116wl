var scene = 'menu';
var score = 0;
var highScore = 0;
var wave = 0;

const bulletSpeed = 10;
const bulletFireRate = 10; //frame gap between fires, lower # = more frequent


//wave data
waveDataDictionary = [
    {aliens:5, alienFrequency: 1, bossHealth:0, scoreMult: 1},
    {aliens:10, alienFrequency: 1.5, bossHealth:250, scoreMult: 1},
    {aliens:10, alienFrequency: 1.6, bossHealth:400, scoreMult: 1.2},
    
]

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

        let damageDealt = 20; // arbitrary constant

        alien.health -= damageDealt;
        score += Math.round(damageDealt / 10 * waveData['scoreMult']);
    });
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

function spawnAlien(boss) {
    if (boss == null) { boss = false; }

    let padding = 50;

    let alien = new Sprite(random(padding, cnv.w - padding), -10, 30, "k");

    if (boss) {
        alien.width = 60;

        alien.startHealth = waveData['bossHealth'];
    } else {
        alien.width = 30;
        alien.height = 30;

        alien.startHealth = Math.round(100 * (random(50, 150)/100)); //little bit of randomness
    }



    alienGroup.add(alien);

    alien.vel.y = 2;
    
    alien.health = alien.startHealth;

    //the wave down thing uses the Y pos, offset by this random number different for each alien for randomness
    alien.yRandomOffset = random(-2000, 2000);
    
    remainingAliens --;
}




function radToDeg(radian) {
    return radian * (180/Math.PI);
}

function degToRad(degrees) {
    return degrees * (Math.PI/180);
}


function drawButton(x, y, w, h, buttonText, buttonFunction, fillColour, borderThickness) {
    //only draw the background if a fill colour is passed in
    if (fillColour != null) {
        fill(fillColour);
        strokeWeight(borderThickness);
        rect(x - w/2, y - h/2, w, h); // draw button
        stroke("#FFFFFF");

        noStroke();
    }


    if (mouseIsPressed == true) {
        //check if mouse is withing bounding box of mouse
        if (mouseX > x-w/2 && mouseX < x+w/2 && mouseY > y - h/2 && mouseY < y + h/2) {
            //clicked on button
            buttonFunction();
        }
    }

    textSize(w/8);
    fill('#FFFFFF');
    textAlign(CENTER, CENTER);
    text(buttonText, x, y);
}


function draw() {
    background('#000011');
    
    if (scene == 'game') {
        gameScreen();
    } else if (scene == 'menu') {
        menuScreen();
    } else if (scene == 'gameOver') {
        gameOverScreen();
    }
}


function resetGame() {
    alienGroup.removeAll();

    wave = 0;
    score = 0;
}

var interwavePause = false;

function menuScreen() {
    textSize(50);

    drawButton(cnv.hw, cnv.hh, 300, 100, "Play", function() {
        scene = 'game';
        startNewWave();
    }, '#333333', 3);
}

function gameOverScreen() {
    textAlign(CENTER, CENTER);
    textSize(30);
    text('Score: ' + score, cnv.hw, cnv.h / 4);
    textSize(15);
    text('High Score: ' + highScore, cnv.hw, cnv.h / 4 + 50);    


    for (let i = 0; i < alienGroup.length; i++) {
        alienGroup[i].vel.y = 0;
        alienGroup[i].vel.x = 0;
    }

    drawButton(cnv.hw, cnv.hh, 250, 70, "Play Again", function() {
        resetGame();
        scene = 'game';
        startNewWave();
    }, '#333333', 3);
    

    drawButton(cnv.hw, cnv.hh + 70, 200, 60, "Reutrn to menu", function() {
        resetGame();
        scene = 'menu';
    }, '#333333', 3);
}

var waveData

function startNewWave() {
    wave ++;

    if (wave > waveDataDictionary.length) {
        waveData = waveDataDictionary[waveDataDictionary.length - 1] //if no more waves are programmed just repeat last wave
    } else {
        waveData = waveDataDictionary[wave - 1]
    }


    remainingAliens = waveData['aliens'];
    aliensKilledThisWave = 0;
    
    console.log('wave over');
    
    interwavePause = true;
    //create a small pause between waves - white interwavePause == true aliens don't spawn
    setTimeout(function() {
        interwavePause = false;
        console.log('wave starting!')
    }, 3000);
}

var remainingAliens;
var aliensKilledThisWave = 0;

function gameScreen() {
    //Position main gun turret
    angleToMouse = Math.atan2((mouseY-mainGunBody.y), (mouseX - mainGunBody.x));
        
    distance = mainGunTurret.width;

    mainGunTurret.rotation = radToDeg(angleToMouse);

    mainGunTurret.x = mainGunBody.x + Math.cos(angleToMouse) * distance;
    mainGunTurret.y = mainGunBody.y + Math.sin(angleToMouse) * distance;



    textSize(20);
    fill('#FFFFFF'); 
    textAlign(CENTER, CENTER);
    
    if (interwavePause == true) {
        textSize(60);  
        text("Wave " + wave + " Starting", cnv.hw, cnv.h / 8);
    } else {
        textSize(40);
        text("Wave: " + wave, cnv.hw, cnv.h / 8);

        textSize(20);
        text("Aliens Remaining: " + (waveData['aliens'] - aliensKilledThisWave), cnv.hw, cnv.h / 8 + 100);
    }

    textSize(20);
    text("Score: " + score, cnv.hw, cnv.h / 8 + 50);

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
            aliensKilledThisWave ++;
        }

        //alien x pos wave down
        let frequency = 100; // higher is less frequen
        let amplitude = 0.8;
        alien.vel.x = Math.sin((alien.y+alien.yRandomOffset)/frequency) * amplitude;
        
        
        //Health bars
        fill(230, 230, 230);
        rect(alien.x - 20, alien.y + alien.width + 5, 40, 8);

        fill(0, 255, 0);
        rect(alien.x - 20, alien.y + alien.width + 5, alien.health/alien.startHealth * 40, 8);


        //if distance between bottom of screen and alien is less that threshold then game over
        if ((cnv.h - alien.y) < 50) {
            scene = 'gameOver';

            if (score > highScore) {
                highScore = score;
            }
        }
    }
    
    //120 is constant that worked well for alien spawn frequency
    if (frameCount % Math.ceil(120/waveData['alienFrequency']) == 0 && remainingAliens > 0 && interwavePause == false) {
        
        //eight tenths of the way into the wave then spawn the boss
        if ( waveData['aliens'] - remainingAliens == Math.floor(waveData['aliens'] * 0.8) ) {
            if (waveData['bossHealth'] > 0) {
                spawnAlien(true);
            } else {
                spawnAlien(); //no boss this wave
            }
        } else {
            spawnAlien();
        }

    }

    if (remainingAliens <= 0 && alienGroup.length <= 0) {
        startNewWave();
    }
}