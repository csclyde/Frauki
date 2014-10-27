Enemy.prototype.types['Madman'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);
	this.body.bounce.x = 0.2;
	this.body.bounce.y = 0;

    this.animations.add('idle', ['TerraceMadman/Standing0000'], 10, true, false);
    this.animations.add('shit', ['TerraceMadman/Standing0000'], 10, true, false);

    this.attackTimer = 0;

    this.rollTimer = 0;
    this.state = this.Idling;
    this.weight = 0.8;

	this.updateFunction = function() {
	};

	this.Vulnerable = function() {
		if(this.state === this.Rolling)
			return false;
		else
			return true;
	}

	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}
    
	    //compute the velocity based on weight and attack knockback
	    //this.body.velocity.y = -400 - this.weight;

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 400;

	    this.state = this.Hurting;
	};

	this.Roll = function() {
		if(game.time.now < this.attackTimer)
			return;

		this.state = this.Rolling;

		if(frauki.body.center.x < this.body.center.x) {
			game.add.tween(this.body.velocity).to({x: -500}, 500, Phaser.Easing.Exponential.In, true);
		} else {
			game.add.tween(this.body.velocity).to({x: 500}, 500, Phaser.Easing.Exponential.In, true);
		}

		this.rollTimer = game.time.now + 1500;
	};

	this.Dodge = function() {
		if(game.time.now < this.attackTimer)
			return;

		if(this.state === this.Dodging || this.state === this.Smashing)
			return;

		this.body.velocity.y = -500;
		this.state = this.Dodging;
		this.attackTimer = game.time.now + 2000;

		if(this.body.center.x < frauki.body.center.x)
			this.body.velocity.x = -200;
		else if(this.body.center.x > frauki.body.center.x)
			this.body.velocity.x = 200;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsNear(150) && this.body.onFloor()) {
			this.state = this.Dodge;
		}
		else if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.x) < 300 && this.body.onFloor()) {
			this.Roll();
		}
	};

	this.Hurting = function() {
		this.PlayAnim('idle');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.Rolling = function() {
		this.PlayAnim('idle');

		//this.body.velocity.x = this.body.velocity.x;

		if(game.time.now > this.rollTimer || this.body.onWall()) {
			this.state = this.Idling;
			this.attackTimer = game.time.now + 2000;
		}
	};

	this.Dodging = function() {
		this.PlayAnim('idle');

		if(frauki.body.center.x < this.body.center.x + 30 && frauki.body.center.x > this.body.center.x - 30 && this.body.center.y < frauki.body.center.y - 100) {
			this.state = this.Smashing;
			this.body.velocity.y = 1000;
		} else if(this.body.onFloor()) {
			this.state = this.Idling;
		}
	};

	this.Smashing = function() {
		this.body.velocity.x = 0;

		if(this.body.onFloor()) {
			this.state = this.Idling;
			events.publish('camera_shake', { magnitudeX: 20, magnitudeY: 5, duration: 200});
		}
	};

};
