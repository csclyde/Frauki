Enemy.prototype.types['Insectoid'] =  function() {

	this.body.setSize(67, 25, 0, 0);

    this.animations.add('idle', ['Hop0000'], 10, true, false);
    this.animations.add('hop', ['Hop0001', 'Hop0002'], 10, false, false);
    this.animations.add('land', ['Hop0003', 'Hop0004'], 10, false, false);
    this.animations.add('die', ['Die0000', 'Die0001', 'Die0002', 'Die0003'], 10, false, false);

    this.attackTimer = 0;

    this.body.bounce.set(0.5);

	this.updateFunction = function() {
		if(game.time.now < this.hitTimer)
			return;

		if(game.physics.arcade.distanceBetween(this, frauki) < 100 && this.state !== this.Hopping && frauki.state === frauki.Hurting) {
			game.physics.arcade.overlap(this, frauki, function() {
				this.Dodge(true);
			}, null, this);
		}

		if(this.body.velocity.x > 0) {
			this.SetDirection('right');
		} else if(this.body.velocity.x < 0) {
			this.SetDirection('left');
		}

		if(this.state !== this.PreScuttling && Math.abs(this.scale.x) !== 1) {
			this.scale.x /= 0.7;
		}
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Hop = function() {
		if(game.time.now < this.attackTimer || !this.body.onFloor())
			return;

		this.attackTimer = game.time.now + 300;
		this.state = this.PreHopping;
		this.scale.y = 0.7;

	};

	this.Scuttle = function() {
		if(game.time.now < this.attackTimer)
			return;

		this.attackTimer = game.time.now + 300;
		this.state = this.PreScuttling;
		this.scale.x =  this.scale.x * 0.7;
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

	this.Creep = function(random) {
		this.state = this.Idling;

		if(random) {
			if(Math.abs(this.body.velocity.x) === 100)
				return;

			if(c) {
				this.body.velocity.x = -100;
			} else {
				this.body.velocity.x = 100;
			}
		}
		else {
			if(playerX < this.body.x) {
				this.body.velocity.x = -100;
			} else {
				this.body.velocity.x = 100;
			}
		}	
	};

	this.TakeHit = function(power) {
		if(game.time.now < this.hitTimer)
        	return;
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -300 + this.weight;

	    var c = frauki.body.center.x < this.body.center.x ? 1 : -1;
	    this.body.velocity.x =  c * ((400 + (this.weight / 2)) * (frauki.currentAttack.knockback));

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 500;

	    this.state = this.Hurting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible()) {
			if(playerX < this.body.x) {
				this.SetDirection('left');
			} else {
				this.SetDirection('right');
			}
		} 
		else {
			if(Math.random() * 100 <= 5)
				this.Creep();

			return;
		}

		if(this.PlayerIsNear(50)) {
			if(Math.random() * 5 < 1) 
				this.Dodge();
			else
				this.Scuttle();
		} else if(Math.abs(this.body.y - playerY) < 40 && Math.abs(this.body.x - playerX) < 300 && this.body.onFloor()) {
			this.Scuttle();
		} else if(Math.abs(this.body.x - playerX) > 100 && Math.abs(this.body.x - playerX) < 450 && this.body.onFloor()) {
			this.Hop();
		} else {
			this.Creep();
		}
	};

	this.PreHopping = function() {
		this.PlayAnim('idle');

		if(game.time.now > this.attackTimer) {
			this.attackTimer = game.time.now + 2000;
			this.state = this.Hopping;
			this.scale.y = 1;

			this.body.velocity.y = -1 * ((Math.random() * 250));

			if(playerX < this.body.x) {
				this.body.velocity.x = -400;
			} else {
				this.body.velocity.x = 400;
			}
		}
	};

	this.Hopping = function() {
		this.PlayAnim('hop');

		if(this.body.velocity.y >= 0) {
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

	this.Hurting = function() {
		this.PlayAnim('die');

		if(game.time.now > this.hitTimer)
			this.state = this.Idling;
	};

};