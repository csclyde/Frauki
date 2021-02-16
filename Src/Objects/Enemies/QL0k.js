Enemy.prototype.types['QL0k'] =  function() {

	this.body.setSize(40, 20, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 0.75);

    this.animations.add('idle', ['QL0k/Shoot0001'], 10, false, false);
    this.animations.add('shoot', ['QL0k/Shoot0001', 'QL0k/Shoot0002', 'QL0k/Shoot0003', 'QL0k/Shoot0004', 'QL0k/Shoot0005', 'QL0k/Shoot0006'], 16, false, false);

    this.energy = 1;

    this.damage = 2;

    this.robotic = true;
    this.isSolid = true;
    this.hasShot = false;

    this.base = game.add.image(0, 0, 'EnemySprites', 'QL0k/Shoot0000');
    this.base.anchor.setTo(0.5, 0.5);
    this.base.x = this.x + 5;
	this.base.y = this.y - 37;
	
	this.shotCount = 0;

    //this.addChild(this.base);
    
	this.updateFunction = function() {
		var idealRotation = Math.atan2(frauki.body.center.y - this.body.center.y, frauki.body.center.x - this.body.center.x);

		if(!this.CanSeePlayer()) {
			if(this.scale.y === 1) {
				idealRotation = 0;
			} else {
				idealRotation = Math.PI;
			}

		} else if((this.rotation < (Math.PI * -0.5) && this.rotation > (Math.PI * -1))
				|| (this.rotation <= Math.PI && this.rotation > Math.PI * 0.5)) {
			this.scale.y = -1;
			this.scale.x = 1;

			// if(idealRotation > -2.2) idealRotation = -2.2;
			// if(idealRotation < 0) idealRotation = 0;

		} else {
			this.scale.y = 1;
			this.scale.x = 1;

			// if(idealRotation < -1) idealRotation = -1;
		}

		var rotFactor = 0.1;

		if(this.timers.TimerUp('rotation_wait') && this.state !== this.PreShooting && this.state !== this.Shooting) {
			if(Math.abs(this.rotation - idealRotation) < 0.05) {
				this.roation = idealRotation;
				this.facingPlayer = true;

			} else if(Math.abs(this.rotation - idealRotation) > 3) {
				this.rotation = idealRotation;
				this.facingPlayer = true;

			} else if(this.rotation < idealRotation) {
				this.rotation += rotFactor;
				this.facingPlayer = false;

			} else if(this.rotation > idealRotation) {
				this.rotation -= rotFactor;
				this.facingPlayer = false;
			}
		}
	};

	this.Act = function() {

        if(this.CanSeePlayer() && this.timers.TimerUp('shoot') && this.facingPlayer) {

            this.Shoot();

        } else {
            this.state = this.Idling;
        }
    };

    this.CanSeePlayer = function() {
    	return EnemyBehavior.Player.IsVisible(this) && !EnemyBehavior.Player.IsAbove(this) && EnemyBehavior.Player.Distance(this) < 250;
    };

	this.CanCauseDamage = function() { return false; }

	this.GetCurrentDamage = function() {
	    return 1;
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Shoot = function() {
		this.state = this.Shooting;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		return true;
	};

	this.Shooting = function() {
		this.PlayAnim('shoot');

		if(EnemyBehavior.Player.IsVisible(this) && this.animations.currentFrame.name === 'QL0k/Shoot0005' && this.hasShot == false) {
			projectileController.LaserBolt(this, this.rotation, this.scale.y);
			events.publish('play_sound', {name: 'QL0k_attack', restart: true});

			this.hasShot = true;
		}

		if(this.animations.currentAnim.isFinished) {

			this.shotCount++;

			if(this.shotCount % 3 === 0) {
				this.timers.SetTimer('shoot', 800);
			} else {
				this.timers.SetTimer('shoot', 100);
			}

			this.timers.SetTimer('rotation_wait', 100);
			this.hasShot = false;

			return true;
		}

		return false;
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
