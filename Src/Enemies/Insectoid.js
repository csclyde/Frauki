Enemy.prototype.types['Insectoid'] =  function() {

	this.body.setSize(67, 25, 0, 0);

    this.animations.add('idle', ['Hop0000'], 10, true, false);
    this.animations.add('hop', ['Hop0001', 'Hop0002'], 10, true, false);
    this.animations.add('land', ['Hop0003', 'Hop0004'], 10, true, false);

    this.state = Idling;

    this.hopTimer = 0;
    this.scuttleTimer = 0;

    //events.subscribe('player_jump', this.Jump, this);

	this.updateFunction = function() {
		
	};

	////////////////////////////////STATES////////////////////////////////////
	function Idling() {
		this.PlayAnim('idle');

		if(this.PlayerIsVisible() || this.PlayerIsNear(100)) {
			if(playerX < this.body.x) {
				this.SetDirection('left');
			} else {
				this.SetDirection('right');
			}
		} 
		else {
			return;
		}

		if(Math.abs(this.body.y - playerY) < 40 && Math.abs(this.body.x - playerX) < 300) {
			if(this.game.time.now > this.scuttleTimer) {
				this.Scuttle();
				this.scuttleTimer = game.time.now + 5000;
			}
		}
		else if(Math.abs(this.body.x - playerX) > 100 && Math.abs(this.body.x - playerX) < 450) {
			if(this.game.time.now > this.hopTimer) {
				this.Hop();
				this.hopTimer = game.time.now + 4000;
			}
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

	function Dodging() {

	};

	function Shooting() {

	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Hop = function() {
		this.state = Hopping;

		this.body.velocity.y = -1 * ((Math.random() * 300) + 300);

		if(playerX < this.body.x) {
			this.body.velocity.x = -450;
			this.SetDirection('left');
		} else {
			this.body.velocity.x = 450;
			this.SetDirection('right');
		}
	};

	this.Scuttle = function() {
		this.state = Scuttling;

		if(playerX < this.body.x) {
			this.body.velocity.x = -500;
			this.SetDirection('left');
		} else {
			this.body.velocity.x = 500;
			this.SetDirection('right');
		}		
	}
};