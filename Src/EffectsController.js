MAX_FLUFF_SPEED = 20;

EffectsController = function() {
/*	this.fluff = game.add.emitter(game.camera.x + (game.camera.width / 2), game.camera.y - 20);
	this.fluff.makeParticles('fluff', 0);
	this.fluff.maxParticleScale = 1;
	this.fluff.minParticleScale = 0.2;
	//this.fluff.setYSpeed(2, 10);
	//this.fluff.setXSpeed(2, 10);
	this.fluff.gravity = -990;
	this.fluff.width = game.camera.width * 1.5;
	this.fluff.height = game.camera.height * 1.5;
	this.fluff.setRotation(0, 20);

	this.fluff.start(false, 8000, 200);*/
    this.timers = new TimerUtil();

    this.negativeBits = game.add.emitter(0, 0, 100);
    this.negativeBits.makeParticles('Misc', ['EnergyBitNeg0000', 'EnergyBitNeg0001', 'EnergyBitNeg0002', 'EnergyBitNeg0003', 'EnergyBitNeg0004', 'EnergyBitNeg0005']);
    this.negativeBits.gravity = -200;

    this.positiveBits = game.add.emitter(0, 0, 100);
    this.positiveBits.makeParticles('Misc', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005']); //array of strings here for multiple sprites
    this.positiveBits.gravity = -800;

    this.splashRight = game.add.emitter(0, 0, 100);
    this.splashRight.makeParticles('Misc', ['Splash0000', 'Splash0001']); 
    this.splashRight.gravity = 400;
    this.splashRight.maxParticleScale = 1.1;
    this.splashRight.minParticleScale = 0.8;

    this.splashLeft = game.add.emitter(0, 0, 100);
    this.splashLeft.makeParticles('Misc', ['Splash0002', 'Splash0003']); 
    this.splashLeft.gravity = 400;
    this.splashLeft.maxParticleScale = 1.1;
    this.splashLeft.minParticleScale = 0.8;

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.enemySource = null;
    this.enemyDest = null;

    this.particleType = 'pos';
}

EffectsController.prototype.UpdateEffects = function() {

	/*this.fluff.x = game.camera.x + (game.camera.width / 2);
	this.fluff.y = game.camera.y - 20;

	this.fluff.forEachAlive(function(particle) {
		particle.body.velocity.x += (Math.random() * 10) - 5;
		particle.body.velocity.y += (Math.random() * 10) - 5;

		if(particle.body.velocity.x > MAX_FLUFF_SPEED * 1.2)
			particle.body.velocity.x = MAX_FLUFF_SPEED * 1.2;
		if(particle.body.velocity.x < -MAX_FLUFF_SPEED * 1.2)
			particle.body.velocity.x = -MAX_FLUFF_SPEED * 1.2;

		if(particle.body.velocity.y > MAX_FLUFF_SPEED)
			particle.body.velocity.y = MAX_FLUFF_SPEED;
		if(particle.body.velocity.y < -MAX_FLUFF_SPEED)
			particle.body.velocity.y = -MAX_FLUFF_SPEED;
	}, this);*/

    this.activeDest = frauki.body;
    this.positiveBits.forEachAlive(UpdateParticle, this);

    this.activeDest = this.enemyDest;
    this.negativeBits.forEachAlive(UpdateParticle, this);

    this.negativeBits.x = frauki.body.x;
    this.negativeBits.y = frauki.body.y;
    this.negativeBits.width = frauki.body.width;
    this.negativeBits.height = frauki.body.height;

    if(!!this.enemySource) {
        this.positiveBits.x = this.enemySource.x;
        this.positiveBits.y = this.enemySource.y;
        this.positiveBits.width = this.enemySource.width;
        this.positiveBits.height = this.enemySource.height;
    }
}

function UpdateParticle(p) {
    var vel = 1000;
    var maxVelocity = 400;

    if(!p.destBody) {
        p.destBody = this.activeDest;
    }

    if(!p.spawnTime) {
        p.spawnTime = game.time.now;
    }

    if(!p.destBody) {
        return;
    }

    if(game.time.now - p.spawnTime < 1000) {
        return;
    }

    if(p.body.x > p.destBody.x && p.body.x < p.destBody.x + p.destBody.width && p.body.y > p.destBody.y && p.body.y < p.destBody.y + p.destBody.height) {
        p.destBody = null;
        p.kill();
        return;
    }

    var xDist = p.body.center.x - p.destBody.center.x;
    var yDist = p.body.center.y - p.destBody.center.y;

    var angle = Math.atan2(yDist, xDist); 
    p.body.acceleration.x = Math.cos(angle) * -vel;// - (xDist * 5);    
    p.body.acceleration.y = Math.sin(angle) * -vel;// - (yDist * 5);

    if((p.destBody.center.x < p.body.center.x && p.body.velocity.x > 0) || (p.destBody.center.x > p.body.center.x && p.body.velocity.x < 0))
        p.body.acceleration.x *= 4;

    if((p.destBody.center.y < p.body.center.y && p.body.velocity.y > 0) || (p.destBody.center.y > p.body.center.y && p.body.velocity.y < 0))
        p.body.acceleration.y *= 4;


    if (p.body.velocity.getMagnitude() > maxVelocity) {
        p.body.velocity.setMagnitude(maxVelocity);
    }
    
    //update frames to animate the energy
    if(!p.frameUpdateTimer) p.frameUpdateTimer = 0;
    
    if(game.time.now > p.frameUpdateTimer) {
	    if(p.frameName === 'EnergyBitPos0000') p.frameName = 'EnergyBitPos0001';
	    else if(p.frameName === 'EnergyBitPos0001') p.frameName = 'EnergyBitPos0002';
	    else if(p.frameName === 'EnergyBitPos0002') p.frameName = 'EnergyBitPos0003';
	    else if(p.frameName === 'EnergyBitPos0003') p.frameName = 'EnergyBitPos0004';
	    else if(p.frameName === 'EnergyBitPos0004') p.frameName = 'EnergyBitPos0005';
	    else if(p.frameName === 'EnergyBitPos0005') p.frameName = 'EnergyBitPos0000';
	    
	    p.frameUpdateTimer = game.time.now + 80;
    }
};

EffectsController.prototype.ParticleSpray = function(source, dest, color, dir, amt) {

	var effect = null;
    amt = amt || 5;
    amt = Math.round(amt);
    if(!amt) { amt = 1; }

	if(color === 'positive') {
		effect = this.positiveBits;
        this.enemySource = source;
    }
    else if(color === 'negative') {
        effect = this.negativeBits;
        this.enemyDest = dest;
	}

    var vel = new Phaser.Point(source.x - dest.x, source.y - dest.y);
    vel = vel.normalize();

    vel.x *= 1750;
    vel.y *= 1750;

    effect.minParticleSpeed.x = vel.x;
    effect.maxParticleSpeed.x = vel.x;
    effect.minParticleSpeed.y = vel.y;
    effect.maxParticleSpeed.y = vel.y;


    effect.x = source.x || 0;
    effect.y = source.y || 0;
    effect.width = source.width || 0;
    effect.height = source.height || 0;

    this.activeDest = dest;

	effect.start(false, 2000, 5, amt, amt);
};

EffectsController.prototype.Splash = function(tile) {
    
    if(this.timers.TimerUp('splash_timer')) {

        if(frauki.states.direction === 'left') {
            this.splash = this.splashRight;
        } else if(frauki.states.direction === 'right') {
            this.splash = this.splashLeft;
        }

        //the y should be based on the water tiles at the bottom of frauki.
        this.splash.x = frauki.body.x;
        this.splash.y = tile.y * 16;
        this.splash.width = frauki.body.width;
        this.splash.height = 0;
        this.splash.minParticleSpeed.x = 10;
        this.splash.maxParticleSpeed.x = 30;
        this.splash.minParticleSpeed.y = -100;
        this.splash.maxParticleSpeed.y = -200;

        var speed = frauki.body.velocity.x * frauki.body.velocity.x + frauki.body.velocity.y * frauki.body.velocity.y;
        speed = Math.sqrt(speed);

        if(frauki.body.velocity.x > 0) {
            this.splash.minParticleSpeed.x *= -1;
            this.splash.maxParticleSpeed.x *= -1;
        }

        if(speed > 50) {
            this.splash.explode(200, Math.ceil((Math.abs(frauki.body.velocity.x) / 50) + 1));
        }

        if(Math.abs(frauki.body.velocity.y) > 100) {
            this.splash.minParticleSpeed.x *= -1;
            this.splash.maxParticleSpeed.x *= -1;

            this.splash.explode(200, Math.ceil((Math.abs(frauki.body.velocity.y) / 50) + 1));
        }

        this.timers.SetTimer('splash_timer', 100);
    }
};

EffectsController.prototype.DiceEnemy = function(enemyName, x, y) {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('EnemySprites').getFrameByName(enemyName + '/Dead000' + i)) {
        pieces.push(game.add.sprite(x, y, 'EnemySprites', enemyName + '/Dead000' + i));
        i++;
    }

    pieces.forEach(function(p) {
        game.physics.enable(p, Phaser.Physics.ARCADE);

        p.anchor.setTo(0.5, 0.5);

        //randomly set the velocity, rotation, and lifespan
        p.body.velocity.x = game.rnd.between(-150, 150);
        p.body.velocity.y = game.rnd.between(-100, -700);
        p.body.angularVelocity = game.rnd.between(500, 1500);

        game.time.events.add(2000, function() { p.destroy(); } );
    });
};

EffectsController.prototype.MakeHearts = function(amt) {

    var hearts = [];
    for(var i = 0; i < amt; i++) {

        var heart = game.add.sprite(frauki.body.center.x, frauki.body.center.y - 15, 'Misc');
        game.physics.enable(heart, Phaser.Physics.ARCADE);

        heart.animations.add('idle', ['Heart0000', 'Heart0001'], 4, true, false);
        heart.play('idle');

        heart.body.gravity.y = - 800;

        heart.body.drag.x = 300;
        heart.body.drag.y = 100;

        heart.body.velocity.x = Math.random() * 500 - 250;
        heart.body.velocity.y = -100 + (Math.random() * -100);

        hearts.push(heart);
    }

    hearts.forEach(function(h) {
        setTimeout(function() {
            h.destroy();
        }, 700 + Math.random() * 300);
    })

};

EffectsController.prototype.SlowHit = function(callback) {
    var t = game.add.tween(game.time).to( { slowMotion: 6 }, 25, Phaser.Easing.Quartic.Out, false).to( { slowMotion: 1 }, 10, Phaser.Easing.Exponential.In, false);
    t.onComplete.add(callback)
    t.start();

    // game.paused = true;

    // setTimeout(function() {
    //     game.paused = false;
    //     if(!!callback) callback();
    // }, 50);
};