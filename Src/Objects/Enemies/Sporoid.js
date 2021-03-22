Enemy.prototype.types['Sporoid'] =  function() {

	this.body.setSize(20, 16, 0, 0);
	this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Misc/Sporoid0000', 'Misc/Sporoid0001', 'Misc/Sporoid0002', 'Misc/Sporoid0003', 'Misc/Sporoid0004', 'Misc/Sporoid0005'], 10, true, false);
    this.animations.add('shit', ['Misc/Sporoid0000'], 10, true, false);

    this.body.allowGravity = false;
    this.body.bounce.set(0.3);
    this.baseStunDuration = 800;

    this.dashTimer = 0;
    this.dashWaitTimer = 0;
    this.shootTimer = 0;
    this.energy = 1;
    
	this.damage = 1;

	this.wandering = EnemyBehavior.FlipCoin() ? 'left' : 'right';
	this.hoverOffset = Math.random() * 800;	

	this.updateFunction = function() {
		if(this.body.velocity.x < 0) {
			this.SetDirection('left');
		} else if(this.body.velocity.x > 0) {
			this.SetDirection('right');				
		}
	};

	this.CanCauseDamage = function() {
		if(this.state === this.Dashing) {
			return true;
		} else {
			return false;
		}
	};

	this.LandHit = function() {
		effectsController.Dizzy(10000);
	}

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Dash = function() {
		if(!this.timers.TimerUp('dash_wait'))
			return;

		
		this.state = this.PreDashing;
		
		//this.Spore.explode(3000, 20);

		EnemyBehavior.FacePlayer(this);
		this.body.velocity.x = 0;

		this.timers.SetTimer('dash', 500);
		this.timers.SetTimer('dash_wait', 3000);
	};

	this.Shoot = function() {
		//var spore = game.add.sprite(this.body.center.x, this.body.center.y, 'Spore');
		//game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 500);
		//game.add.tween(spore.body).to({x: 0, y: 0}, 1000, Phaser.Easing.Exponential.Out, true);

	    this.timers.SetTimer('shoot', 1000);
	};

	this.Reset = function() {
		this.state = this.Idling;
		
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.body.blocked.left) {
			this.wandering = 'right';
		} else if(this.body.blocked.right) {
			this.wandering = 'left';
		}
		
		this.body.velocity.y = Math.sin(this.hoverOffset + GameState.gameTime / 300) * 50 + (Math.random() * 40 - 20);
		//this.body.velocity.x = Math.sin(GameState.gameTime / 1000) * 5;

		if(this.wandering === 'left') {
			this.body.velocity.x = -30;
		} else {
			this.body.velocity.x = 30;
		}

		if(EnemyBehavior.Player.IsNear(this, 120)) {
			this.Dash();
			return;
		}

		// if(EnemyBehavior.Player.IsNear(this, 150) && EnemyBehavior.Player.IsDangerous(this)) {
		// 	var vel = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);
		// 	vel = vel.normalize();
	
		// 	vel.setMagnitude(30);
	
		// 	this.body.velocity.x += vel.x;
		// 	this.body.velocity.y += vel.y;
		// }

		
	};

	this.PreDashing = function() {
		this.PlayAnim('idle');

		this.body.velocity.y = Math.sin((GameState.gameTime) / 30) * 200;
		this.body.velocity.x = 0;

		if(this.timers.TimerUp('dash')) {
			this.state = this.Dashing;
			this.timers.SetTimer('dash', 1000);
			game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 400);
		}
	};

	this.Dashing = function() {
		this.PlayAnim('idle');

		//

		this.body.velocity.x = this.body.velocity.x;
		this.body.velocity.y = this.body.velocity.y;

		if(this.timers.TimerUp('dash')) {
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;

			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
