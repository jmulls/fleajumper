/* global Phaser */

var Jumper = function () {};
Jumper.Play = function () {};

Jumper.Play.prototype = {
  preload: function () {
    this.load.image("flea", "../images/flea.png");
    this.load.image("dog", "../images/dog.png");
    
    
  },
  
  create: function () {
    // background color
    this.stage.backgroundColor = "#31B33A";
		
    // scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    //this.game.scale.setScreenSize(true);
    
    // physics
    this.physics.startSystem(Phaser.Physics.ARCADE);
    
    // camera and platform tracking
    this.cameraYMin = 99999;
    this.platformYMin = 99999;
		
    // create platforms
    this.platformsCreate();
    
    // create flea
    this.fleaCreate();
    
    // cursor controls
    this.cursor = this.input.keyboard.createCursorKeys();
  },
  
  update: function () {
    // setting bounds
    this.world.setBounds(0, -this.flea.yChange, this.world.width, this.game.height + this.flea.yChange);
    
    // a little camera tweaking so the camera can't go down
    this.cameraYMin = Math.min(this.cameraYMin, this.flea.y - this.game.height + 130);
    this.camera.y = this.cameraYMin;
    
    // flea collisions and movement
    this.physics.arcade.collide(this.flea, this.platforms);
    this.fleaMovement();
    
    // generating platforms in one area
    this.platforms.forEachAlive(function (elem) {
      this.platformYMin = Math.min(this.platformYMin, elem.y);
      if (elem.y > this.camera.y + this.game.height) {
        elem.kill();
        this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width - 50), this.platformYMin - 110, 1);
      }
    }, this);
		
		// world wrap
		game.world.wrap(this.flea, 0, true);
  },
  

  shutdown: function () {
    // reset world
    this.world.setBounds(0, 0, this.game.width, this.game.height);
    this.cursor = null;
    this.flea.destroy();
    this.flea = null;
    this.platforms.destroy();
    this.platforms = null;
  },
	
  platformsCreate: function() {
    // platform setup
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple(10, "dog");
    
    // creating base with side walls
    this.platformsCreateOne(-16, this.world.height - 16, this.world.width + 16);
    
    // create platforms to start
    for(var index = 0; index < 9; index++) {
      this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width-50), this.world.height - 125 - 110 * index, 1);
    }
    
  },
  
  platformsCreateOne: function(x, y, width) {
    var platform = this.platforms.getFirstDead();
    platform.reset(x, y);
    platform.scale.x = width;
    platform.scale.y = 1;
    platform.body.immovable = true;
    return platform;
  },
  
  fleaCreate: function() {
    // flea setup
    this.flea = game.add.sprite(this.world.centerX, this.world.height-140, "flea");
    this.flea.anchor.set(0.5);
    
    // track distance of flea
    this.flea.yOrig = this.flea.y;
    this.flea.yChange = 0;
    
    // setup collision and only allow down collisions
    this.physics.arcade.enable(this.flea);
    this.flea.body.gravity.y = 500;
    this.flea.body.checkCollision.up = false;
    this.flea.body.checkCollision.down = true;
    this.flea.body.checkCollision.left = false;
    this.flea.body.checkCollision.right = false;
  },
  
  fleaMovement: function() {
    // left and right movement
    if(this.cursor.left.isDown) {
      this.flea.body.velocity.x = -200;
    } else if (this.cursor.right.isDown) {
      this.flea.body.velocity.x = 200;
    } else {
      this.flea.body.velocity.x = 0;
    }
    
    // jumping
    if(this.flea.body.touching.down) {
      this.flea.body.velocity.y = -350;
			
		 
    }
    
    // track flea movement
    this.flea.yChange = Math.max(this.flea.yChange, Math.abs(this.flea.y - this.flea.yorig));
    
    // gameover
    if((this.flea.y > (this.cameraYMin + this.game.height)) && this.flea.alive) {
      this.state.start("GameOver");
    }
		
    var count = this.count;
    this.count = 0;
    var score = this.score;
    this.score = 0;
    for(count = 1; Number(this.flea.y) < (550 - (count * 110)); count++) {
      this.score++;
      }
	},
	
	render: function() {
		game.debug.text("Score: " + this.score, 16, 32);
	}
}

var game = new Phaser.Game(300, 500, Phaser.CANVAS);
game.state.add("Play", Jumper.Play);
