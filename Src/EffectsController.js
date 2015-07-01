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
    this.negativeBits.maxParticleScale = 1.5;
    this.negativeBits.minParticleScale = 0.5;

    this.positiveBits = game.add.emitter(0, 0, 100);
    this.positiveBits.makeParticles('Misc', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005']); //array of strings here for multiple sprites
    this.positiveBits.gravity = -800;
    this.positiveBits.maxParticleScale = 1.5;
    this.positiveBits.minParticleScale = 0.5;

    this.splash = game.add.emitter(0, 0, 100);
    this.splash.makeParticles('Misc', ['Splash0000', 'Splash0001']); 
    this.splash.gravity = -600;
    this.splash.maxParticleScale = 1.1;
    this.splash.minParticleScale = 0.8;

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
    var maxVelocity = 750;

    if(!p.destBody) {
        p.destBody = this.activeDest;
    }

    if(!p.destBody) {
        return;
    }

    if(p.body.x > p.destBody.x && p.body.x < p.destBody.x + p.destBody.width && p.body.y > p.destBody.y && p.body.y < p.destBody.y + p.destBody.height) {
        p.destBody = null;
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
        p.body.acceleration.x *= 10;

    if((p.destBody.center.y < p.body.center.y && p.body.velocity.y > 0) || (p.destBody.center.y > p.body.center.y && p.body.velocity.y < 0))
        p.body.acceleration.y *= 10;

    var currVelocitySqr = p.body.velocity.x * p.body.velocity.x + p.body.velocity.y * p.body.velocity.y;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
        angle = Math.atan2(p.body.velocity.y, p.body.velocity.x);

        p.body.velocity.x = Math.cos(angle) * maxVelocity;
        p.body.velocity.y = Math.sin(angle) * maxVelocity;

    }
    
    //update frames to animate the energy
    if(!p.frameUpdateTimer) p.frameUpdateTimer = 0;
    
    if(game.time.now > p.frameUpdateTimer) {
	    if(p.frameName === 'EnergyBitPos0000') p.frameName = 'EnergyBitPos0001';
	    if(p.frameName === 'EnergyBitPos0001') p.frameName = 'EnergyBitPos0002';
	    if(p.frameName === 'EnergyBitPos0002') p.frameName = 'EnergyBitPos0003';
	    if(p.frameName === 'EnergyBitPos0003') p.frameName = 'EnergyBitPos0004';
	    if(p.frameName === 'EnergyBitPos0004') p.frameName = 'EnergyBitPos0005';
	    if(p.frameName === 'EnergyBitPos0005') p.frameName = 'EnergyBitPos0000';
	    
	    p.frameUpdateTimer = game.time.now + 80;
    }
};

EffectsController.prototype.ParticleSpray = function(source, dest, color, dir, amt) {

    amt = amt || 5;

	var effect = null;

	if(color === 'positive') {
		effect = this.positiveBits;
        this.enemySource = source;
    }
    else if(color === 'negative') {
        effect = this.negativeBits;
        this.enemyDest = dest;
	}

    if(dir === 'above') {
    	effect.minParticleSpeed.x = -80;
        effect.maxParticleSpeed.x = 80;
        effect.minParticleSpeed.y = -1500;
        effect.maxParticleSpeed.y = -2000;
    } else if (dir === 'right') {
        effect.minParticleSpeed.x = 1500;
        effect.maxParticleSpeed.x = 2000;
        effect.minParticleSpeed.y = -80;
        effect.maxParticleSpeed.y = 80;
    } else if (dir === 'left') {
        effect.minParticleSpeed.x = -2000;
        effect.maxParticleSpeed.x = -1500;
        effect.minParticleSpeed.y = -80;
        effect.maxParticleSpeed.y = 80;
    } else {
    	effect.minParticleSpeed.x = -80;
        effect.maxParticleSpeed.x = 80;
        effect.minParticleSpeed.y = 2000;
        effect.maxParticleSpeed.y = 1500;
    }

    effect.x = source.x || 0;
    effect.y = source.y || 0;
    effect.width = source.width || 0;
    effect.height = source.height || 0;

    this.activeDest = dest;

	effect.start(false, 2000, 5, amt, amt);
};

EffectsController.prototype.Splash = function(tile) {

    return;
    
    //if this is not a surface water tile
    if(Frogland.map.getTile(tile.x, tile.y - 1, 'Foreground') != null) {
    	return;
    }
    
    if(this.timers.TimerUp('splash_timer')) {
        //the y should be based on the water tiles at the bottom of frauki.
        this.splash.x = frauki.body.x;
        this.splash.y = tile.y * 16;
        this.splash.width = frauki.body.width;
        this.splash.height = 0;

        var speed = frauki.body.velocity.x * frauki.body.velocity.x + frauki.body.velocity.y * frauki.body.velocity.y;
        speed = Math.sqrt(speed);

        this.splash.minParticleSpeed.x = 150;
        this.splash.maxParticleSpeed.x = 250;

        if(frauki.body.velocity.x > 0) {
            this.splash.minParticleSpeed.x *= -1;
            this.splash.maxParticleSpeed.x *= -1;
        }

        this.splash.minParticleSpeed.y = -1 * frauki.body.velocity.y - 100;
        this.splash.maxParticleSpeed.y = -1 * frauki.body.velocity.y - 200;

        if(speed > 50)
            this.splash.explode(100, Math.ceil((Math.abs(frauki.body.velocity.y) / 10) + 1));

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
