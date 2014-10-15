Enemy.prototype.types['Buzzar'] =  function() {

	this.body.setSize(11, 27, 0, 0);
	this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Sting0000'], 10, true, false);
    this.animations.add('sting', ['Sting0001', 'Sting0002'], 10, false, false);

    

    this.wanderDirection = 'left';

    this.hitVel = 0;

    this.stingTimer = 0;
    this.stingRestTimer = 0;

    this.anger = 1;
    
    this.weight = 400;
    this.energy = 4;

	this.updateFunction = function() {

		if(this.scale.y > 1 && this.state !== this.Stinging) {
			this.scale.y = 1;
			this.scale.x /= 0.7;
		}

		this.body.allowGravity = false;
        this.body.gravity.y = 0;
	};

	///////////////////////////////ACTIONS////////////////////////////////////
	this.Sting = function() {
		if(frauki.body.y <= this.body.y)
			return;

		this.stingTimer = game.time.now + 300;
		this.stingRestTimer = game.time.now + 1500;

		this.state = this.PreStinging;
	};

	this.ChangeDirection = function() {
		var dir = Math.random() * 4;

		if(this.body.touching.up)
			this.wanderDirection = 'down';
		else if(this.body.touching.down)
			this.wanderDirection = 'up';
		else if(this.body.touching.left)
			this.wanderDirection = 'right';
		else if(this.body.touching.right)
			this.wanderDirection = 'left';
	    else if(dir <= 1)
	    	this.wanderDirection = 'left';
	    else if(dir <= 2)
	    	this.wanderDirection = 'up';
	    else if(dir <= 3)
	    	this.wanderDirection = 'right';
	    else if(dir <= 4)
	    	this.wanderDirection = 'down';
	};

	this.TakeHit = function(power) {
		if(game.time.now < this.hitTimer) {
			return;
		}
    
	    //compute the velocity based on weight and attack knockback
	    this.body.velocity.y = -350 - this.weight;

	    //a durability stat should modify how long they are stunned for. also, the amount of dmg
	    this.hitTimer = game.time.now + 1000;

	    this.state = this.Hurting;

	    if(this.anger < 4) this.anger++;
	};

	this.Reset = function() {
		this.anger = 1;
		this.state = this.Idling;
	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');
		
		this.body.velocity.y = Math.sin(game.time.now / 150) * 100 + (Math.random() * 40 - 20);
		this.body.velocity.x = Math.sin(game.time.now / 1000) * 20;

		switch(this.wanderDirection) {
			case 'left': this.body.velocity.x -= 30; break;
			case 'up':   this.body.velocity.y -= 30; break;
			case 'right': this.body.velocity.x += 30; break;
			case 'down': this.body.velocity.y += 30; break;
		}

		if(this.PlayerIsNear(640))
			this.state = this.Creepin;

		if(this.body.onFloor() || this.body.onWall())
			this.ChangeDirection();
	};

	this.PreStinging = function() {
		this.PlayAnim('idle');
		this.scale.y = 0.7;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;

		if(game.time.now > this.stingTimer) {
			this.stingTimer = game.time.now + 2000;
			this.state = this.Stinging;
			this.scale.y = 1.3;
			this.scale.x *= 0.8;
			game.physics.arcade.moveToXY(this, frauki.body.center.x, frauki.body.center.y, 450);
		}
	};

	this.Stinging = function() {
		this.PlayAnim('idle');

		if(this.game.time.now > this.stingTimer)
			this.state = this.Idling;

		if(this.body.onFloor() || this.body.onWall())
			this.state = this.Idling;

		game.physics.arcade.overlap(this, frauki, function() {
			this.state = this.Idling;
		}, null, this);
	};

	this.Hurting = function() {

		this.body.allowGravity = true;
        this.body.gravity.y = game.physics.arcade.gravity.y * 2;

		if(game.time.now > this.hitTimer) {

			if(this.anger >= 4)
	    		this.state = this.Enraged;
	    	else
				this.state = this.Idling;

			this.alpha = 1.0;
		}
        	
	};

	this.Creepin = function() {
		if(!this.PlayerIsVisible()) {
			this.state = this.Idling;
		}

		//move to a point somewhere above fraukis head
		var locus = {};
		locus.x = frauki.body.x + (Math.sin(game.time.now / 150) * 50);
		locus.y = frauki.body.y - 500 + (Math.sin(game.time.now / 150) * 100);

		game.physics.arcade.moveToXY(this, locus.x, locus.y, 40 * this.anger);

		if(Math.floor(Math.random() * 100) <= this.anger && game.time.now > this.stingRestTimer && this.PlayerIsVisible()) 
			this.Sting();
	};

	this.Enraged = function() {
		this.PlayAnim('idle');

		if(this.body.x < frauki.body.x)
			this.body.velocity.x += 10;
		else
			this.body.velocity.x -= 10;

		if(this.body.y < frauki.body.y)
			this.body.velocity.y += 10;
		else
			this.body.velocity.y -= 10;

		if(this.body.velocity.x > 600)
			this.body.velocity.x = 600;

		if(this.body.velocity.x < -600)
			this.body.velocity.x = -600;

		if(this.body.velocity.y > 600)
			this.body.velocity.y = 600;

		if(this.body.velocity.y < -600)
			this.body.velocity.y = -600;
	}

};
