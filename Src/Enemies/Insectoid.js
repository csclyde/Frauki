Enemy.prototype.types['Insectoid'] =  function() {

	this.body.setSize(67, 25, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Hop0000'], 10, true, false);
    this.animations.add('hop', ['Hop0001', 'Hop0002'], 10, false, false);
    this.animations.add('land', ['Hop0003', 'Hop0004'], 10, false, false);
    this.animations.add('die', ['Die0000', 'Die0001', 'Die0002', 'Die0003'], 10, false, false);

    this.attackTimer = 0;
    this.weight = 800;

    this.squashTween = null;

    //this.body.bounce.set(0.5);

	this.updateFunction = function() {
		if(game.time.now < this.hitTimer)
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

		this.attackTimer = game.time.now + 4000;

		this.state = this.Hopping;

		this.body.velocity.y = -300;

		if(playerX < this.body.x) {
			this.body.velocity.x = 100;
		} else {
			this.body.velocity.x = -100;
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
		if(game.time.now < this.hitTimer)
        	return;
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -400 - this.weight;

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 400;

	    this.state = this.Hurting;

	    this.scale.y = 1;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsNear(50)) {
			if(Math.random() * 5 < 1) 
				this.Dodge();
			else
				this.Scuttle();
		} else if(this.body.center.y < frauki.body.y && this.body.center.x > frauki.body.center.x - 20 && this.body.center.x < frauki.body.center.x + 20 && !this.body.onFloor()) {
			this.Dive();
		} else if(Math.abs(this.body.y - playerY) < 40 && Math.abs(this.body.x - playerX) < 400 && this.body.onFloor()) {
			this.Scuttle();
		} else if(Math.abs(this.body.x - playerX) > 100 && Math.abs(this.body.x - playerX) < 450 && this.body.onFloor()) {
			this.Hop();
		} else {
			
		}
	};

	this.PreHopping = function() {
		this.PlayAnim('idle');

		if(playerX < this.body.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}

		if(game.time.now > this.attackTimer) {
			this.attackTimer = game.time.now + 2000;
			this.state = this.Hopping;
			this.scale.y = 1;

			this.body.velocity.y = (-1 * (Math.random() * 200)) - 100;

			if(playerX < this.body.x) {
				this.body.velocity.x = -400;
			} else {
				this.body.velocity.x = 400;
			}
		}
	};

	this.Hopping = function() {
		this.PlayAnim('hop');

		if(this.body.velocity.y >= 0 || this.body.onFloor()) {
			this.state = this.Landing;
		}
	};

	this.Landing = function() {
		this.PlayAnim('land');

		if(this.body.onFloor()) {
			this.state = this.Idling;
			this.body.velocity.x = 0;
		}
	};

	this.PreScuttling = function() {
		this.PlayAnim('idle');

		if(playerX < this.body.x) {
			this.SetDirection('left');
		} else {
			this.SetDirection('right');
		}			

		if(game.time.now > this.attackTimer) {
			this.attackTimer = game.time.now + 2000;
			this.state = this.Scuttling;

			if(frauki.body.x < this.body.x) {
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
			this.body.x--;
		else if(frauki.body.center.x > this.body.center.x)
			this.body.x++;
		
		if(this.body.onFloor()) {
			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(game.time.now > this.hitTimer) {
			if(Math.abs(this.body.y - playerY) < 40 && Math.abs(this.body.x - playerX) < 300 && this.RollDice(20, 12)) {
				this.Scuttle();
				this.attackTimer = game.time.now;
			}
			else if(Math.abs(this.body.x - playerX) > 100 && Math.abs(this.body.x - playerX) < 450) {
				this.Hop();
				this.attackTimer = game.time.now;
			}
			else {
				this.state = this.Idling;
			}
		}
	};

};
