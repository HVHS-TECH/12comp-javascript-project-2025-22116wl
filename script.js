var scene = 'menu';
var score = 0;
var highScore = 0;
var wave = 0;

const bulletSpeed = 15;
const bulletFireRate = 10; //frame gap between fires, lower # = more frequent

const sidegunRechargeRate = 0.5;
const lazerDepletionRate = 2;


//wave data
waveDataDictionary = [
    {aliens:5, alienFrequency: 1, bossHealth:0, scoreMult: 1},
    {aliens:10, alienFrequency: 1.2, bossHealth:200, scoreMult: 1},
    {aliens:12, alienFrequency: 1.4, bossHealth:300, scoreMult: 1.2},
    
]

function setup() {
    cnv = new Canvas('5:7');
    

    world.gravity = 0;
    guns = new Group();

    // main gun
    mainGunTurret = new Sprite(cnv.hw, cnv.h - 120, 20, 120, 'k');
    mainGunTurret.color = '#555555';
    
    mainGunBody = new Sprite(cnv.hw, cnv.h, 150, 'k');
    mainGunBody.color = '#999999';
    guns.add(mainGunBody);
    mainGunBody.turret = mainGunTurret;


    // left side lazer gun
    lazerTurret = new Sprite(cnv.w * 0.2, cnv.h - 60, 15, 60, 'k');
    lazerTurret.color = '#630005';

    lazerBody = new Sprite(cnv.w * 0.2, cnv.h, 80, 'k');
    lazerBody.color = '#b80009';
    lazerBody.energy = 0;
    guns.add(lazerBody);
    lazerBody.turret = lazerTurret;



    // right side canon gun
    canonTurret = new Sprite(cnv.w * 0.8, cnv.h - 60, 15, 60, 'k');
    canonTurret.color = '#00c2d4';

    canonBody = new Sprite(cnv.w * 0.8, cnv.h, 80, 'k');
    canonBody.color = '#008f9c';
    canonBody.energy = 0;
    guns.add(canonBody);
    canonBody.turret = canonTurret;


    
    bulletGroup = new Group()
    alienGroup = new Group()

    bulletGroup.collides(alienGroup, function(bullet, alien){
        bullet.remove();

        let damageDealt = 20; // arbitrary constant

        if (bullet.isCanon) {
            damageDealt = 100; 
        }

        alien.health -= damageDealt;
        score += Math.round(damageDealt / 10 * waveData['scoreMult']);
    });
}



function spawnBullet(turret, canon) {
    let bullet = new Sprite(0, 0, 20, 10, 'd');
    bulletGroup.add(bullet);

    bullet.isCanon = canon

    if (canon) {
        bullet.width = 30;
        bullet.height = 20;
        bullet.color = '#d99f00';
    } else {
        bullet.width = 20;
        bullet.height = 10;
        bullet.color = "yellow";
    }

    bullet.rotation = turret.rotation - 90;

    // spawn at end of gun turret

    bullet.x = turret.x + Math.sin(degToRad(turret.rotation)) * turret.height/2;
    bullet.y = turret.y - Math.cos(degToRad(turret.rotation)) * turret.height/2;

    bullet.vel.x = Math.cos(degToRad(bullet.rotation)) * bulletSpeed;
    bullet.vel.y = Math.sin(degToRad(bullet.rotation)) * bulletSpeed;
}

function spawnAlien(boss) {
    if (boss == null) { boss = false; }

    let padding = 50;

    let alien = new Sprite(random(padding, cnv.w - padding), -10, 30, "k");
    alien.mass = 99999999;
    console.log(alien);
    console.log(alien.mass);

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
        stroke("#000000");
        drawingContext.setLineDash([0, 0]);        
        rect(x - w/2, y - h/2, w, h); // draw button

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

    // draw boundary line
    stroke('red');
    strokeWeight(3);
    drawingContext.setLineDash([5, 10]);
    const lineHeight = 200;
    line(0, cnv.h - lineHeight, cnv.w, cnv.h-lineHeight);
    strokeWeight(0);


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

    mainGunTurret.x = cnv.hw;
    mainGunTurret.y = cnv.h - 120;
    mainGunTurret.rotation = 0;

    lazerBody.energy = 0;
    canonBody.energy = 0;

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
    

    drawButton(cnv.hw, cnv.hh + 70, 200, 60, "Return to menu", function() {
        resetGame();
        scene = 'menu';
    }, '#333333', 3);
}

var waveData

function startNewWave() {
    wave ++;

    if (wave > waveDataDictionary.length) {
        waveData = waveDataDictionary[waveDataDictionary.length - 1] // if no more waves are programmed just repeat last wave
    } else {
        waveData = waveDataDictionary[wave - 1]
    }


    remainingAliens = waveData['aliens'];
    interwavePause = true; // create a small pause between waves

    setTimeout(function() {
        interwavePause = false;

        for (var i = 1; i <= waveData['aliens']; i++) {
            setTimeout(function(count) {
                if (scene != 'game') { return; } // player has lost before alien spawned

                if ( count == Math.floor(waveData['aliens'] * 0.8) ) {
                    if (waveData['bossHealth'] > 0) {
                        spawnAlien(true);
                    } else {
                        spawnAlien(); //no boss this wave
                    }
                } else {
                    spawnAlien();
                }
    
    
            }, 2000/waveData['alienFrequency'] * (random(85, 115) / 100) * i, i)
        }

    }, 3000);


}

function clamp(number, lowerBound, upperBound) {
    return Math.min(Math.max(number, lowerBound), upperBound);
}

function getAngle(x1, y1, x2, y2) {
    return Math.atan2((y2 - y1), (x2 - x1));
}

var remainingAliens;
const turretRotationBuffer = 1; // in radians

function gameScreen() {
    // Rotate and position the gun turrets to point to mouse
    for (let i = 0; i < guns.length; i++) {
        let gunBody = guns[i];
        let turret = gunBody.turret;

        let bodyToMouse = getAngle(gunBody.x, gunBody.y, mouseX, mouseY)
        bodyToMouse = clamp(bodyToMouse, degToRad(-90) - turretRotationBuffer, degToRad(-90) + turretRotationBuffer); // clamp rotation
    

        turret.rotation = radToDeg(bodyToMouse) + 90;
        turret.x = gunBody.x + Math.cos(bodyToMouse) * turret.height;
        turret.y = gunBody.y + Math.sin(bodyToMouse) * turret.height;
    }


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
        text("Aliens Remaining: " + remainingAliens, cnv.hw, cnv.h / 8 + 100);
    }

    textSize(20);
    text("Score: " + score, cnv.hw, cnv.h / 8 + 50);

    if (kb.pressing('space') && frameCount%bulletFireRate == 0 && interwavePause == false) {
        spawnBullet(mainGunTurret, false);
    }

    if (kb.pressing('a') && interwavePause == false) {
        let angle = degToRad(lazerTurret.rotation);


        if (lazerBody.energy > 0) {
            lazerBody.energy -= lazerDepletionRate;
        }

        // reduce first then check to eliminate the 'sputtering' when holding down A at low energy

        if (lazerBody.energy > 3)  { // small padding (3)
            
            // get point at tip of lazer turret
            
            let startX = lazerTurret.x + Math.sin(angle) * lazerTurret.height/2;
            let startY = lazerTurret.y - Math.cos(angle) * lazerTurret.height/2;
            
            
            let endX = startX + Math.sin(angle) * 9999;
            let endY = startY - Math.cos(angle) * 9999;
            
            stroke('red');
            strokeWeight(3);
            drawingContext.setLineDash([0, 0]);
            line (startX, startY, endX, endY);
            strokeWeight(0);
            
            // find out which aliens are within beam
            
            for (var i = 0; i < alienGroup.length; i++) {
                let alien = alienGroup[i];
                let alienAngle = Math.atan((alien.x - startX)/ (startY - alien.y))
                
                // compare angle lazer is pointing, and angle between turret end and alein
                // make buffer angle small when it's further out
                
                let distance = Math.sqrt( ((alien.x - startX) ** 2) + ((startY - alien.y) ** 2) );
                
                if (Math.abs(angle - alienAngle) < (alien.width/2000)/(distance/1000)) { // in radians
                    // alien is in beam path
                    alien.health -= 1;
                }
                
            }   
        }
    }

    if (kb.pressed('d') && canonBody.energy > 99 && interwavePause == false) {
        // launch canon
        canonBody.energy = 0;
        spawnBullet(canonTurret, true);
    }

    lazerBody.energy += sidegunRechargeRate;
    if (lazerBody.energy > 100) { lazerBody.energy = 100; }

    canonBody.energy += sidegunRechargeRate;
    if (canonBody.energy > 100) { canonBody.energy = 100; }



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
            remainingAliens --;
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
        if ((cnv.h - alien.y) < 200) {
            scene = 'gameOver';

            if (score > highScore) {
                highScore = score;
            }
        }
    }


    // lazer energy
    fill(230, 230, 230);
    rect(lazerBody.x - 5, lazerBody.y - 100, 10, 40);

    fill(0, 255, 0);
    rect(lazerBody.x - 5, lazerBody.y - 100, 10, (lazerBody.energy/100) * 40);


    // canon energy
    fill(230, 230, 230);
    rect(canonBody.x - 5, canonBody.y - 100, 10, 40);

    fill(0, 255, 0);
    rect(canonBody.x - 5, canonBody.y - 100, 10, (canonBody.energy/100) * 40);


    if (remainingAliens <= 0) {
        startNewWave();
    }
}