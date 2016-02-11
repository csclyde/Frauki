Enemy.prototype.types['Pincer'] =  function() {
	var that = this;

	this.body.setSize(25, 20, -10, 0);
	this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Pincer/Idle0001'], 10, true, false);
    this.animations.add('shit', ['Pincer/Idle0001'], 10, true, false);

    this.body.gravity.y = -800;

    this.body.maxVelocity.y = 300;
    this.body.maxVelocity.x = 300;

    this.playerWasSeen = false;

    //this.body.bounce.set(0);

    //create the body sections
    this.bodies = [];
    this.pathX = [];
    this.pathY = [];
    this.startTime = null;
    //this.bodies.push(game.add.sprite(this.body.center.x, this.body.center.y, 'EnemySprites', 'Pincer/Idle0003'));
    //game.physics.enable(this.bodies[0], Phaser.Physics.ARCADE);

    /*
    this.energy = 5;
    this.damage = 5;
    this.baseStunDuration = 500;
    this.poise = 10;
    */

   //  Frogland.easyStar_3.setCallbackFunction(function(path) {
   //      path = path || [];

   //      that.pathX = [];
   //      that.pathY = [];
        
 		// for(var i = 0; i < path.length; i++) {

 		// 	that.pathX.push(path[i].x * 16);
 		// 	that.pathY.push(path[i].y * 16);
 		// }

 		// that.startTime = game.time.now;
   //  });

   //  Frogland.easyStar_3.preparePathCalculation([95,90], [95,100]);
   //  Frogland.easyStar_3.calculatePath();

   Frogland.map.collision['Objects_3'][0].polyline.forEach(function(e) {
		that.pathX.push(e[0] + Frogland.map.collision['Objects_3'][0].x);
		that.pathY.push(e[1] + Frogland.map.collision['Objects_3'][0].y);
	});

	this.updateFunction = function() {

		// if(this.startTime !== null) {
		// 	var pcent = game.time.now - this.startTime;
		// 	pcent /= 15000;

		// 	this.x = game.math.catmullRomInterpolation(this.pathX, pcent);
		// 	this.y = game.math.catmullRomInterpolation(this.pathY, pcent);
		// }

		if(!this.playerWasSeen) {

			var normVel = this.body.velocity.normalize();

			var dist = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);

			dist = dist.normalize();

			normVel = Phaser.Point.interpolate(normVel, dist, 0.9);

			this.body.acceleration = normVel.setMagnitude(400);

			this.body.acceleration.x *= -1;
			this.body.acceleration.y *= -1;

			this.body.velocity.setMagnitude(200);

			if(EnemyBehavior.Player.IsVisible(this)) {
				this.playerWasSeen = true;
			}
		} else {

			var that = this;

			// if(this.timers.TimerUp('path_calc') && this.pathX.length === 0) {
			// 	var that = this;

			// 	Frogland.easyStar_3.setCallbackFunction(function(path) {
			//         path = path || [];

			//         that.pathX = [];
			//         that.pathY = [];
			        
			//  		for(var i = 0; i < path.length; i++) {

			//  			that.pathX.push(path[i].x * 16);
			//  			that.pathY.push(path[i].y * 16);
			//  		}

			//  		that.startTime = game.time.now;
			//     });

			//     Frogland.easyStar_3.preparePathCalculation([Math.round(this.body.center.x / 16), Math.round(this.body.center.y / 16)], [Math.round(frauki.body.center.x / 16), Math.round(frauki.body.center.y / 16)]);
			//     Frogland.easyStar_3.calculatePath();

			//     this.timers.SetTimer('path_calc', 1000);
			// }	

			if(this.pathX.length !== 0) {
				var tX = this.pathX[0];
				var tY = this.pathY[0];

				if(this.body.x > tX + 16 || this.body.y > tY + 16 || this.body.x + this.body.width < tX || this.body.y + this.body.height < tY) {
					game.physics.arcade.moveToXY(this, tX, tY, 300);

				} else {
					this.pathX.shift();
					this.pathY.shift();
				}
			}
		}
	};

	///////////////////////////////ACTIONS////////////////////////////////////

	this.TakeHit = function(power) {
		if(!this.timers.TimerUp('hit')) {
			return;
		}

	    this.timers.SetTimer('hit', 800);

	    this.state = this.Hurting;
	};

	this.Die = function() {
        this.state = this.Idling;
    };

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		if(EnemyBehavior.Player.IsVisible(this)) {
			//this.state = this.Chasing;
		}

	};

	this.Chasing = function() {
		this.PlayAnim('idle');

		var normVel = this.body.velocity.normalize();

		var dist = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);

		dist = dist.normalize();

		normVel = Phaser.Point.interpolate(normVel, dist, 0.9);

		this.body.acceleration = normVel.setMagnitude(400);

		this.body.acceleration.x *= -1;
		this.body.acceleration.y *= -1;

		this.body.velocity.setMagnitude(200);

		if(!EnemyBehavior.Player.IsVisible(this)) {
			this.state = this.Idling;
		}
	};

	this.Hurting = function() {
		this.PlayAnim('die');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
		}
	};

};
