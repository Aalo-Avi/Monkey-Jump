var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running, monkey_collided, monkey_walk;
var ground, invisibleGround, groundImage;
var backgroundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  monkey_running =   loadAnimation("images/Monkey_01.png","images/Monkey_02.png","images/Monkey_03.png",
                                    "images/Monkey_04.png","images/Monkey_05.png","images/Monkey_06.png",
                                    "images/Monkey_07.png","images/Monkey_08.png","images/Monkey_09.png","images/Monkey_10.png");


  monkey_collided = loadAnimation("images/Monkey_01.png");
 
  
  groundImage = loadImage("images/ground.png");
  backgroundImage = loadImage("images/day.jpg");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/box.png");
  obstacle2 = loadImage("images/bush.png");
  
  gameOverImg = loadImage("images/gameOverText.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  createCanvas(displayWidth - 20, displayHeight-120);
  
  
  monkey = createSprite(100,180,20,50);
  
  monkey.addAnimation("running", monkey_running);

  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.25;
  
  ground = createSprite(200,400,700,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible = true;
  
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,500);
  restart.addImage(restartImg);
  
  

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,400,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  textSize(18);

  textFont("Georgia");
  textStyle(BOLD);
  fill("white");
  score = 0;
}

function draw() {
  
  camera.x = monkey.x;
  camera.y = monkey.y;

  gameOver.position.x = restart.position.x = camera.x

  background(backgroundImage);
  
  textAlign(RIGHT, TOP);
  text("Score: "+ score, -200,200);
 
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    

    if(keyDown("space") && monkey.y >= 159) {
      monkey.velocityY = -12;
    }
   
    
    monkey.velocityY = monkey.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/3;
    }
  
    monkey.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(monkey)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the monkey animation
  
    monkey.changeAnimation("collided",monkey_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }


  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(camera.x+width/2,370,10,40);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    obstacle.velocityX = ground.velocityX;
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  monkey.changeAnimation("running",monkey_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);

  obstacle.velocityX = ground.velocityX;
  
  score = 0;
  
}
