/* global Phaser */
/* global game */

var Preloader = function () {};
Preloader.Play = function () {};

Preloader.Play.prototype = {
  preload: function() {
    this.load.image("startButton", "../images/Start-icon.png");
    this.load.image("fleaTitle", "../images/Flea-Title.png");
    this.load.image("jumperTitle", "../images/Jumper-Title.png");
  },
  
  create: function () {
    this.stage.backgroundColor = "#000000";
		
    // scaling
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    this.CreateStartButton();
  },
  
  update: function () {
    this.preloadButton.anchor.set(0.5);
    this.fleaTitle.anchor.set(0.5);
    this.jumperTitle.anchor.set(0.5);
    
    this.fleaTitle.scale.setTo(0.35);
    this.jumperTitle.scale.setTo(0.35);
    
    if (game.input.activePointer.isDown) {
      game.state.start("Play");
    }
  },
  
  CreateStartButton: function () {
    this.preloadButton = game.add.sprite(this.world.centerX, this.world.centerY + 50, "startButton");
    this.fleaTitle = game.add.sprite(this.world.centerX, this.world.centerY - 100, "fleaTitle");
    this.jumperTitle = game.add.sprite(this.world.centerX, this.world.centerY - 50, "jumperTitle");
    
    // clicking start button
    this.preloadButton.inputEnable = true;
  }
};

game.state.add("Preloader", Preloader.Play);
game.state.start("Preloader", Preloader.Play);

