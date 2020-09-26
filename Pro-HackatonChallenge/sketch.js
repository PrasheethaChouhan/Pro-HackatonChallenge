var man, man_running, man_collided;
var ground, invisibleGround,invisibleGround2, groundImage;
var PLAY=1;
var END=0;
var WON=2;
var gameState = PLAY;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var gameOver,restart,win;
var gameOverImage,restartImage;
var distance = 0;
var masksGroup, maskImage;
var sanitizerGroup, sanitizerImage;
var obstacle;
var maskCount = 0;
var sanitizerCount = 0;
var winimage;
var bg = "bg.jpg";
var backgroundImg;

function preload(){

  // load all images
  backgroundImg = loadImage(bg);
  man_running = loadAnimation("mario01.png","mario02.png","mario03.png");
  man_collided = loadImage("mario05.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("coronavirus-129.png");
  obstacle2 = loadImage("coronavirus-128.png");
  obstacle3 = loadImage("coronavirus-127.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("reset.png");
  maskImage = loadImage("mask-128.png");
  sanitizerImage = loadImage("sanitizer-128.png");
  winImage = loadImage("win.png");
}

function setup() {
  createCanvas(800, 400);
  
  man = createSprite(50,360,20,50);
  man.addAnimation("running", man_running);
  man.scale = 0.5;
  
  ground = createSprite(200,390,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;

  invisibleGround2 = createSprite(200,200,400,10);
  invisibleGround2.visible = false;
  
  gameOver = createSprite(400,100);
  gameOver.addImage("gameover",gameOverImage);
  gameOver.scale = 0.75;
  gameOver.visible =false;
  
  restart = createSprite(400,250);
  restart.addImage("Restart",restartImage);
  restart.scale = 0.5;
  restart.visible =false;

  win = createSprite(400,100);
  win.addImage("Win",winImage);
  win.scale = 1.0;
  win.visible =false;

  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  masksGroup = new Group();
  sanitizerGroup = new Group();
}

function draw() {
  background(backgroundImg);
  if(gameState===PLAY){
    
      distance = distance + Math.round(getFrameRate()/60);
      fill(0);
      textSize(20);
      textFont("Arial");
      text("Press space to jump...",10,40);
      text("Distance: "+ distance, 10,60);
      text("Mask Count: "+ maskCount, 10,100);
      text("Sanitizer Count: "+ sanitizerCount, 10,120);

      ground.velocityX = -(6 + 3*distance/100);
        
      if(keyDown("space")) {
        man.velocityY = -10;
      }
      
      man.velocityY = man.velocityY + 0.8
      
      if (ground.x < 0){
        ground.x = ground.width/2;
      }
      
      man.collide(invisibleGround);
      man.collide(invisibleGround2);
      spawnClouds();
      spawnObstacles();
      spawnMasks();
      spawnSanitizer();

    if(obstaclesGroup.isTouching(man)) {
      //console.log("state : " + gameState);
      gameState=END;
    }

    if(masksGroup.isTouching(man)) {
      maskCount++;
      masksGroup.get(0).destroy();
    }

    if(sanitizerGroup.isTouching(man)) {
      sanitizerCount++;
      sanitizerGroup.get(0).destroy();
    }

    if(maskCount >= 50 && sanitizerCount >=25 ) {
      gameState=WON;
    }

  }

 else if (gameState===END){
   gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    masksGroup.setVelocityXEach(0);
    sanitizerGroup.setVelocityXEach(0);
    //change the man animation
    man.changeAnimation("collison",man_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    masksGroup.setLifetimeEach(-1);
    sanitizerGroup.setLifetimeEach(-1);
  }
  
  else if (gameState===WON){
        win.visible =true;
        restart.visible = true;
        ground.velocityX = 0;
        man.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        masksGroup.setVelocityXEach(0);
        sanitizerGroup.setVelocityXEach(0);
        //change the man animation
        man.changeAnimation("collison",man_collided);
        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        masksGroup.setLifetimeEach(-1);
        sanitizerGroup.setLifetimeEach(-1);
  }

  if(mousePressedOver(restart)) {
    reset();
  }
   
  drawSprites();
}

//spawn the clouds
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = man.depth;
    man.depth = man.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

// spawn the covid virus
function spawnObstacles() {
  var randx = Math.round(random(500,600));
  var randy = Math.round(random(350,400));
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(randx,randy,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

// spawn the reset
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  win.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  masksGroup.destroyEach();
  sanitizerGroup.destroyEach();
  
  man.changeAnimation("running",man_running);
  
  distance = 0;
  maskCount = 0
  sanitizerCount = 0;
}

// spawn the Mask
function spawnMasks() {
  //write code here to spawn the masks
  var randx = Math.round(random(500,600));
  var randy = Math.round(random(300,400));
  if (frameCount % 120 === 0) {
    var mask = createSprite(randx,randy,10,40);
    mask.addImage(maskImage);
    mask.scale = 0.3;
    mask.lifetime = 300;
    mask.velocityX = -4;
    
    //add each cloud to the group
    masksGroup.add(mask);
  }
}


  // spawn the Sanitizer
function spawnSanitizer() {
  //write code here to spawn the masks
  var randx = Math.round(random(500,600));
  var randy = Math.round(random(300,400));
  if (frameCount % 150 === 0) {
    var sanitizer = createSprite(randx,randy,10,40);
    sanitizer.addImage(sanitizerImage);
    sanitizer.scale = 0.3;
    sanitizer.lifetime = 300;
    sanitizer.velocityX = -4;
    
    //add each cloud to the group
    sanitizerGroup.add(sanitizer);
  }
}
  
