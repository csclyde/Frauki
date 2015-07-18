Enemy.prototype.types['Bizarro'] =  function() {

	this.body.setSize(11, 50, 0, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('stand', ['Bizarro/Stand0000'], 10, true, false);
	this.animations.add('flip', ['Bizarro/Flip0000', 'Bizarro/Flip0001', 'Bizarro/Flip0002', 'Bizarro/Flip0003', 'Bizarro/Flip0004'], 14, true, false);
    this.animations.add('attack', ['Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003', 'Bizarro/Attack0003',], 14, false, false);

    this.weight = 0.5;
    this.energy = 10;
    this.damage = 8;
    this.baseStunDuration = 500;
    this.poise = 10;

    this.body.bounce.set(0);
    
	this.updateFunction = function() {

		if(this.state !== this.Rolling && this.state !== this.Attacking) {
			if(!this.body.onFloor()) {
				this.PlayAnim('flip');
			} else {
				this.PlayAnim('stand');
			}
		}

	};

	this.Vulnerable = function() {
		if(this.state === this.Rolling) {
			return false;
		}

		return true;
	}

	this.CanCauseDamage = function() {
		if(this.state === this.Attacking) {
			return true;
		}
		
		return false;
	}
 
	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;

	};

	this.Roll = function() {
		if(!this.timers.TimerUp('roll_wait'))
			return;

		if(frauki.body.center.x < this.body.center.x)
			this.body.velocity.x = -500;
		else
			this.body.velocity.x = 500;

		this.state = this.Rolling;
		this.timers.SetTimer('roll', 400);
	};

	this.Attack = function() {
		if(!this.timers.TimerUp('attack_wait'))
			return;

		this.ChargeAtPlayer(350);

		this.state = this.Attacking;
	};

	this.Bail = function() {
		if(!this.timers.TimerUp('bail_wait'))
			return;

		this.timers.SetTimer('bail_wait', 2000 + (Math.random() * 1500));

		this.body.velocity.y = -500;

		if(frauki.body.center.x < this.body.center.x)
			this.body.velocity.x = 100;
		else
			this.body.velocity.x = -100;
	};

	this.SlashAttack = function() {
		if(!this.timers.TimerUp('attack_wait'))
			return;

		//parabolic arc
		var duration = 0.6;
		this.body.velocity.x = (frauki.body.center.x - this.body.center.x) / duration;
		this.body.velocity.y = (frauki.body.center.y + -0.5 * game.physics.arcade.gravity.y * duration * duration - this.body.center.y) / duration;

		this.state = this.Attacking;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		//this.PlayAnim('stand');

		if(this.PlayerIsNear(70) && this.timers.TimerUp('roll_wait')) {
			this.Roll();
		} else if(frauki.Attacking() && this.PlayerIsNear(150) && this.timers.TimerUp('bail_wait')) {
			this.Bail();
		} else if(this.PlayerIsNear(150)) {
			this.Attack();
		} else if(!this.PlayerIsNear(200) && this.PlayerIsNear(400)) {
			this.SlashAttack();
		}

	};

	this.Hurting = function() {
		//this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

	this.Rolling = function() {
		this.PlayAnim('flip');

		if(this.timers.TimerUp('roll')) {

			if(this.RollDice(5, 2)) {
				this.Attack();
			} else {
				this.state = this.Idling;
				this.timers.SetTimer('roll_wait', 800 + Math.random() * 500);
			}
		}
	};

	this.Attacking = function() {
		this.PlayAnim('attack');

		this.body.width = 50;

		if(this.animations.currentAnim.isFinished) {
			this.state = this.Idling;
			this.timers.SetTimer('attack_wait', 1000 + Math.random() * 3000);
			this.body.width = 11;
		}
	};
};
