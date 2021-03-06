


MissionHomecoming.Game = function(){
	this.playerMinAngle = -20;
	this.playerMaxAngle = 20;

	this.coinRate = 4000;
	this.coinTimer = 0;

	this.enemyRate = 2500;
	this.enemyTimer = 0;
	
	this.score = 0;
};
MissionHomecoming.Game.prototype = {
	create : function(){
		this.background = this.game.add.tileSprite(0, 0, this.game.width , 700,'background');
		this.background.autoScroll(0 , 100);
		// this.foreground = this.game.add.tileSprite(0, 470, this.game.width , this.game.height - 533, 'foreground');
		// this.foreground.autoScroll(-100 , 0);
		// this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
		// this.ground.autoScroll(-400 , 0);
		this.player = this.add.sprite(700, this.game.height/1.2, 'player');
		this.player.anchor.setTo(0.5);
		//this.player.scale.setTo(0.01);

		this.player.animations.add('fly', [0,1,2,3,2,1]);
		this.player.animations.play('fly', 8 , true);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);


		this.game.physics.arcade.gravity.y = 400;

		this.game.physics.arcade.enableBody(this.background);
		this.background.body.allowGravity = false;
		this.background.body.immovable = true;

		this.game.physics.arcade.enableBody(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.set(0.25);

		this.coins = this.game.add.group();
		this.enemies = this.game.add.group();

		this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: 0', 24);

		this.jetSound = this.game.add.audio('rocket');
		this.coinSound = this.game.add.audio('coin');
		this.deathSound = this.game.add.audio('death');
		this.gameMusic = this.game.add.audio('gameMusic');
		this.gameMusic.play ('', 0, true);

	},
	update: function(){
		// if(this.game.input.activePointer.isDown){
		// 	this.player.body.velocity.y - 25;
		// }
		// if(this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown){
		// 	if(this.player.angle > 0){
		// 	   this.player.angle = 0;
		// }
		// if(this.player.angle > this.playerMinAngle){
		// 	   this.player.angle -=0.5;
		//     }
		// } else if(this.player.body.velocity.y >=0 && !this.game.input.activePointer.isDown){
		// 	if(this.player.angle < this.playerMaxAngle){
		// 		this.player.angle += 0.5;
		// 	}
		// }

		this.cursors = this.input.keyboard.createCursorKeys();
		if(this.cursors.up.isDown){
			this.player.body.velocity.y -= 15;
		} else if(this.cursors.down.isDown){
			this.player.body.velocity.y += 15;
		} else if(this.cursors.left.isDown){
			this.player.body.velocity.x -= 15;
		} else if(this.cursors.right.isDown){
			this.player.body.velocity.x += 15;
		}

		if(this.coinTimer < this.game.time.now){
			this.createCoin();
			this.coinTimer = this.game.time.now + this.coinRate;
		}
		 if(this.enemyTimer < this.game.time.now){
            this.createEnemy();
            this.enemyTimer = this.game.time.now + this.enemyRate;
		}
		

		this.game.physics.arcade.collide(this.player, this.background, this.groundHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
    
},
	shutdown: function(){
		this.coins.destroy();
		this.enemies.destroy();
		this.score = 0;
		this.coinTimer = 0;
		this.enemyTimer = 0;

},

	// createCoin : function(){

	// 	var x = this.game.height;

	// 	var y = this.game.rnd.integerInRange(50, this.game.world.height -192);

	// 	var coin = this.coins.getFirstExists(false);
	// 	this.coins.scale.setTo(0.5);
	// 	if(!coin){
	// 		coin = new Coin(this.game , 0 ,0);

	// 		this.coins.add(coin);
	// 		this.coins.scale.setTo(0.5);

	// 	}
		
	// 	coin.reset(x,y);
	// 	coin.revive();
	// },
	createCoin : function(){

		this.coins.scale.setTo(0.5);
		var y = this.game.height;

		var x = this.game.rnd.integerInRange(50, this.game.world.width);

		var coin = this.coins.getFirstExists(false);
		if(!coin){
			coin = new Coin(this.game , 0 ,0);
			this.coins.add(coin);
		}
		
		coin.reset(x,0);
		coin.revive();
	},	
	 createEnemy: function() {

		 var y = this.game.height;		 
         var x = this.game.rnd.integerInRange(50, this.game.world.width);

         var enemy = this.enemies.getFirstExists(false);
         if(!enemy) {
        	enemy = new Enemy(this.game, 0 ,0);
            this.enemies.add(enemy);
         }
         enemy.reset(x, 0);
         enemy.revive();
     },

	groundHit : function(player , background){
	player.body.velocity.y = -200;
   },
   coinHit: function(player, coin){
	this.score++;
	this.coinSound.play(); //play the coin sound when player hits the coin, no need to loop
	coin.kill();

	var dummyCoin = new Coin(this.game, coin.x , coin.y); // get the position of the coins and save it to dummyCoin
	this.game.add.existing(dummyCoin);

	dummyCoin.animations.play('spin', 40, true); //animation when the coin get hit, "animation name", 'speed', 'loop'

	//transition to upper left when the coin get hit

	var scoreTween = this.game.add.tween(dummyCoin).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);
	
	scoreTween.onComplete.add(function(){
		dummyCoin.destroy(); //destroy coin
		this.scoreText.text = 'Score: ' + this.score; // show the score when the coin flies towards upper left

	}, this);
	
	},
	enemyHit: function(player, enemy){
	player.kill();
	enemy.kill();

	this.deathSound.play(); // play the death sound when the player hit the enemy
	this.gameMusic.stop(); // end the game music

	//this.ground.stopScroll();
	this.background.stopScroll();
	//this.foreground.stopScroll();

	this.enemies.setAll('body.velocity.x', 0);
	this.coins.setAll('body.velocity.x', 0);

	this.enemyTimer = Number.MAX_VALUE;
	this.coinTimer = Number.MAX_VALUE;

	var scoreboard = new Scoreboard(this.game);
	scoreboard.show(this.score);

}
};