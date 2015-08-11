MAX_FLUFF_SPEED = 20;

EffectsController = function() {
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

    this.posSpark = game.add.emitter(0, 0, 100);
    this.posSpark.makeParticles('Misc', ['Sparks0000']); 
    this.posSpark.gravity = -700;
    this.posSpark.maxParticleScale = 1;
    this.posSpark.minParticleScale = 1;

    this.negSpark = game.add.emitter(0, 0, 100);
    this.negSpark.makeParticles('Misc', ['Sparks0001']); 
    this.negSpark.gravity = -700;
    this.negSpark._maxParticleScale = 1;
    this.negSpark._minParticleScale = 1;

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.enemySource = null;
    this.enemyDest = null;

    this.particleType = 'pos';

    this.forceField = game.add.sprite(0, 0, 'Misc');
    this.forceField.animations.add('activate', ['ForceField0000', 'ForceField0001', 'ForceField0002', 'ForceField0003', 'ForceField0004', 'ForceField0005'], 14, false, false);
    this.forceField.visible = false;

    this.pieces = [];
    this.dicedPieces = game.add.group();

    this.loadedEffects = [];

    this.LoadMapEffects(2);
};

EffectsController.prototype.UpdateEffects = function() {

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

    this.forceField.x = frauki.body.x - 43;
    this.forceField.y = frauki.body.y - 30;

    if(this.forceField.animations.currentAnim.isFinished) {
        this.forceField.visible = false;
        frauki.states.forceFieldActive = false;
    }

    game.physics.arcade.collide(this.dicedPieces, Frogland.GetCurrentCollisionLayer());
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
                splasherRight.start(false, 200, 5);

                that.loadedEffects.push(splasherLeft);
                that.loadedEffects.push(splasherRight);
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
        
        if(p.destBody === frauki.body) events.publish('play_sound', {name: 'energy_bit', restart: true });
        
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
	}

    var vel = new Phaser.Point(source.x - dest.x, source.y - dest.y);
    vel = vel.normalize();

    var minVel = Phaser.Point.rotate(vel.clone(), 0, 0, 20, true, 1);
    var maxVel = Phaser.Point.rotate(vel.clone(), 0, 0, -20, true, 1);
    
    minVel.x *= 1750;
    minVel.y *= 1750;
    maxVel.x *= 1750;
    maxVel.y *= 1750;

    effect.minParticleSpeed.x = minVel.x;
    effect.maxParticleSpeed.x = maxVel.x;
    effect.minParticleSpeed.y = minVel.y;
    effect.maxParticleSpeed.y = maxVel.y;

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

EffectsController.prototype.DiceEnemy = function(enemy, x, y) {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('DeathPieces').getFrameByName(enemy.enemyName + '/Dead000' + i)) {
        pieces.push(game.add.sprite(x, y, 'DeathPieces', enemy.enemyName + '/Dead000' + i));
        i++;
    }

    pieces.forEach(function(p) {
        game.physics.enable(p, Phaser.Physics.ARCADE);

        p.anchor.setTo(0.5, 0.5);
        p.body.bounce.setTo(0.5);
        p.body.angularDrag = 600;
        p.body.drag.x = 100;

        //randomly set the velocity, rotation, and lifespan
        p.body.velocity.x = game.rnd.between(-150, 150);
        p.body.velocity.y = game.rnd.between(-100, -400);
        p.body.angularVelocity = game.rnd.between(500, 1000);

        game.time.events.add(2000, function() { p.destroy(); } );

        effectsController.dicedPieces.addChild(p);
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
    var t = game.add.tween(game.time).to( { slowMotion: 4 }, 50, Phaser.Easing.Quartic.Out, false).to( { slowMotion: 1 }, 100, Phaser.Easing.Exponential.In, false);
    t.onComplete.add(callback)
    t.start();
};

EffectsController.prototype.ForceField = function() {

    this.forceField.visible = true;
    frauki.states.forceFieldActive = true;
    this.forceField.animations.play('activate');
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

    var minVel = Phaser.Point.rotate(vel.clone(), 0, 0, 20, true, 1);
    var maxVel = Phaser.Point.rotate(vel.clone(), 0, 0, -20, true, 1);
    
    minVel.x *= 120;
    minVel.y *= 120;
    maxVel.x *= 120;
    maxVel.y *= 120;

    this.posSpark.minParticleSpeed.x = minVel.x;
    this.posSpark.minParticleSpeed.y = minVel.y;
    this.posSpark.maxParticleSpeed.x = maxVel.x;
    this.posSpark.maxParticleSpeed.y = maxVel.y;

    this.posSpark.explode(500, 20);

    minVel.x *= -1;
    minVel.y *= -1;
    maxVel.x *= -1;
    maxVel.y *= -1;

    this.negSpark.minParticleSpeed.x = maxVel.x;
    this.negSpark.maxParticleSpeed.x = minVel.x;
    this.negSpark.minParticleSpeed.y = maxVel.y;
    this.negSpark.maxParticleSpeed.y = minVel.y;

    this.negSpark.explode(500, 20);
};
