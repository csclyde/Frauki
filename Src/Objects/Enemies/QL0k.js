Enemy.prototype.types['QL0k'] =  function() {

	this.body.setSize(40, 20, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 0.75);

    this.animations.add('idle', ['QL0k/Shoot0001'], 10, false, false);
    this.animations.add('shoot', ['QL0k/Shoot0001', 'QL0k/Shoot0002', 'QL0k/Shoot0003', 'QL0k/Shoot0004', 'QL0k/Shoot0005', 'QL0k/Shoot0006'], 18, false, false);

    this.energy = 1;

    this.damage = 1;

    this.robotic = true;
    this.isSolid = true;

    this.base = game.add.image(0, 0, 'EnemySprites', 'QL0k/Shoot0000');
    this.base.anchor.setTo(0.5, 0.5);
    this.base.x = this.x;
    this.base.y = this.y - 37;

    //this.addChild(this.base);
    
	this.updateFunction = function() {
		var idealRotation;

		if(!this.CanSeePlayer()) {
			if(this.scale.y === 1) {
				idealRotation = 0;
			} else {
				idealRotation = 3.14;
			}

		} else if(EnemyBehavior.Player.IsLeft(this)) {
			this.scale.y = -1;
			this.scale.x = 1;
			idealRotation = Math.atan2(frauki.body.y + 10 - this.body.center.y, frauki.body.center.x - this.body.center.x);
			
			if(idealRotation > -2.2 && idealRotation < 0) idealRotation = -2.2;
		} else {
			this.scale.y = 1;
			this.scale.x = 1;
			idealRotation = Math.atan2(frauki.body.y + 10 - this.body.center.y, frauki.body.center.x - this.body.center.x);

			if(idealRotation < -1) idealRotation = -1;
		}

		var rotFactor = 0.1;

		if(this.timers.TimerUp('rotation_wait') && this.state !== this.PreShooting && this.state !== this.Shooting) {
			if(Math.abs(this.rotation - idealRotation) < 0.05) {
				this.roation = idealRotation;
			} else if(Math.abs(this.roation - idealRotation) > 3) {
				this.rotation = idealRotation;
			} else if(this.rotation < idealRotation) {
				this.rotation += rotFactor;
			} else if(this.rotation > idealRotation) {
				this.rotation -= rotFactor;
			}
		}

		//console.log(this.rotation)
	};

	this.Act = function() {

        if(this.CanSeePlayer() && this.timers.TimerUp('shoot')) {

            this.Shoot();

        } else {
            this.state = this.Idling;
        }
    };

    this.CanSeePlayer = function() {
    	return EnemyBehavior.Player.IsVisible(this) && !EnemyBehavior.Player.IsAbove(this);
    };

	this.CanCauseDamage = function() { return false; }

	this.GetCurrentDamage = function() {
	    return 1;
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Shoot = function() {
		this.state = this.PreShooting;
		this.timers.SetTimer('rotation_wait', 200);
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		return true;
	};

	this.PreShooting = function() {
		if(this.timers.TimerUp('rotation_wait')) {
			this.state = this.Shooting;
		}
	};

	this.Shooting = function() {
		this.PlayAnim('shoot');

		if(this.animations.currentAnim.isFinished) {

			
			if(EnemyBehavior.Player.IsVisible(this)) {
				projectileController.LaserBolt(this, this.rotation);
			}

			this.timers.SetTimer('shoot', 600);
			this.timers.SetTimer('rotation_wait', 200);

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
