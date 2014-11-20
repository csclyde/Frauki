Enemy.prototype.types['Lancer'] =  function() {

	this.body.setSize(11, 50, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('stand', ['Lancer/Stand0000'], 10, true, false);
	this.animations.add('run', ['Lancer/Run0000', 'Lancer/Run0001', 'Lancer/Run0002', 'Lancer/Run0003', 'Lancer/Run0004', 'Lancer/Run0005', 'Lancer/Run0006', 'Lancer/Run0007'], 14, true, false);
    this.animations.add('attack', ['Lancer/Attack0000', 'Lancer/Attack0001', 'Lancer/Attack0002', 'Lancer/Attack0003', 'Lancer/Attack0004', 'Lancer/Attack0005', 'Lancer/Attack0006', 'Lancer/Attack0007', 'Lancer/Attack0008', 'Lancer/Attack0009', 'Lancer/Attack0010', 'Lancer/Attack0011', 'Lancer/Attack0012', 'Lancer/Attack0013', 'Lancer/Attack0014', 'Lancer/Attack0015', 'Lancer/Attack0016', 'Lancer/Attack0017', 'Lancer/Attack0018', 'Lancer/Attack0019'], 20, false, false);

    this.weight = 0.5;
    this.energy = 8;
    this.damage = 12;
    this.baseStunDuration = 500;
    this.poise = 10;

    this.body.bounce.set(0);
    
	this.updateFunction = function() {

		if(this.state !== this.Running)
			this.body.acceleration.x = 0;

	};

	this.Vulnerable = function() {
		if(this.animations.frameName === 'Lancer/Attack0006' || this.animations.frameName === 'Lancer/Attack0007' || this.animations.frameName === 'Lancer/Attack0008' || this.animations.frameName === 'Lancer/Attack0009' || this.animations.frameName === 'Lancer/Attack0010' || this.animations.frameName === 'Lancer/Attack0011') {
			return false;
		}

		return true;
	};

	this.CanCauseDamage = function() {
		if(this.animations.frameName === 'Lancer/Attack0006' || this.animations.frameName === 'Lancer/Attack0007' || this.animations.frameName === 'Lancer/Attack0008' || this.animations.frameName === 'Lancer/Attack0009' || this.animations.frameName === 'Lancer/Attack0010' || this.animations.frameName === 'Lancer/Attack0011') {
			return true;
		}
		
		return false;
	};

	this.CanChangeDirection = function() {
		if(this.state === this.Attacking) {
			return false;
		}

		return true;
	}
 
	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;

	};

	this.Attack = function() {
		if(!this.timers.TimerUp('attack_wait') || !this.body.onFloor())
			return;

		if(frauki.body.center.x < this.body.center.x) {
			game.add.tween(this.body.velocity).to({x: -500}, 500, Phaser.Easing.Quartic.InOut, true).to({x: 0}, 600, Phaser.Easing.Quartic.InOut, true);
			this.SetDirection('left');
		} else {
			game.add.tween(this.body.velocity).to({x: 500}, 500, Phaser.Easing.Quartic.InOut, true).to({x: 0}, 600, Phaser.Easing.Quartic.InOut, true);
			this.SetDirection('right');
		}

		this.state = this.Attacking;
	};

	this.Run = function() {
		this.state = this.Running;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('stand');

		//this.body.velocity.x = 0;

		if(this.PlayerIsNear(75)) {
			this.Run();
		} else if(this.PlayerIsNear(175) && this.timers.TimerUp('attack_wait')) {
			this.Attack();
		}

	};

	this.Hurting = function() {
		//this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.Running = function() {
		this.PlayAnim('run');

		this.body.maxVelocity.x = 200;

		if(frauki.body.center.x < this.body.center.x) {
			this.body.acceleration.x = 3000;
		} else {
			this.body.acceleration.x = -3000;
		}

		if(this.PlayerIsNear(100)) {
			this.Attack();
		}
		if(!this.PlayerIsNear(300)) {
			this.state = this.Idling;
			this.body.velocity.x = 0;
			this.body.acceleration.x = 0;
		}
	}

	this.Attacking = function() {
		this.PlayAnim('attack');

		if(this.animations.frameName === 'Lancer/Attack0006' || this.animations.frameName === 'Lancer/Attack0007' || this.animations.frameName === 'Lancer/Attack0008' || this.animations.frameName === 'Lancer/Attack0009' || this.animations.frameName === 'Lancer/Attack0010' || this.animations.frameName === 'Lancer/Attack0011') {
			this.body.width = 75;
		}

		this.body.maxVelocity.x = 500;

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Idling;
			this.timers.SetTimer('attack_wait', 2500 + Math.random() * 2000);
			this.body.width = 11;
		}
	};
};
