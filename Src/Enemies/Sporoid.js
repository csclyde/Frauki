Enemy.prototype.types['Sporoid'] =  function() {

	this.body.setSize(22, 17, 0, -7);

    this.animations.add('idle', ['Sporoid0000'], 10, true, false);

    this.body.allowGravity = false;
    this.body.bounce.set(0.3);

    this.dashTimer = 0;
    this.dashWaitTimer = 0;
    this.shootTimer = 0;
    this.energy = 3;
    
    this.weight = 0.3;
    this.damage = 3;

    this.Spore = game.add.emitter(0, 0, 100);
	this.Spore.makeParticles('Spore');
    this.Spore.gravity = -675;

    this.Spore.maxParticleScale = 0.4;
    this.Spore.minParticleScale = 0.1;

    this.Spore.minParticleSpeed.y = -20;
    this.Spore.maxParticleSpeed.y = 20;

    this.Spore.maxParticleSpeed.x = 20;
    this.Spore.minParticleSpeed.x = -20;
    //this.Spore.start(false, 5000, 400);

	this.updateFunction = function() {

		
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
		//this.Spore.start(false, 5000, 400);
	};

	this.Die = function() {
		this.Spore.destroy(true, true);
	}

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 300) * 50 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;

		this.Spore.x = this.body.center.x;
		this.Spore.y = this.body.center.y;

		if(this.PlayerIsVisible() && this.timers.TimerUp('shoot')) {
			this.Shoot();
		}


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(this.PlayerIsNear(100)) {
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

		//this.Spore.explode(3000, 20);

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
