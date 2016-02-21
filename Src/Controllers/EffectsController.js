MAX_FLUFF_SPEED = 20;

EffectsController = function() {
    this.timers = new TimerUtil();

    this.negativeBits = game.add.emitter(0, 0, 15);
    this.negativeBits.makeParticles('Misc', ['EnergyBitNeg0000', 'EnergyBitNeg0001', 'EnergyBitNeg0002', 'EnergyBitNeg0003', 'EnergyBitNeg0004', 'EnergyBitNeg0005']);
    this.negativeBits.gravity = -150;
    this.negativeBits.setRotation(0, 0);
    //Frogland.effectsGroup.addChild(this.negativeBits);

    this.positiveBits = game.add.emitter(0, 0, 15);
    this.positiveBits.makeParticles('Misc', ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005']); //array of strings here for multiple sprites
    this.positiveBits.gravity = -600;
    this.positiveBits.setRotation(0, 0);
    //Frogland.effectsGroup.addChild(this.positveBits);

    this.neutralBits = game.add.emitter(0, 0, 15);
    this.neutralBits.makeParticles('Misc', ['EnergyBitNeutral0000', 'EnergyBitNeutral0001', 'EnergyBitNeutral0002', 'EnergyBitNeutral0003', 'EnergyBitNeutral0004', 'EnergyBitNeutral0005']); //array of strings here for multiple sprites
    this.neutralBits.gravity = -600;
    this.neutralBits.setRotation(0, 0);
    //Frogland.effectsGroup.addChild(this.neutralBits);

    this.splashRight = game.add.emitter(0, 0, 10);
    this.splashRight.makeParticles('Misc', ['Splash0000', 'Splash0001']); 
    this.splashRight.gravity = 300;
    this.splashRight.maxParticleScale = 1;
    this.splashRight.minParticleScale = 1;
    this.splashRight.setRotation(0, 0);

    this.splashLeft = game.add.emitter(0, 0, 10);
    this.splashLeft.makeParticles('Misc', ['Splash0002', 'Splash0003']); 
    this.splashLeft.gravity = 300;
    this.splashLeft.maxParticleScale = 1;
    this.splashLeft.minParticleScale = 1;
    this.splashLeft.setRotation(0, 0);

    this.posSpark = game.add.emitter(0, 0, 50);
    this.posSpark.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004', 'Sparks0005']); 
    this.posSpark.gravity = -400;
    this.posSpark.particleDrag.setTo(100);
    this.posSpark.setRotation(0, 0);
    //Frogland.effectsGroup.addChild(this.posSpark);

    this.negSpark = game.add.emitter(0, 0, 50);
    this.negSpark.makeParticles('Misc', ['Sparks0006', 'Sparks0007', 'Sparks0008', 'Sparks0009', 'Sparks0010', 'Sparks0011']); 
    this.negSpark.gravity = -400;
    this.negSpark.particleDrag.setTo(100);
    this.negSpark.setRotation(0, 0);

    this.neutralSpark = game.add.emitter(0, 0, 50);
    this.neutralSpark.makeParticles('Misc', ['Sparks0012', 'Sparks0013', 'Sparks0014', 'Sparks0015', 'Sparks0016']); 
    this.neutralSpark.gravity = -400;
    this.neutralSpark.particleDrag.setTo(100);
    this.neutralSpark.setRotation(0, 0);

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.enemySource = null;
    this.enemyDest = null;

    this.particleType = 'pos';

    this.pieces = [];
    this.dicedPieces4 = game.add.group(Frogland.objectGroup_4);
    this.dicedPieces3 = game.add.group(Frogland.objectGroup_3);
    this.dicedPieces2 = game.add.group(Frogland.objectGroup_2);

    this.energyStreak = game.add.emitter(0, 0, 50);
    this.energyStreak.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004']); 
    this.energyStreak.gravity = -580;
    this.energyStreak.particleDrag.setTo(100);
    this.energyStreak.minParticleSpeed.setTo(-80);
    this.energyStreak.maxParticleSpeed.setTo(80);
    this.energyStreak.maxParticleScale = 1;
    this.energyStreak.minParticleScale = 1;
    this.energyStreak.setRotation(0, 0);

    this.loadedEffects = [];
    this.loadedEffectsCollide = [];

    this.LoadMapEffects(4);
    this.LoadMapEffects(3);
    this.LoadMapEffects(2);
    
    var screenLightBmd = game.add.bitmapData(game.width, game.height);
    screenLightBmd.ctx.fillStyle = 'white';
    screenLightBmd.ctx.fillRect(0,0, game.width, game.height);
    this.screenLight = game.add.sprite(0, 0, screenLightBmd);
    this.screenLight.alpha = 0.5;
    this.screenLight.fixedToCamera = true;
    this.screenLight.visible = false;

    var screenDarkBmd = game.add.bitmapData(game.width, game.height);
    screenDarkBmd.ctx.fillStyle = 'black';
    screenDarkBmd.ctx.fillRect(0,0, game.width, game.height);
    this.screenDark = game.add.sprite(0, 0, screenDarkBmd);
    this.screenDark.fixedToCamera = true;

    this.goddess = game.add.image(0, 0, 'Misc', 'Goddess0000');
    this.goddess.fixedToCamera = true;
    this.goddess.alpha = 0;
    this.goddess.visible = false;
    this.goddess.anchor.setTo(0.5);
    this.goddess.cameraOffset.x = 320;
    this.goddess.cameraOffset.y = 200;
    game.add.tween(this.goddess.cameraOffset).to({y: 160}, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);


};

EffectsController.prototype.Update = function() {

    this.loadedEffects.forEach(function(o) {
        var padding = 100;

        if(o.owningLayer === Frogland.currentLayer && o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
            o.on = true;
        } else {
            o.on = false;
        }
        
    });

    this.loadedEffectsCollide.forEach(function(o) {
        var padding = 100;

        if(o.owningLayer === Frogland.currentLayer && o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
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

    game.physics.arcade.collideGroupVsTilemapLayer(this['dicedPieces' + Frogland.currentLayer], Frogland.GetCurrentCollisionLayer(), null, null, null, false);
    //game.physics.arcade.collide(this.dicedPieces3, Frogland.GetCurrentCollisionLayer());
    //game.physics.arcade.collide(this.dicedPieces2, Frogland.GetCurrentCollisionLayer());
    game.physics.arcade.collide(this.loadedEffectsCollide, Frogland.GetCurrentCollisionLayer(), Collision.CollideEffectWithWorld, Collision.OverlapEffectWithWorld);
};

EffectsController.prototype.LoadMapEffects = function(layer) {
    var that = this;

    //console.log(Frogland.map.objects['Objects_' + layer]);

    Frogland.map.objects['Triggers_' + layer].forEach(function(o) {
        if(o.type === 'effect') {
            if(o.name === 'splash') {
                var splasherLeft = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                splasherLeft.width = o.width / 2;
                splasherLeft.height = o.height;
                splasherLeft.makeParticles('Misc', ['Splash0002', 'Splash0003'], 10); 
                splasherLeft.gravity = 300;
                splasherLeft.maxParticleScale = 1;
                splasherLeft.minParticleScale = 1;
                splasherLeft.minParticleSpeed.x = -50;
                splasherLeft.maxParticleSpeed.x = 10;
                splasherLeft.minParticleSpeed.y = -80;
                splasherLeft.maxParticleSpeed.y = -130;
                splasherLeft.owningLayer = layer;
                splasherLeft.setRotation(0, 0);
                splasherLeft.start(false, 200, 5);

                var splasherRight = game.add.emitter(o.x + o.width / 2, o.y);
                splasherRight.width = o.width / 2;
                splasherRight.height = o.height;
                splasherRight.makeParticles('Misc', ['Splash0000', 'Splash0001'], 10); 
                splasherRight.gravity = 300;
                splasherRight.maxParticleScale = 1;
                splasherRight.minParticleScale = 1;
                splasherRight.minParticleSpeed.x = -10;
                splasherRight.maxParticleSpeed.x = 50;
                splasherRight.minParticleSpeed.y = -80;
                splasherRight.maxParticleSpeed.y = -130;
                splasherRight.owningLayer = layer;
                splasherRight.setRotation(0, 0);
                splasherRight.start(false, 200, 5);

                that.loadedEffects.push(splasherLeft);
                that.loadedEffects.push(splasherRight);
            } else if(o.name === 'drip') {

                var dripper = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                dripper.width = o.width;
                dripper.height = o.height;
                dripper.makeParticles('Misc', ['Drip0000', 'Drip0001'], 2);
                dripper.gravity = -150;
                dripper.maxParticleSpeed.setTo(0);
                dripper.minParticleSpeed.setTo(0);
                dripper.setRotation(0, 0);
                dripper.bounce.setTo(0.5);
                dripper.start(false, 1500, game.rnd.between(1200, 2000));
                dripper.effectType = 'drip';
                dripper.alpha = 0.5;
                dripper.owningLayer = layer;

                that.loadedEffectsCollide.push(dripper);
            } else if(o.name === 'fluff') {

                var fluffer = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                // fluffer.x = o.x;
                // fluffer.y = o.y;
                fluffer.width = o.width;
                fluffer.height = o.height;
                fluffer.makeParticles('Misc', ['Fluff0000', 'Fluff0001', 'Fluff0002', 'Fluff0003'], 100);
                fluffer.gravity = -595;
                fluffer.maxParticleSpeed.setTo(10);
                fluffer.minParticleSpeed.setTo(-10);
                fluffer.setRotation(0, 0);
                fluffer.start(false, 3000, 700);
                fluffer.effectType = 'fluff';
                fluffer.alpha = 0.8;
                fluffer.owningLayer = layer;

                that.loadedEffects.push(fluffer);

            } else if(o.name === 'bubbles') {

                var bubbler = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                bubbler.width = o.width;
                bubbler.height = o.height;
                bubbler.makeParticles('Misc', ['Bubbles0000', 'Bubbles0001', 'Bubbles0002', 'Bubbles0003'], 5);
                bubbler.gravity = -600;
                bubbler.maxParticleSpeed.setTo(0);
                bubbler.minParticleSpeed.setTo(0);
                bubbler.minParticleSpeed.y = -25;
                bubbler.maxParticleSpeed.y = -50;
                bubbler.setRotation(0, 0);
                bubbler.bounce.setTo(0.5);
                bubbler.start(false, 1200, game.rnd.between(800, 1200));
                bubbler.effectType = 'bubbles';
                bubbler.alpha = 0.5;
                bubbler.owningLayer = layer;

                that.loadedEffects.push(bubbler);
                
            } else if(o.name === 'energy_spray') {

                var sprayer = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                // sprayer.x = o.x;
                // sprayer.y = o.y;
                sprayer.width = o.width;
                sprayer.height = o.height;
                sprayer.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004', 'Sparks0005'], 20);
                sprayer.gravity = -595;
                sprayer.maxParticleSpeed.setTo(10, 100);
                sprayer.minParticleSpeed.setTo(-400, -100);
                sprayer.setRotation(0, 0);
                sprayer.start(false, 300, 10);
                sprayer.effectType = 'energy_spray';
                sprayer.owningLayer = layer;

                that.loadedEffects.push(sprayer);

            } else if(o.name === 'leaves_green') {

                var leaves = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                leaves.width = o.width;
                leaves.height = o.height;
                leaves.makeParticles('Misc', ['Leaves0000', 'Leaves0001', 'Leaves0002'], 5);
                leaves.gravity = -600;
                leaves.maxParticleSpeed.y = 45;
                leaves.minParticleSpeed.y = 15;
                leaves.maxParticleSpeed.x = 40;
                leaves.minParticleSpeed.x = -40;
                leaves.setRotation(0, 0);
                leaves.start(false, 2000, 2500);
                leaves.effectType = 'leaves';
                //leaves.alpha = 0.5;
                leaves.owningLayer = layer;

                that.loadedEffects.push(leaves);
            } else if(o.name === 'leaves_brown') {

                var leaves = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                leaves.width = o.width;
                leaves.height = o.height;
                leaves.makeParticles('Misc', ['Leaves0003', 'Leaves0004', 'Leaves0005'], 5);
                leaves.gravity = -600;
                leaves.maxParticleSpeed.y = 45;
                leaves.minParticleSpeed.y = 15;
                leaves.maxParticleSpeed.x = 40;
                leaves.minParticleSpeed.x = -40;
                leaves.setRotation(0, 0);
                leaves.start(false, 2000, 2500);
                leaves.effectType = 'leaves';
                //leaves.alpha = 0.5;
                leaves.owningLayer = layer;

                that.loadedEffects.push(leaves);
            } else if(o.name === 'spirits') {
                var spirits = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
                spirits.width = o.width;
                spirits.height = o.height;
                spirits.makeParticles('Misc', ['Spirit0000', 'Spirit0001', 'Spirit0002', 'Spirit0003'], 10);
                spirits.gravity = -600;
                spirits.alpha = 0.15;
                spirits.particleDrag.setTo(0);
                spirits.maxParticleSpeed.setTo(15);
                spirits.minParticleSpeed.setTo(-15);
                spirits.minRotation = 0;
                spirits.maxRotation = 0;
                spirits.setScale();
                spirits.start(false, 5000, 4000);
                spirits.effectType = 'spirits';
                spirits.owningLayer = layer;

                that.loadedEffects.push(spirits);
            }

        } else if(o.type === 'speech') {
            var sparkles = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            sparkles.width = o.width;
            sparkles.height = o.height;
            sparkles.makeParticles('Misc', ['Sparkles0000', 'Sparkles0001', 'Sparkles0002', 'Sparkles0003', 'Sparkles0004'], 25);
            sparkles.gravity = -600;
            sparkles.maxParticleSpeed.setTo(0);
            sparkles.minParticleSpeed.setTo(0);
            sparkles.minRotation = 0;
            sparkles.maxRotation = 0;
            sparkles.setScale();
            setTimeout(function() { sparkles.start(false, 200, 100); }, game.rnd.between(0, 1000));
            sparkles.effectType = 'sparkles';
            sparkles.owningLayer = layer;

            that.loadedEffects.push(sparkles);
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
                //energyController.AddHealth(0.5);
                energyController.AddEnergy(1);
                effectsController.EnergySplash(p.body, 100, 'positive');
            } else if(p.parent === effectsController.neutralBits) {
                energyController.AddCharge(2);
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

EffectsController.prototype.SpawnEnergyNuggets = function(source, dest, color, amt) {

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

    var vel = new Phaser.Point(source.center.x - dest.x, source.center.y - dest.y);
    vel = vel.normalize();

    var minVel = Phaser.Point.rotate(vel.clone(), 0, 0, 30, true, 1);
    var maxVel = Phaser.Point.rotate(vel.clone(), 0, 0, -30, true, 1);
    
    maxVel.setMagnitude(1750);
    minVel.setMagnitude(1400);

    effect.minParticleSpeed.x = minVel.x + source.velocity.x;
    effect.maxParticleSpeed.x = maxVel.x + source.velocity.x;
    effect.minParticleSpeed.y = minVel.y + source.velocity.y;
    effect.maxParticleSpeed.y = maxVel.y + source.velocity.y;

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

EffectsController.prototype.DiceObject = function(name, x, y, xv, yv, layer) {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('Pieces').getFrameByName(name + '000' + i)) {
        pieces.push(game.add.sprite(x + game.rnd.between(-20, 20), y + game.rnd.between(-20, 20), 'Pieces', name + '000' + i));
        i++;
    }

    pieces.forEach(function(p) {
        game.physics.enable(p, Phaser.Physics.ARCADE);

        p.anchor.setTo(0.5, 0.5);
        p.body.bounce.setTo(0.5);
        p.body.angularDrag = 600;
        p.body.drag.x = 100;

        //randomly set the velocity, rotation, and lifespan
        p.body.velocity.x = game.rnd.between(-150, 150) + xv * 0.5;
        p.body.velocity.y = game.rnd.between(-100, -400) + yv * 0.5;
        p.body.angularVelocity = game.rnd.between(500, 1000);

        game.time.events.add(4000, function() { if(!!p && !!p.body) p.body.enable = false; } );

        effectsController['dicedPieces' + layer].addChild(p);
    });
};

EffectsController.prototype.ClearDicedPieces = function() {
    this.dicedPieces4.removeAll(true);
    this.dicedPieces3.removeAll(true);
    this.dicedPieces2.removeAll(true);
};

EffectsController.prototype.MakeHearts = function(amt) {

    var hearts = [];
    for(var i = 0; i < amt; i++) {

        var heart = game.add.sprite(frauki.body.center.x, frauki.body.center.y - 15, 'Misc');
        game.physics.enable(heart, Phaser.Physics.ARCADE);

        heart.animations.add('idle', ['Heart0000', 'Heart0001'], 4, true, false);
        heart.play('idle');

        heart.body.gravity.y = -500;

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
    var t = game.add.tween(Main).to( { physicsSlowMo: 0.2 }, Math.round(duration * 0.2), Phaser.Easing.Exponential.Out, false).to( { physicsSlowMo: 1 }, Math.round(duration * 0.8), Phaser.Easing.Exponential.In, false);
    t.start();

    //var currAnim = frauki.animations.currentAnim;
    //var currSpeed = frauki.animations.currentAnim.speed;

    //var t2 = game.add.tween(currAnim).to( { speed: currSpeed * 0.3 }, Math.round(duration * 0.2), Phaser.Easing.Exponential.InOut, false).to( { speed: currSpeed }, Math.round(duration * 0.8), Phaser.Easing.Exponential.InOut, false);
    //t2.start();
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

    minVel.setMagnitude(50);
    maxVel.setMagnitude(75);

    this.posSpark.minParticleSpeed.x = minVel.x;
    this.posSpark.minParticleSpeed.y = minVel.y - 25;
    this.posSpark.maxParticleSpeed.x = maxVel.x;
    this.posSpark.maxParticleSpeed.y = maxVel.y;

    this.posSpark.explode(1200, 10);

    minVel.x *= -1;
    minVel.y *= -1;
    maxVel.x *= -1;
    maxVel.y *= -1;

    this.negSpark.minParticleSpeed.x = maxVel.x;
    this.negSpark.maxParticleSpeed.x = minVel.x;
    this.negSpark.minParticleSpeed.y = maxVel.y - 25;
    this.negSpark.maxParticleSpeed.y = minVel.y;

    this.negSpark.explode(1200, 10);
};

EffectsController.prototype.EnergySplash = function(src, intensity, color, amt, vel) {

    amt = amt || 6;
    vel = vel || new Phaser.Point(0, 0);
    vel = vel.clone();
    vel.setMagnitude(vel.getMagnitude() / 3);
    intensity /= 1.5;

    if(color === 'positive') {
        this.posSpark.x = src.x;
        this.posSpark.y = src.y;
        this.posSpark.width = src.width;
        this.posSpark.height = src.height;

        this.posSpark.minParticleSpeed.x = -intensity + vel.x;
        this.posSpark.minParticleSpeed.y = -intensity + vel.y - 50;
        this.posSpark.maxParticleSpeed.x = intensity + vel.x;
        this.posSpark.maxParticleSpeed.y = intensity + vel.y;   
       
        this.posSpark.explode(1000, amt);
    } else if(color === 'neutral') {
        this.neutralSpark.x = src.x;
        this.neutralSpark.y = src.y;
        this.neutralSpark.width = src.width;
        this.neutralSpark.height = src.height;

        this.neutralSpark.minParticleSpeed.x = -intensity + vel.x;
        this.neutralSpark.minParticleSpeed.y = -intensity + vel.y - 50;
        this.neutralSpark.maxParticleSpeed.x = intensity + vel.x;
        this.neutralSpark.maxParticleSpeed.y = intensity + vel.y;   
       
        this.neutralSpark.explode(1000, amt);
    } else if(color === 'negative') {
        this.negSpark.x = src.x;
        this.negSpark.y = src.y;
        this.negSpark.width = src.width;
        this.negSpark.height = src.height;

        this.negSpark.minParticleSpeed.x = -intensity + vel.x;
        this.negSpark.minParticleSpeed.y = -intensity + vel.y - 50;
        this.negSpark.maxParticleSpeed.x = intensity + vel.x;
        this.negSpark.maxParticleSpeed.y = intensity + vel.y;   
       
        this.negSpark.explode(1000, amt);
    }
};

EffectsController.prototype.Explosion = function(src) {
    var boom = game.add.sprite(src.x - 50, src.y - 50, 'Misc');
    boom.animations.add('boom', ['Explosion0000', 'Explosion0001', 'Explosion0002', 'Explosion0003', 'Explosion0004', 'Explosion0005', 'Explosion0006', 'Explosion0007'], 18, false, false);
    boom.animations.play('boom');
    boom.animations.currentAnim.killOnComplete = true;
    events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 8, duration: 200});
};

EffectsController.prototype.JumpDust = function(src) {
    var dust = game.add.sprite(src.x - 50, src.y - 30, 'Misc', null, Frogland.effectsGroup);
    dust.animations.add('dust', ['JumpDust0000', 'JumpDust0001', 'JumpDust0002', 'JumpDust0003', 'JumpDust0004', 'JumpDust0005', 'JumpDust0006'], 10, false, false);
    dust.animations.play('dust');
    dust.alpha = 0.5;
    dust.animations.currentAnim.killOnComplete = true;
};

EffectsController.prototype.Dust = function(x, y) {
    var dust = game.add.sprite(x - 50, y - 50, 'Misc', null, Frogland.effectsGroup);
    dust.animations.add('dust', ['Dust0000', 'Dust0001', 'Dust0002', 'Dust0003', 'Dust0004', 'Dust0005'], 10, false, false);
    dust.animations.play('dust');
    dust.alpha = 0.8;
    dust.animations.currentAnim.killOnComplete = true;
};

EffectsController.prototype.EnergyStreak = function() {

    this.energyStreak.flow(500, 5, 1, 60, true);
};

EffectsController.prototype.ClashStreak = function(x, y, angle) {
    var clash = game.add.sprite(x, y, 'Misc');
    clash.anchor.setTo(0.5);
    clash.animations.add('clash', ['Clash0001', 'Clash0002', 'Clash0003'], 8, false, false);
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

EffectsController.prototype.ScreenLight = function(show) {
    if(show) {
        this.screenLight.alpha = 0;
        this.screenLight.visible = true;
        game.add.tween(this.screenLight).to( { alpha: 0.1 }, 300, Phaser.Easing.Linear.None, true);
    } else {
        game.add.tween(this.screenLight).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
    }
};

EffectsController.prototype.ScreenFlash = function() {
    this.screenLight.alpha = 0;
    this.screenLight.visible = true;
    var flash = game.add.tween(this.screenLight).to( { alpha: 0.8 }, 100, Phaser.Easing.Quartic.In, false).to( { alpha: 0 }, 150, Phaser.Easing.Quartic.Out, false);
    flash.start();
};

EffectsController.prototype.ScreenDark = function(show) {
    if(show) {
        this.screenDark.alpha = 0;
        this.screenDark.visible = true;
        game.add.tween(this.screenDark).to( { alpha: 0.3 }, 300, Phaser.Easing.Linear.None, true);
    } else {
        game.add.tween(this.screenDark).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
    }
};

EffectsController.prototype.Fade = function(show) {
    if(show) {
        this.screenDark.alpha = 0;
        this.screenDark.visible = true;
        return game.add.tween(this.screenDark).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    } else {
        return game.add.tween(this.screenDark).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
    }
};

EffectsController.prototype.SpriteTrail = function(sprite, freq, duration, dropoff, tint) {
    
    tint = tint || 0x0dff94;

    var numTrails = Math.floor(duration / freq);
    for(var i = 0; i < numTrails; i++) {
        game.time.events.add(i * freq, AddSprite);
    }

    function AddSprite() {
        var texture = PIXI.TextureCache[sprite.animations.currentFrame.uuid];

        var trailSprite = game.add.image(sprite.x - (sprite.animations.currentFrame.width / 2) * sprite.scale.x, sprite.y - 100 - (sprite.animations.currentFrame.height / 2), texture, null, Frogland.effectsGroup);
        trailSprite.anchor.setTo(0);
        trailSprite.scale.x = sprite.scale.x;
        trailSprite.tint = tint;
        trailSprite.alpha = 0.8;

        var fadeTween = game.add.tween(trailSprite).to({alpha: 0}, dropoff, Phaser.Easing.Linear.None, true);
        fadeTween.onComplete.add(function() {
            trailSprite.destroy();
        });
    }
};

EffectsController.prototype.Goddess = function(show) {
    if(show) {
        this.goddess.alpha = 0;
        this.goddess.visible = true;
        game.add.tween(this.goddess).to( { alpha: 0.8 }, 1500, Phaser.Easing.Cubic.In, true);
    } else {
        game.add.tween(this.goddess).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    }
};

EffectsController.prototype.ExplodeDoorSeal = function(door) {

    //create all the little broken pieces
    var pieces = [];

    console.log(door);

    var i = 0;
    while(game.cache.getFrameData('Pieces').getFrameByName('DoorSeal000' + i)) {
        pieces.push(game.add.sprite(door.x + game.rnd.between(-20, 20), door.y + game.rnd.between(-20, 20), 'Pieces', 'DoorSeal000' + i));
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

        game.time.events.add(4000, function() { p.body.enable = false; } );

        effectsController['dicedPieces' + Frogland.currentLayer].addChild(p);
    });

    //make a particle spray
    effectsController.EnergySplash(door.body, 100, 'positive', 20, frauki.body.velocity);
};

EffectsController.prototype.SpawnAppleCore = function(x, y) {

    var appleCore = game.add.sprite(x, y, 'Misc', 'Apple0001');
    game.physics.enable(appleCore, Phaser.Physics.ARCADE);
    appleCore.body.setSize(16, 16, 0, 2);
    appleCore.body.bounce.setTo(0.5);
    appleCore.body.drag.setTo(20);
    //appleCore.body.angularDrag.setTo(100);
    appleCore.anchor.setTo(0.5);
    effectsController['dicedPieces' + Frogland.currentLayer].addChild(appleCore);


    appleCore.body.velocity.y = -250;

    if(game.rnd.between(0, 2) > 1)
        appleCore.body.velocity.x = 75;
    else
        appleCore.body.velocity.x = -75;

    appleCore.body.angularVelocity = 1000;

    appleCore.spinTween = game.add.tween(appleCore.body).to({angularVelocity: 0}, 3000, Phaser.Easing.Exponential.In, true);

    appleCore.spinTween.onComplete.add(function() { 
        game.time.events.add(1000, function(){ appleCore.destroy(); } );
    }, appleCore);
};

EffectsController.prototype.ShatterShield = function() {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('Pieces').getFrameByName('Shield000' + i)) {
        pieces.push(game.add.sprite(frauki.body.center.x + game.rnd.between(-20, 20), frauki.body.center.y + game.rnd.between(-20, 20), 'Pieces', 'Shield000' + i));
        i++;
    }

    pieces.forEach(function(p) {
        game.physics.enable(p, Phaser.Physics.ARCADE);

        p.anchor.setTo(0.5);
        p.body.bounce.setTo(0.5);
        p.body.angularDrag = 600;
        p.body.drag.x = 100;
        p.alpha = 0.5;

        //randomly set the velocity, rotation, and lifespan
        p.body.velocity.x = game.rnd.between(-150, 150) + frauki.body.velocity.x * 0.5;
        p.body.velocity.y = game.rnd.between(-100, -200) + frauki.body.velocity.y * 0.5;
        p.body.angularVelocity = game.rnd.between(500, 1000);

        game.time.events.add(1500, function() { p.destroy(); } );

        effectsController['dicedPieces' + Frogland.currentLayer].addChild(p);
    });
};