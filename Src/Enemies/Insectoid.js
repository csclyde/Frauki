Enemy.prototype.types['Insectoid'] =  function() {

	this.body.setSize(67, 25, 0, 0);

    this.animations.add('idle', ['Hop0000'], 10, true, false);
    this.animations.add('hop', ['Hop0001', 'Hop0002'], 10, false, false);
    this.animations.add('land', ['Hop0003', 'Hop0004'], 10, false, false);

    this.state = Idling;

    this.hopTimer = 0;
    this.scuttleTimer = 0;

	this.updateFunction = function() {
		if(game.physics.arcade.distanceBetween(this, frauki) < 100 && this.state !== this.Hopping) {
			game.physics.arcade.overlap(this, frauki, function() {
				this.Dodge();
			}, null, this);
		}
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Hop = function() {
		if(game.time.now < this.hopTimer)
			return;

		this.hopTimer = game.time.now + 2000;
		this.state = Hopping;

		this.body.velocity.y = -1 * ((Math.random() * 250));

		if(playerX < this.body.x) {
			this.body.velocity.x = -450;
			this.SetDirection('left');
		} else {
			this.body.velocity.x = 450;
			this.SetDirection('right');
		}
	};

	this.Scuttle = function() {
		if(game.time.now < this.scuttleTimer)
			return;

		this.scuttleTimer = game.time.now + 2000;
		this.state = Scuttling;

		if(playerX < this.body.x) {
			this.body.velocity.x = -500;
			this.SetDirection('left');
		} else {
			this.body.velocity.x = 500;
			this.SetDirection('right');
		}		
	};

	this.Dodge = function() {
		if(game.time.now < game.hopTimer)
			return;

		this.hopTimer = game.time.now + 4000;
		this.state = Hopping;

		this.body.velocity.y = -300;

		if(playerX < this.body.x) {
			this.body.velocity.x = 100;
			this.SetDirection('left');
		} else {
			this.body.velocity.x = -100;
			this.SetDirection('right');
		}
	};

	this.Creep = function(random) {
		this.state = Idling;

		if(random) {
			if(Math.abs(this.body.velocity.x) === 100)
				return;

			if(c) {
				this.body.velocity.x = -100;
				this.SetDirection('left');
			} else {
				this.body.velocity.x = 100;
				this.SetDirection('right');
			}
		}
		else {
			if(playerX < this.body.x) {
				this.body.velocity.x = -100;
				this.SetDirection('left');
			} else {
				this.body.velocity.x = 100;
				this.SetDirection('right');
			}
		}	
	};

	////////////////////////////////STATES////////////////////////////////////
	function Idling() {
		if(game.time.now < this.hitTimer)
			return;
		else
			this.alpha = 1.0;
		
		this.PlayAnim('idle');

		if(this.PlayerIsVisible() || this.PlayerIsNear(75)) {
			if(playerX < this.body.x) {
				this.SetDirection('left');
			} else {
				this.SetDirection('right');
			}
		} 
		else {
			if(Math.random() * 1000 < 10)
				this.Creep();

			return;
		}

		//in the future, test for the players bullets being near
		if(this.PlayerIsNear(100)) {
			if(Math.random() * 2 < 1) 
				this.Dodge();
			else
				this.Scuttle();
		} else if(Math.abs(this.body.y - playerY) < 40 && Math.abs(this.body.x - playerX) < 300) {
			this.Scuttle();
		} else if(Math.abs(this.body.x - playerX) > 100 && Math.abs(this.body.x - playerX) < 450) {
			this.Hop();
		} else {
			this.Creep();
		}
	};

	function Hopping() {
		this.PlayAnim('hop');

		if(this.body.velocity.y >= 0) {
			this.state = Landing;
		}
	};

	function Landing() {
		this.PlayAnim('land');

		if(this.body.onFloor()) {
			this.state = Idling;
			this.body.velocity.x = 0;
		}
	};

	function Scuttling() {
		this.PlayAnim('idle');

		if(game.physics.arcade.intersects(this.body, frauki.body)) {
			this.state = Idling;
			game.add.tween(this.body.velocity).to({x: 0}, 100, Phaser.Easing.Sinusoidal.Out, true);
		}
		if(game.time.now - this.scuttleTimer > 50) {
			this.state = Idling;
			this.body.velocity.x = 0;
		}
	};

	function Shooting() {

	};

};