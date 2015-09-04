MAX_FLUFF_SPEED = 20;

EffectsController = function() {
    this.timers = new TimerUtil();

    this.negativeBits = game.add.emitter(0, 0, 100);
    this.negativeBits.makeParticles('Misc', ['EnergyBitNeg0000', 'EnergyBitNeg0001', 'EnergyBitNeg0002', 'EnergyBitNeg0003', 'EnergyBitNeg0004', 'EnergyBitNeg0005']);
    this.negativeBits.gravity = -200;

    this.positiveBits = game.add.emitter(0, 0, 100);
    this.positiveBits.makeParticles('Misc', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005']); //array of strings here for multiple sprites
    this.positiveBits.gravity = -800;

    this.neutralBits = game.add.emitter(0, 0, 100);
    this.neutralBits.makeParticles('Misc', ['EnergyBitNeutral0000', 'EnergyBitNeutral0001', 'EnergyBitNeutral0002', 'EnergyBitNeutral0003', 'EnergyBitNeutral0004', 'EnergyBitNeutral0005']); //array of strings here for multiple sprites
    this.neutralBits.gravity = -800;

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

    this.posSpark = game.add.emitter(0, 0, 100);
    this.posSpark.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004', 'Sparks0005', 'Sparks0006']); 
    this.posSpark.gravity = -750;
    this.posSpark.particleDrag.setTo(100);

    this.negSpark = game.add.emitter(0, 0, 100);
    this.negSpark.makeParticles('Misc', ['Sparks0007', 'Sparks0008', 'Sparks0009', 'Sparks0010', 'Sparks0011', 'Sparks0012', 'Sparks0013']); 
    this.negSpark.gravity = -750;
    this.negSpark.particleDrag.setTo(100);

    this.neutralSpark = game.add.emitter(0, 0, 100);
    this.neutralSpark.makeParticles('Misc', ['Sparks0014', 'Sparks0015', 'Sparks0016', 'Sparks0017', 'Sparks0018']); 
    this.neutralSpark.gravity = -750;
    this.neutralSpark.particleDrag.setTo(100);

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.enemySource = null;
    this.enemyDest = null;

    this.particleType = 'pos';

    this.pieces = [];
    this.dicedPieces4 = game.add.group(Frogland.objectGroup_4);
    this.dicedPieces3 = game.add.group(Frogland.objectGroup_3);
    this.dicedPieces2 = game.add.group(Frogland.objectGroup_2);

    this.energyStreak = game.add.emitter(0, 0, 100);
    this.energyStreak.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004']); 
    this.energyStreak.gravity = -780;
    this.energyStreak.particleDrag.setTo(100);
    this.energyStreak.minParticleSpeed.setTo(-80);
    this.energyStreak.maxParticleSpeed.setTo(80);

    this.loadedEffects = [];

    this.LoadMapEffects(4);
    this.LoadMapEffects(3);
    this.LoadMapEffects(2);
};

EffectsController.prototype.Update = function() {

    this.loadedEffects.forEach(function(o) {
        var padding = 100;

        if(o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding
            && o.owningLayer === Frogland.currentLayer) {
            o.on = true;
        } else {
            o.on = false;
        }
        
    });

    this.activeDest = frauki.body;
    this.positiveBits.forEachAlive(UpdateParticle, this);

    this.neutralBits.forEachAlive(UpdateParticle, this);

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

       
    if(frauki.state === frauki.Rolling || frauki.state === frauki.Flipping) {
        this.energyStreak.x = frauki.body.x;
        this.energyStreak.y = frauki.body.bottom;
        this.energyStreak.width = frauki.body.width;
        this.energyStreak.height = 1;
    } else {
        this.energyStreak.x = frauki.attackRect.body.x;
        this.energyStreak.y = frauki.attackRect.body.y;
        this.energyStreak.width = frauki.attackRect.body.width;
        this.energyStreak.height = frauki.attackRect.body.height;
    }

    game.physics.arcade.collide(this.dicedPieces4, Frogland.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.dicedPieces3, Frogland.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.dicedPieces2, Frogland.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.loadedEffects, Frogland.GetCurrentCollisionLayer(), Collision.CollideEffectWithWorld);
};

EffectsController.prototype.LoadMapEffects = function(layer) {
    var that = this;

    //console.log(Frogland.map.objects['Objects_' + layer]);

    Frogland.map.objects['Objects_' + layer].forEach(function(o) {
        if(o.type === 'effect') {
            if(o.name === 'splash') {
                var splasherLeft = game.add.emitter(o.x, o.y);
                splasherLeft.width = o.width / 2;
                splasherLeft.height = o.height;
                splasherLeft.makeParticles('Misc', ['Splash0002', 'Splash0003'], 100); 
                splasherLeft.gravity = 400;
                splasherLeft.maxParticleScale = 1.1;
                splasherLeft.minParticleScale = 0.8;
                splasherLeft.minParticleSpeed.x = -50;
                splasherLeft.maxParticleSpeed.x = 10;
                splasherLeft.minParticleSpeed.y = -80;
                splasherLeft.maxParticleSpeed.y = -130;
                splasherLeft.owningLayer = layer;
                splasherLeft.start(false, 200, 5);

                var splasherRight = game.add.emitter(o.x + o.width / 2, o.y);
                splasherRight.width = o.width / 2;
                splasherRight.height = o.height;
                splasherRight.makeParticles('Misc', ['Splash0000', 'Splash0001'], 100); 
                splasherRight.gravity = 400;
                splasherRight.maxParticleScale = 1.1;
                splasherRight.minParticleScale = 0.8;
                splasherRight.minParticleSpeed.x = -10;
                splasherRight.maxParticleSpeed.x = 50;
                splasherRight.minParticleSpeed.y = -80;
                splasherRight.maxParticleSpeed.y = -130;
                splasherRight.owningLayer = layer;
                splasherRight.start(false, 200, 5);

                that.loadedEffects.push(splasherLeft);
                that.loadedEffects.push(splasherRight);
            } else if(o.name === 'drip') {

                var dripper = game.add.emitter(o.x, o.y);
                dripper.width = o.width;
                dripper.height = o.height;
                dripper.makeParticles('Misc', ['Drip0000', 'Drip0001'], 20);
                dripper.gravity = -200;
                dripper.maxParticleSpeed.setTo(0);
                dripper.minParticleSpeed.setTo(0);
                dripper.minRotation = 0;
                dripper.maxRotation = 0;
                dripper.bounce.setTo(0.5);
                dripper.start(false, 1500, game.rnd.between(1200, 2000));
                dripper.effectType = 'drip';
                dripper.alpha = 0.5;
                dripper.owningLayer = layer;

                that.loadedEffects.push(dripper);
            }
        }
    });
};

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
        
        if(p.destBody === frauki.body) {

            events.publish('play_sound', {name: 'energy_bit', restart: true });

            if(p.parent === effectsController.positiveBits) {
                energyController.AddPower(0.15);
                effectsController.EnergySplash(p.body, 100, 'positive');
            } else if(p.parent === effectsController.neutralBits) {
                energyController.AddCharge(1);
                effectsController.EnergySplash(p.body, 100, 'neutral');
            }
        }
        
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

EffectsController.prototype.SpawnEnergyNuggets = function(source, dest, color, dir, amt) {

    if(amt === 0) return;
    
	var effect = null;
    amt = Math.round(amt);
    if(!amt) { amt = 1; }

	if(color === 'positive') {
		effect = this.positiveBits;
        this.enemySource = source;
    }
    else if(color === 'negative') {
        effect = this.negativeBits;
        this.enemyDest = dest;
	} else if(color === 'neutral') {
        effect = this.neutralBits;
        this.enemySource = source;
    }

    var vel = new Phaser.Point(source.x - dest.x, source.y - dest.y);
    vel = vel.normalize();

    var minVel = Phaser.Point.rotate(vel.clone(), 0, 0, 30, true, 1);
    var maxVel = Phaser.Point.rotate(vel.clone(), 0, 0, -30, true, 1);
    
    maxVel.setMagnitude(1750);
    minVel.setMagnitude(1750);

    effect.minParticleSpeed.x = minVel.x;
    effect.maxParticleSpeed.x = maxVel.x;
    effect.minParticleSpeed.y = minVel.y;
    effect.maxParticleSpeed.y = maxVel.y;

    effect.x = source.x || 0;
    effect.y = source.y || 0;
    effect.width = source.width || 0;
    effect.height = source.height || 0;

    this.activeDest = dest;

	effect.start(false, 0, 5, amt, amt);
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

EffectsController.prototype.DiceEnemy = function(enemy, x, y) {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('Pieces').getFrameByName(enemy.enemyName + '/Dead000' + i)) {
        pieces.push(game.add.sprite(x, y, 'Pieces', enemy.enemyName + '/Dead000' + i));
        i++;
    }

    pieces.forEach(function(p) {
        game.physics.enable(p, Phaser.Physics.ARCADE);

        p.anchor.setTo(0.5, 0.5);
        p.body.bounce.setTo(0.5);
        p.body.angularDrag = 600;
        p.body.drag.x = 100;

        //randomly set the velocity, rotation, and lifespan
        p.body.velocity.x = game.rnd.between(-150, 150) + enemy.body.velocity.x * 0.5;
        p.body.velocity.y = game.rnd.between(-100, -400) + enemy.body.velocity.y * 0.5;
        p.body.angularVelocity = game.rnd.between(500, 1000);

        game.time.events.add(4000, function() { p.body.enable = false; } );

        effectsController['dicedPieces' + enemy.owningLayer].addChild(p);
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

EffectsController.prototype.SlowHit = function(duration) {
    var t = game.add.tween(Main).to( { physicsSlowMo: 0.2 }, Math.round(duration * 0.2), Phaser.Easing.Exponential.InOut, false).to( { physicsSlowMo: 1 }, Math.round(duration * 0.8), Phaser.Easing.Exponential.InOut, false);
    t.start();
};

EffectsController.prototype.SparkSplash = function(posSrc, negSrc) {

    var x = (posSrc.body.x + (posSrc.width / 2) + negSrc.body.x + (negSrc.width / 2)) / 2;
    var y = (posSrc.body.y + (posSrc.height / 2) + negSrc.body.y + (negSrc.height / 2)) / 2;

    this.posSpark.x = x;
    this.posSpark.y = y;
    this.negSpark.x = x;
    this.negSpark.y = y;

    var vel = new Phaser.Point(posSrc.body.center.x - negSrc.body.center.x, posSrc.body.center.y - negSrc.body.center.y);
    vel = vel.normalize();

    var minVel = Phaser.Point.rotate(vel.clone(), 0, 0, 30, true, 1);
    var maxVel = Phaser.Point.rotate(vel.clone(), 0, 0, -30, true, 1);

    minVel.setMagnitude(150);
    maxVel.setMagnitude(175);

    this.posSpark.minParticleSpeed.x = minVel.x;
    this.posSpark.minParticleSpeed.y = minVel.y;
    this.posSpark.maxParticleSpeed.x = maxVel.x;
    this.posSpark.maxParticleSpeed.y = maxVel.y;

    this.posSpark.explode(500, 10);

    minVel.x *= -1;
    minVel.y *= -1;
    maxVel.x *= -1;
    maxVel.y *= -1;

    this.negSpark.minParticleSpeed.x = maxVel.x;
    this.negSpark.maxParticleSpeed.x = minVel.x;
    this.negSpark.minParticleSpeed.y = maxVel.y;
    this.negSpark.maxParticleSpeed.y = minVel.y;

    this.negSpark.explode(500, 10);
};

EffectsController.prototype.EnergySplash = function(src, intensity, color) {

    if(color === 'positive') {
        this.posSpark.x = src.x;
        this.posSpark.y = src.y;

        this.posSpark.minParticleSpeed.x = -intensity;
        this.posSpark.minParticleSpeed.y = -intensity;
        this.posSpark.maxParticleSpeed.x = intensity;
        this.posSpark.maxParticleSpeed.y = intensity;   
       
        this.posSpark.explode(500, 6);
    } else if(color === 'neutral') {
        this.neutralSpark.x = src.x;
        this.neutralSpark.y = src.y;

        this.neutralSpark.minParticleSpeed.x = -intensity;
        this.neutralSpark.minParticleSpeed.y = -intensity;
        this.neutralSpark.maxParticleSpeed.x = intensity;
        this.neutralSpark.maxParticleSpeed.y = intensity;   
       
        this.neutralSpark.explode(500, 6);
    } else if(color === 'negative') {
        this.negSpark.x = src.x;
        this.negSpark.y = src.y;

        this.negSpark.minParticleSpeed.x = -intensity;
        this.negSpark.minParticleSpeed.y = -intensity;
        this.negSpark.maxParticleSpeed.x = intensity;
        this.negSpark.maxParticleSpeed.y = intensity;   
       
        this.negSpark.explode(600, 10);
    }
};

EffectsController.prototype.Explosion = function(src) {
    var boom = game.add.sprite(src.x - 50, src.y - 50, 'Misc');
    boom.animations.add('boom', ['Explosion0000', 'Explosion0001', 'Explosion0002', 'Explosion0003', 'Explosion0004', 'Explosion0005'], 12, false, false);
    boom.animations.play('boom');
    boom.animations.currentAnim.killOnComplete = true;

};

EffectsController.prototype.JumpDust = function(src) {
    var dust = game.add.sprite(src.x - 50, src.y - 30, 'Misc', null, Frogland.effectsGroup);
    dust.animations.add('dust', ['JumpDust0000', 'JumpDust0001', 'JumpDust0002', 'JumpDust0003', 'JumpDust0004', 'JumpDust0005', 'JumpDust0006'], 10, false, false);
    dust.animations.play('dust');
    dust.alpha = 0.5;
    dust.animations.currentAnim.killOnComplete = true;

};

EffectsController.prototype.EnergyStreak = function() {
    this.energyStreak.flow(200, 5, 1, 60, true);
};

EffectsController.prototype.ClashStreak = function(x, y, angle) {
    var clash = game.add.sprite(x, y, 'Misc');
    clash.anchor.setTo(0.5);
    clash.animations.add('clash', ['Clash0001', 'Clash0002', 'Clash0003'], 10, false, false);
    clash.animations.play('clash');
    clash.animations.currentAnim.killOnComplete = true;
    clash.rotation = angle;
};

EffectsController.prototype.DripSplash = function(src) {
    var dripSplash = game.add.sprite(src.x - 10, src.y - 3, 'Misc');
    dripSplash.animations.add('splish', ['DripSplash0000', 'DripSplash0001', 'DripSplash0002', 'DripSplash0003', 'DripSplash0004'], 18, false, false);
    dripSplash.animations.play('splish');
    dripSplash.animations.currentAnim.killOnComplete = true;
    dripSplash.alpha = 0.5;

};