Enemy.prototype.types['Sporoid'] =  function() {

	this.body.setSize(22, 17, 0, 0);

    this.animations.add('idle', ['Sporoid0000'], 10, true, false);

    this.body.allowGravity = false;
    this.body.bounce.set(0.3);

    this.dashTimer = 0;

	this.updateFunction = function() {
		
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.TakeHit = function(power) {
		if(game.time.now < this.hitTimer) {
			return;
		}
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -150 + this.weight;

	    var c = frauki.body.x < this.body.x ? 1 : -1;
	    this.body.velocity.x =  c * ((80 + (this.weight / 2)) * (frauki.currentAttack.knockback));

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 300;

	    this.state = this.Hurting;
	};

	this.Dash = function() {
		game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 450);
		this.state = this.Dashing;
		this.dashTimer = game.time.now + 1000;
	};

	this.Reset = function() {
		this.state = this.Idling;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 300) * 50 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;


		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(this.PlayerIsNear(80)) {
			this.Dash();
			return;
		}

		if(this.PlayerIsNear(300)) {
			if(frauki.body.center.x < this.body.center.x)
				this.body.velocity.x += 30;
			else
				this.body.velocity.x += -30;

			if(frauki.body.center.y < this.body.center.y)
				this.body.velocity.y += 30;
			else
				this.body.velocity.y += -30;
		}
	};

	this.Dashing = function() {
		this.PlayAnim('idle');

		this.body.velocity.x = this.body.velocity.x;
		this.body.velocity.y = this.body.velocity.y;

		if(game.time.now > this.dashTimer){
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;

			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		if(game.time.now > this.hitTimer) {
			this.state = this.Idling;
		}
	};

};