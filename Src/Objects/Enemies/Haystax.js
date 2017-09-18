Enemy.prototype.types['Haystax'] =  function() {

	this.body.setSize(35, 35, 0, -9);
	this.anchor.setTo(0.5, 1);

    this.animations.add('idle', ['Misc/Haystax0000'], 10, true, false);
    this.animations.add('up', ['Misc/Haystax0001'], 10, true, false);

    this.energy = 1;
    this.damage = 1;
    
	this.updateFunction = function() {
		};

	this.body.immovable = true;

	this.Vulnerable = function() { 
		return true;
	};

	this.CanCauseDamage = function() { return false; }

	///////////////////////////////ACTIONS////////////////////////////////////

	this.Spit = function() {
		this.timers.SetTimer('spit', 500 + (Math.random() * 500));
		this.state = this.PoppedUp;

		projectileController.Tarball(this);
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(!EnemyBehavior.Player.IsNear(this, 50) && EnemyBehavior.Player.IsVisible(this) && this.CanAttack()) {
			this.Spit();
		}
		
	};

	this.PoppedUp = function() {
		this.PlayAnim('up');

		if(this.timers.TimerUp('spit')) {
			this.state = this.Idling;
			this.timers.SetTimer('attack_wait', 1000 + (Math.random() * 3000));
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
