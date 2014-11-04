MAX_FLUFF_SPEED = 20;

EffectsController = function() {
	this.fluff = game.add.emitter(game.camera.x + (game.camera.width / 2), game.camera.y - 20);
	this.fluff.makeParticles('fluff', 0);
	this.fluff.maxParticleScale = 1;
	this.fluff.minParticleScale = 0.2;
	//this.fluff.setYSpeed(2, 10);
	//this.fluff.setXSpeed(2, 10);
	this.fluff.gravity = -990;
	this.fluff.width = game.camera.width * 1.5;
	this.fluff.height = game.camera.height * 1.5;
	this.fluff.setRotation(0, 20);

	this.fluff.start(false, 8000, 200);


    this.yellowParticles = game.add.emitter(0, 0, 100);
    this.yellowParticles.makeParticles('YellowParticles');
    this.yellowParticles.gravity = -200;
    this.yellowParticles.maxParticleScale = 1.0;
    this.yellowParticles.minParticleScale = 0.7;

    this.redParticles = game.add.emitter(0, 0, 100);
    this.redParticles.makeParticles('RedParticles');
    this.redParticles.gravity = -800;
    this.redParticles.maxParticleScale = 1.0;
    this.redParticles.minParticleScale = 0.7;
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

    var particlesToRemove = [];

    this.redParticles.forEachAlive(function(p) {
        var vel = 500;

        if(p.body.x > frauki.body.x && p.body.x < frauki.body.x + frauki.body.width && p.body.y > frauki.body.y && p.body.y < frauki.body.y + frauki.body.height) {
            //this.redParticles.remove(p);
            particlesToRemove.push(p);
            return;
        }

        if(p.body.x < frauki.body.x)
            p.body.acceleration.x = vel;
        else
            p.body.acceleration.x = -vel;

        if(p.body.y < frauki.body.y)
            p.body.acceleration.y = vel;
        else
            p.body.acceleration.y = -vel;

    }, this);

    particlesToRemove.forEach(function(p) {
        this.redParticles.remove(p);
    }, this);

    particleToRemove = [];
}

EffectsController.prototype.ParticleSpray = function(x, y, w, h, color, dir, amt) {

    amt = amt || 5;

	var effect = null;

	if(color === 'red') {
		effect = this.redParticles;
	}
	else if(color === 'yellow') {
		effect = this.yellowParticles;
	}

    if(dir === 'below') {
    	effect.minParticleSpeed.x = 0;
        effect.maxParticleSpeed.x = 0;
        effect.minParticleSpeed.y = 100;
        effect.maxParticleSpeed.y = 200;
    } else if (dir === 'left') {
        effect.minParticleSpeed.x = 100;
        effect.maxParticleSpeed.x = 200;
        effect.minParticleSpeed.y = 0;
        effect.maxParticleSpeed.y = 0;
    } else if (dir === 'right') {
        effect.minParticleSpeed.x = -200;
        effect.maxParticleSpeed.x = -100;
        effect.minParticleSpeed.y = 0;
        effect.maxParticleSpeed.y = 0;
    } else {
    	effect.minParticleSpeed.x = 0;
        effect.maxParticleSpeed.x = 0;
        effect.minParticleSpeed.y = -200;
        effect.maxParticleSpeed.y = -100;
    }

    effect.x = x || 0;
    effect.y = y || 0;
    effect.width = w || 0;
    effect.height = h || 0;

	effect.start(false, 2000, 5, amt, amt);
}