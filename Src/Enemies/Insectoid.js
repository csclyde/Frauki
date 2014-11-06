Enemy.prototype.types['Insectoid'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Insectoid/Hop0000'], 10, true, false);
    this.animations.add('hop', ['Insectoid/Hop0001', 'Insectoid/Hop0002'], 10, false, false);
    this.animations.add('land', ['Insectoid/Hop0003', 'Insectoid/Hop0004'], 10, false, false);
    this.animations.add('die', ['Insectoid/Die0000', 'Insectoid/Die0001', 'Insectoid/Die0002', 'Insectoid/Die0003'], 10, false, false);

    this.attackTimer = 0;
    this.weight = 0.6;
    this.damage = 7;

    this.squashTween = null;

    //this.body.bounce.set(0.5);

	this.updateFunction = function() {
		if(this.state === this.Hurting)
			return;

		if(game.physics.arcade.distanceBetween(this, frauki) < 100 && this.state !== this.Hopping && frauki.state === frauki.Hurting) {
			game.physics.arcade.overlap(this, frauki, function() {
				this.Dodge(true);
			}, null, this);
		}

		if(!!this.squashTween && !this.squashTween.isRunning) {
			this.scale.y = 1;
		}

		if(this.state !== this.Diving && this.angle !== 0)
			this.angle = 0;

		if(this.state !== this.Diving && this.body.width !== 67)
			this.body.setSize(67, 25, 0, 0);
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Hop = function() {
		if(game.time.now < this.attackTimer)
			return;

		this.attackTimer = game.time.now + 300;
		this.state = this.PreHopping;
		this.squashTween = game.add.tween(this.scale).to({y: 0.7}, 200, Phaser.Easing.Exponential.Out, true);
		//this.scale.y = 0.7;

	};

	this.Scuttle = function() {
		if(game.time.now < this.attackTimer)
			return;

		this.attackTimer = game.time.now + 300;
		this.state = this.PreScuttling;
	};

	this.Dodge = function(overrideFloorCondition) {
		if(game.time.now < game.attackTimer && (!this.body.onFloor() || !!overrideFloorCondition))
			return;

		this.attackTimer = game.time.now + 800;

		this.state = this.Hopping;

		this.body.velocity.y = -450;

		if(frauki.body.center.x < this.body.center.x) {
			this.body.velocity.x = 150;
		} else {
			this.body.velocity.x = -150;
		}
	};

	this.Dive = function() {
		this.state = this.Diving;
		this.body.velocity.y = 300;
		this.body.velocity.x = 0;
		this.body.setSize(25, 67, 0, 0);
		this.scale.x = 1;
		game.add.tween(this).to({angle: 90}, 100, Phaser.Easing.Exponential.Out, true);
		//this.angle = 90;
	};

	this.TakeHit = function(power) {

	    this.scale.y = 1;
	    
	    //if(this.RollDice(10, 3))
	        //this.Dodge();
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsNear(50)) {
				this.Scuttle();
		} else if(this.body.center.y < frauki.body.y && this.body.center.x > frauki.body.center.x - 20 && this.body.center.x < frauki.body.center.x + 20 && !this.body.onFloor()) {
			this.Dive();
		} else if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.y) < 400 && (this.body.onFloor() || this.body.velocity.y <= 0)) {
			this.Scuttle();
		} else if(Math.abs(this.body.center.x - frauki.body.center.x) > 50 && Math.abs(this.body.center.x - frauki.body.center.x) < 450) {
			this.Hop();
		} else {

		}
	};

	this.PreHopping = function() {
		this.PlayAnim('idle');

		if(frauki.body.center.x < this.body.center.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}

		if(game.time.now > this.attackTimer) {
			this.attackTimer = game.time.now + 2000;
			this.state = this.Hopping;
			this.scale.y = 1;

			this.body.velocity.y = (-1 * (Math.random() * 200)) - 100;

			if(frauki.body.center.x < this.body.center.x) {
				this.body.velocity.x = -400;
			} else {
				this.body.velocity.x = 400;
			}
		}
	};

	this.Hopping = function() {
		this.PlayAnim('hop');

		if(this.body.velocity.y >= 0 || this.body.onFloor()) {
			if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.y) < 400)
				this.Scuttle();
			else
				this.state = this.Landing;
		}
	};

	this.Landing = function() {
		this.PlayAnim('land');

		if(this.body.onFloor() || this.body.velocity.y <= 0) {
			this.state = this.Idling;
			this.body.velocity.x = 0;
		}
	};

	this.PreScuttling = function() {
		this.PlayAnim('idle');

		if(frauki.body.center.x < this.body.center.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}			

		if(game.time.now > this.attackTimer) {
			this.attackTimer = game.time.now + 2000;
			this.state = this.Scuttling;

			if(frauki.body.x < this.body.center.x) {
				this.body.velocity.x = -500;
			} else {
				this.body.velocity.x = 500;
			}	
		}
	};

	this.Scuttling = function() {
		this.PlayAnim('idle');

		if(game.physics.arcade.intersects(this.body, frauki.body)) {
			this.state = this.Idling;
			game.add.tween(this.body.velocity).to({x: 0}, 100, Phaser.Easing.Sinusoidal.Out, true);
		}
		if(game.time.now - this.attackTimer > 50) {
			this.state = this.Idling;
			this.body.velocity.x = 0;
		}
	};

	this.Shooting = function() {

	};

	this.Diving = function() {
		if(frauki.body.center.x < this.body.center.x)
			this.body.center.x--;
		else if(frauki.body.center.x > this.body.center.x)
			this.body.center.x++;
		
		if(this.body.onFloor() || this.body.velocity.y <= 0) {
			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.x) < 300 && this.RollDice(20, 12)) {
				this.Scuttle();
				this.attackTimer = game.time.now;
			}
			else if(Math.abs(this.body.center.x - frauki.body.center.x) > 100 && Math.abs(this.body.center.x - frauki.body.center.x) < 450) {
				this.Hop();
				this.attackTimer = game.time.now;
			}
			else {
				this.state = this.Idling;
			}
		}
	};

};
