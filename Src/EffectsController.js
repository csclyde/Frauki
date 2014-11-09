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


    this.negativeBits = game.add.emitter(0, 0, 100);
    this.negativeBits.makeParticles('Item', ['EnergyBitNeg0000', 'EnergyBitNeg0001', 'EnergyBitNeg0002', 'EnergyBitNeg0003', 'EnergyBitNeg0004', 'EnergyBitNeg0005']);
    this.negativeBits.gravity = -200;
    this.negativeBits.maxParticleScale = 1.0;
    this.negativeBits.minParticleScale = 0.7;

    this.positiveBits = game.add.emitter(0, 0, 100);
    this.positiveBits.makeParticles('Item', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005']); //array of strings here for multiple sprites
    this.positiveBits.gravity = -800;
    this.positiveBits.maxParticleScale = 1.0;
    this.positiveBits.minParticleScale = 0.7;

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
    var vel = 2000;
    var maxVelocity = 250;

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

    var currVelocitySqr = p.body.velocity.x * p.body.velocity.x + p.body.velocity.y * p.body.velocity.y;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
        angle = Math.atan2(p.body.velocity.y, p.body.velocity.x);

        p.body.velocity.x = Math.cos(angle) * maxVelocity;
        p.body.velocity.y = Math.sin(angle) * maxVelocity;

    }
};

EffectsController.prototype.ParticleSpray = function(source, dest, color, dir, amt) {

    amt = amt || 5;

	var effect = null;

	if(color === 'red') {
		effect = this.positiveBits;
        this.enemySource = source;
    }
    else if(color === 'yellow') {
        effect = this.negativeBits;
        this.enemyDest = dest;
	}

    if(dir === 'above') {
    	effect.minParticleSpeed.x = -80;
        effect.maxParticleSpeed.x = 80;
        effect.minParticleSpeed.y = -200;
        effect.maxParticleSpeed.y = -400;
    } else if (dir === 'right') {
        effect.minParticleSpeed.x = 200;
        effect.maxParticleSpeed.x = 400;
        effect.minParticleSpeed.y = -80;
        effect.maxParticleSpeed.y = 80;
    } else if (dir === 'left') {
        effect.minParticleSpeed.x = -400;
        effect.maxParticleSpeed.x = -200;
        effect.minParticleSpeed.y = -80;
        effect.maxParticleSpeed.y = 80;
    } else {
    	effect.minParticleSpeed.x = -80;
        effect.maxParticleSpeed.x = 80;
        effect.minParticleSpeed.y = 400;
        effect.maxParticleSpeed.y = 200;
    }

    effect.x = source.x || 0;
    effect.y = source.y || 0;
    effect.width = source.width || 0;
    effect.height = source.height || 0;

    this.activeDest = dest;

	effect.start(false, 2000, 5, amt, amt);
}
