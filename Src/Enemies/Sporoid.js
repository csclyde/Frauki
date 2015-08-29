Enemy.prototype.types['Sporoid'] =  function() {

	this.body.setSize(22, 17, 10, -3);
	this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Sporoid/Sporoid0000'], 10, true, false);
    this.animations.add('shit', ['Sporoid/Sporoid0000'], 10, true, false);

    this.body.allowGravity = false;
    this.body.bounce.set(0.3);
    this.baseStunDuration = 800;

    this.dashTimer = 0;
    this.dashWaitTimer = 0;
    this.shootTimer = 0;
    this.energy = 1;
    
    this.weight = 0.3;
    this.damage = 3;

	this.updateFunction = function() {

		//get the alignment right
		if(this.direction === 'left') {
			this.body.offset.x = -10;
		} else if(this.direction === 'right') {
			this.body.offset.x = 10;
		}
		
	};

	this.CanCauseDamage = function() {
		if(this.state === this.Dashing) {
			return true;
		} else {
			return false;
		}
	};

	this.Activate = function() {
		
	};

	this.Deactivate = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	this.Dash = function() {
		if(!this.timers.TimerUp('dash_wait'))
			return;

		game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 400);
		this.state = this.Dashing;
		
		//this.Spore.explode(3000, 20);

		this.timers.SetTimer('dash', 1000);
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

	this.Die = function() {
		
	}

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 300) * 50 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;

		// if(this.PlayerIsVisible() && this.timers.TimerUp('shoot')) {
		// 	this.Shoot();
		// }


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(this.PlayerIsNear(80)) {
			this.Dash();
			return;
		}

		if(this.PlayerIsNear(300)) {
			if(frauki.body.center.x < this.body.center.x)
				this.body.velocity.x += 30;
			else
				this.body.velocity.x += -30;

			if(frauki.body.center.y < this.body.center.y)
				this.body.velocity.y += 30;
			else
				this.body.velocity.y += -30;
		}
	};

	this.PreDashing = function() {
		this.PlayAnim('idle');

		if(this.timers.TimerUp('dash')) {
			this.state = this.Dashing;
			this.timers.SetTimer('dash', 1000);
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
