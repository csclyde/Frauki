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


    this.yellowParticles = game.add.emitter(0, 0, 100);
    this.yellowParticles.makeParticles('YellowParticles');
    this.yellowParticles.gravity = -200;
    this.yellowParticles.maxParticleScale = 1.0;
    this.yellowParticles.minParticleScale = 0.7;

    this.redParticles = game.add.emitter(0, 0, 100);
    this.redParticles.makeParticles('Item', ['EnergyBit0000', 'EnergyBit0001', 'EnergyBit0002', 'EnergyBit0003', 'EnergyBit0004', 'EnergyBit0005']); //array of strings here for multiple sprites
    this.redParticles.gravity = -800;
    this.redParticles.maxParticleScale = 1.0;
    this.redParticles.minParticleScale = 0.7;

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.activeSource = null;

    this.enemySource = null;
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

    this.redParticles.forEachAlive(UpdateParticle, this);
    this.yellowParticles.forEachAlive(UpdateParticle, this);

    this.yellowParticles.x = frauki.body.x;
    this.yellowParticles.y = frauki.body.y;
    this.yellowParticles.width = frauki.body.width;
    this.yellowParticles.height = frauki.body.height;

    if(!!this.enemySource) {
        this.redParticles.x = this.enemySource.x;
        this.redParticles.y = this.enemySource.y;
        this.redParticles.width = this.enemySource.width;
        this.redParticles.height = this.enemySource.height;
    }
}

function UpdateParticle(p) {
    var vel = 1500;
    var maxVelocity = 250;

    if(!p.sourceBody) {
        p.sourceBody = this.activeSource;
    }

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
    p.body.acceleration.x = Math.cos(angle) * -vel - (xDist * 5);    
    p.body.acceleration.y = Math.sin(angle) * -vel - (yDist * 5);

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
		effect = this.redParticles;
        this.enemySource = source;
    }
    else if(color === 'yellow') {
        effect = this.yellowParticles;
	}

    if(dir === 'above') {
    	effect.minParticleSpeed.x = -800;
        effect.maxParticleSpeed.x = 800;
        effect.minParticleSpeed.y = -2000;
        effect.maxParticleSpeed.y = -4000;
    } else if (dir === 'right') {
        effect.minParticleSpeed.x = 2000;
        effect.maxParticleSpeed.x = 4000;
        effect.minParticleSpeed.y = -800;
        effect.maxParticleSpeed.y = 800;
    } else if (dir === 'left') {
        effect.minParticleSpeed.x = -4000;
        effect.maxParticleSpeed.x = -2000;
        effect.minParticleSpeed.y = -800;
        effect.maxParticleSpeed.y = 800;
    } else {
    	effect.minParticleSpeed.x = -800;
        effect.maxParticleSpeed.x = 800;
        effect.minParticleSpeed.y = 4000;
        effect.maxParticleSpeed.y = 2000;
    }

    effect.x = source.x || 0;
    effect.y = source.y || 0;
    effect.width = source.width || 0;
    effect.height = source.height || 0;

    this.activeSource = source;
    this.activeDest = dest;

	effect.start(false, 2000, 5, amt, amt);
}
