Enemy.prototype.types['QL0k'] =  function() {

	this.body.setSize(25, 50, 0, 0);
	this.body.moves = false;
	this.anchor.setTo(0.5, 0.75);

    this.animations.add('idle', ['QL0k/Shoot0001'], 10, false, false);
    this.animations.add('shoot', ['QL0k/Shoot0001', 'QL0k/Shoot0002', 'QL0k/Shoot0003', 'QL0k/Shoot0004', 'QL0k/Shoot0005', 'QL0k/Shoot0006'], 18, false, false);

    this.energy = 1;

    this.damage = 1;
    this.shotCount = 0;

    this.robotic = true;
    
	this.updateFunction = function() {
		if(EnemyBehavior.Player.IsLeft(this)) {
			this.scale.y = -1;
			this.scale.x = 1;
			this.rotation = Math.atan2(frauki.body.center.y - this.body.center.y, frauki.body.center.x - this.body.center.x);
		} else {
			this.scale.y = 1;
			this.scale.x = 1;
			this.rotation = Math.atan2(frauki.body.center.y - this.body.center.y, frauki.body.center.x - this.body.center.x);
		}

		//console.log(this.rotation)
	};

	this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this) && this.timers.TimerUp('shoot')) {

            this.Shoot();

        } else {
            this.state = this.Idling;
        }
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

		EnemyBehavior.FacePlayer(this);

		if(this.animations.currentAnim.isFinished) {

			
			if(EnemyBehavior.Player.IsVisible(this)) {
				//projectileController.Spore(this);
			}

			this.timers.SetTimer('shoot', 600);

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
