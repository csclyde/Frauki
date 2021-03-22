MAX_FLUFF_SPEED = 20;

EffectsController = function() {
    var that = this;

    this.timers = new TimerUtil();

    //unassigned particles will be set to move towards this destination
    this.activeDest = null;
    this.enemySource = null;
    this.enemyDest = null;

    this.particleType = 'pos';

    this.loadedEffects = [];
    this.loadedEffectsCollide = [];

    events.subscribe('screen_flash', this.ScreenFlash, this);

};

EffectsController.prototype.Update = function() {
    this.loadedEffects.forEach(function(o) {
        var padding = 100;

        if(o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
            o.on = true;
        } else {
            o.on = false;
        }
        
    });

    this.loadedEffectsCollide.forEach(function(o) {
        var padding = 100;

        if(o.x > game.camera.x - padding && o.y > game.camera.y - padding && o.x < game.camera.x + game.camera.width + padding && o.y < game.camera.y + game.camera.height + padding) {
            o.on = true;
        } else {
            o.on = false;
        }
        
    });
        
    this.energyStreak.x = frauki.attackRect.body.x;
    this.energyStreak.y = frauki.attackRect.body.y;
    this.energyStreak.width = frauki.attackRect.body.width;
    this.energyStreak.height = frauki.attackRect.body.height;

    this.charge1.x = frauki.body.center.x;
    this.charge1.y = frauki.body.center.y;

    game.physics.arcade.collideGroupVsTilemapLayer(this['dicedPieces'], Frogland.GetCollisionLayer(), null, null, null, false);
    game.physics.arcade.collide(this.loadedEffectsCollide, Frogland.GetCollisionLayer(), Collision.CollideEffectWithWorld, Collision.OverlapEffectWithWorld);

    if(frauki.state === frauki.Healing) {
        effectsController.MaterializeApple(frauki.body.center.x, frauki.body.y - 5, true);
    } else if(effectsController.materializingApple.visible) {
        effectsController.MaterializeApple(0, 0, false);
    }
};

EffectsController.prototype.Reset = function() {
    this.dicedPieces.removeAll(true);
};

EffectsController.prototype.CreateEffect = function(e, x, y, w, h) {
    var effect = game.add.emitter(x || 0, y || 0, e.Count);
    effect.width = w || 0;
    effect.height = h || 0;
    effect.makeParticles('Misc', e.Frames); 
    effect.gravity.setTo(0, e.Gravity || -700);
    effect.particleDrag.setTo(e.Drag || 0);
    effect.setRotation(e.MinRot || 0, e.MaxRot || 0);
    effect.minParticleSpeed.setTo(e.MinSpeedX || 0, e.MinSpeedY || 0);
    effect.maxParticleSpeed.setTo(e.MaxSpeedX || 0, e.MaxSpeedY || 0);
    effect.alpha = e.Alpha || 1;
    effect.minParticleScale = e.MinScale || 1;
    effect.maxParticleScale = e.MaxScale || 1;

    return effect;
};

EffectsController.prototype.CreateMidgroundEffects = function() {
    var that = this;

    this.dicedPieces = game.add.group();
    this.effectsGroup = game.add.group();

    Effects.Emitters.forEach(function(e) {
        this[e.Name] = this.CreateEffect(e);
        this.effectsGroup.add(this[e.Name]);
    }, this);

    this.materializingApple = game.add.image(0, 0, 'Misc', 'Apple0000');
    this.materializingApple.animations.add('mat', ['Apple0007', 'Apple0008', 'Apple0009', 'Apple0010', 'Apple0011', 'Apple0012'], 12, true, false);
    this.materializingApple.animations.play('mat');
    this.materializingApple.visible = false;
    this.materializingApple.anchor.setTo(0.5);

    this.charge1 = game.add.image(0, 0, 'Misc', 'Charge10000');
    this.charge1.animations.add('flicker', ['Charge10000', 'Charge10001', 'Charge10002', 'Charge10003'], 18, true, false);
    this.charge1.animations.play('flicker');
    this.charge1.visible = false;
    this.charge1.anchor.setTo(0.5);

    this.effectsGroup.add(this.materializingApple);
    this.effectsGroup.add(this.charge1);

    this.LoadMapEffects();
};

EffectsController.prototype.CreateForegroundEffects = function() {
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
};

EffectsController.prototype.LoadMapEffects = function() {
    Frogland.map.objects['Effects'].forEach(function(o) {
        if(o.name === 'splash') {
            var splasherLeft = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            splasherLeft.width = o.width / 2;
            splasherLeft.height = o.height;
            splasherLeft.makeParticles('Misc', ['Splash0002', 'Splash0003'], 10); 
            splasherLeft.gravity.setTo(0, 300);
            splasherLeft.maxParticleScale = 1;
            splasherLeft.minParticleScale = 1;
            splasherLeft.minParticleSpeed.x = -50;
            splasherLeft.maxParticleSpeed.x = 10;
            splasherLeft.minParticleSpeed.y = -80;
            splasherLeft.maxParticleSpeed.y = -130;
            splasherLeft.setRotation(0, 0);
            splasherLeft.start(false, 200, 5);

            var splasherRight = game.add.emitter(o.x + o.width / 2, o.y);
            splasherRight.width = o.width / 2;
            splasherRight.height = o.height;
            splasherRight.makeParticles('Misc', ['Splash0000', 'Splash0001'], 10); 
            splasherRight.gravity.setTo(0, 300);
            splasherRight.maxParticleScale = 1;
            splasherRight.minParticleScale = 1;
            splasherRight.minParticleSpeed.x = -10;
            splasherRight.maxParticleSpeed.x = 50;
            splasherRight.minParticleSpeed.y = -80;
            splasherRight.maxParticleSpeed.y = -130;
            splasherRight.setRotation(0, 0);
            splasherRight.start(false, 200, 5);

            this.loadedEffects.push(splasherLeft);
            this.loadedEffects.push(splasherRight);
        } else if(o.name === 'drip') {

            var dripper = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            dripper.width = o.width;
            dripper.height = o.height;
            dripper.makeParticles('Misc', ['Drip0000', 'Drip0001'], 2);
            dripper.gravity.setTo(0, -200);
            dripper.maxParticleSpeed.setTo(0);
            dripper.minParticleSpeed.setTo(0);
            dripper.setRotation(0, 0);
            dripper.bounce.setTo(0.5);
            dripper.start(false, 1500, game.rnd.between(1200, 2000));
            dripper.effectType = 'drip';
            dripper.alpha = 0.5;

            this.loadedEffectsCollide.push(dripper);
        } else if(o.name === 'dripDirty') {

            var dripper = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            dripper.width = o.width;
            dripper.height = o.height;
            dripper.makeParticles('Misc', ['DripDirty0000', 'DripDirty0001'], 2);
            dripper.gravity.setTo(0, -200);
            dripper.maxParticleSpeed.setTo(0);
            dripper.minParticleSpeed.setTo(0);
            dripper.setRotation(0, 0);
            dripper.bounce.setTo(0.5);
            dripper.start(false, 1500, game.rnd.between(2000, 3000));
            dripper.effectType = 'dripDirty';
            dripper.alpha = 0.5;

            this.loadedEffectsCollide.push(dripper);
        } else if(o.name === 'fluff') {

            var fluffer = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            // fluffer.x = o.x;
            // fluffer.y = o.y;
            fluffer.width = o.width;
            fluffer.height = o.height;
            fluffer.makeParticles('Misc', ['Fluff0000', 'Fluff0001', 'Fluff0002', 'Fluff0003'], 100);
            fluffer.gravity.setTo(0, -695);
            fluffer.maxParticleSpeed.setTo(10);
            fluffer.minParticleSpeed.setTo(-10);
            fluffer.setRotation(0, 0);
            fluffer.start(false, 3000, 700);
            fluffer.effectType = 'fluff';
            fluffer.alpha = 0.8;

            this.loadedEffects.push(fluffer);
        } else if(o.name === 'bubbles') {

            var bubbler = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            bubbler.width = o.width;
            bubbler.height = o.height;
            bubbler.makeParticles('Misc', ['Bubbles0000', 'Bubbles0001', 'Bubbles0002', 'Bubbles0003'], 5);
            bubbler.gravity.setTo(0, -700);
            bubbler.maxParticleSpeed.setTo(0);
            bubbler.minParticleSpeed.setTo(0);
            bubbler.minParticleSpeed.y = -25;
            bubbler.maxParticleSpeed.y = -50;
            bubbler.setRotation(0, 0);
            bubbler.bounce.setTo(0.5);
            bubbler.start(false, 1200, game.rnd.between(1200, 1800));
            bubbler.effectType = 'bubbles';
            bubbler.alpha = 0.5;

            this.loadedEffects.push(bubbler);
            
        } else if(o.name === 'energy_spray') {
            var sprayer = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            // sprayer.x = o.x;
            // sprayer.y = o.y;
            sprayer.width = o.width;
            sprayer.height = o.height;
            sprayer.makeParticles('Misc', ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004', 'Sparks0005'], 20);
            sprayer.gravity.setTo(0, -695);
            sprayer.maxParticleSpeed.setTo(-10, 100);
            sprayer.minParticleSpeed.setTo(400, -100);
            sprayer.setRotation(0, 0);
            sprayer.start(false, 300, 10);
            sprayer.effectType = 'energy_spray';

            this.loadedEffects.push(sprayer);

        } else if(o.name === 'sparks') {
            var sprayer = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            // sprayer.x = o.x;
            // sprayer.y = o.y;
            sprayer.width = o.width;
            sprayer.height = o.height;
            sprayer.makeParticles('Misc', ['Sparks0012', 'Sparks0013', 'Sparks0014', 'Sparks0015', 'Sparks0015', 'Sparks0015'], 20);
            sprayer.gravity.setTo(0, -695);
            sprayer.maxParticleSpeed.setTo(-10, 200);
            sprayer.minParticleSpeed.setTo(200, -100);
            sprayer.setRotation(0, 0);
            sprayer.start(false, 200, 150);
            sprayer.effectType = 'sparks';

            this.loadedEffects.push(sprayer);
        } else if(o.name === 'leaves_green') {
            var leaves = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            leaves.width = o.width;
            leaves.height = o.height;
            leaves.makeParticles('Misc', ['Leaves0000', 'Leaves0001', 'Leaves0002'], 5);
            leaves.gravity.setTo(0, -700);
            leaves.maxParticleSpeed.y = 45;
            leaves.minParticleSpeed.y = 15;
            leaves.maxParticleSpeed.x = 40;
            leaves.minParticleSpeed.x = -40;
            leaves.setRotation(0, 0);
            leaves.start(false, 2000, 2500);
            leaves.effectType = 'leaves';
            //leaves.alpha = 0.5;

            this.loadedEffects.push(leaves);
        } else if(o.name === 'leaves_brown') {
            var leaves = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            leaves.width = o.width;
            leaves.height = o.height;
            leaves.makeParticles('Misc', ['Leaves0003', 'Leaves0004', 'Leaves0005'], 5);
            leaves.gravity.setTo(0, -700);
            leaves.maxParticleSpeed.y = 45;
            leaves.minParticleSpeed.y = 15;
            leaves.maxParticleSpeed.x = 40;
            leaves.minParticleSpeed.x = -40;
            leaves.setRotation(0, 0);
            leaves.start(false, 2000, 2500);
            leaves.effectType = 'leaves';
            //leaves.alpha = 0.5;

            this.loadedEffects.push(leaves);
        } else if(o.name === 'spirits') {
            var spirits = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            spirits.width = o.width;
            spirits.height = o.height;
            spirits.makeParticles('Misc', ['Spirit0000', 'Spirit0001', 'Spirit0002', 'Spirit0003'], 10);
            spirits.gravity.setTo(0, -700);
            spirits.alpha = 0.15;
            spirits.particleDrag.setTo(0);
            spirits.maxParticleSpeed.setTo(15);
            spirits.minParticleSpeed.setTo(-15);
            spirits.minRotation = 0;
            spirits.maxRotation = 0;
            spirits.setScale();
            spirits.start(false, 5000, 4000);
            spirits.effectType = 'spirits';

            this.loadedEffects.push(spirits);
        }
    }, this);

    Frogland.map.objects['Triggers'].forEach(function(o) {
        if(o.type === 'speech') {
            var sparkles = game.add.emitter(o.x + (o.width / 2), o.y + (o.height / 2));
            sparkles.width = o.width;
            sparkles.height = o.height;
            sparkles.makeParticles('Misc', ['Sparkles0000', 'Sparkles0001', 'Sparkles0002', 'Sparkles0003', 'Sparkles0004'], 25);
            sparkles.gravity.setTo(0, -700);
            sparkles.maxParticleSpeed.setTo(0);
            sparkles.minParticleSpeed.setTo(0);
            sparkles.minRotation = 0;
            sparkles.maxRotation = 0;
            sparkles.setScale(1);

            sparkles.start(false, 200, 100);
            sparkles.effectType = 'sparkles';

            this.loadedEffects.push(sparkles);
        }
    }, this);
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

EffectsController.prototype.SplashDirty = function(tile) {
    if(this.timers.TimerUp('splash_timer') && frauki.states.direction) {

        if(frauki.states.direction === 'left') {
            this.splash = this.splashDirtyRight;
        } else if(frauki.states.direction === 'right') {
            this.splash = this.splashDirtyLeft;
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

EffectsController.prototype.DiceObject = function(name, x, y, xv, yv) {

    var pieces = [];

    var i = 0;
    while(game.cache.getFrameData('Pieces').getFrameByName(name + '000' + i)) {
        pieces.push(game.add.sprite(x, y, 'Pieces', name + '000' + i));
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
        p.body.velocity.y = game.rnd.between(-200, -400) + yv * 0.5;
        p.body.angularVelocity = game.rnd.between(500, 1000);

        game.time.events.add(4000, function() { if(!!p && !!p.body) p.body.enable = false; } );

        effectsController['dicedPieces'].addChild(p);
    });
};

EffectsController.prototype.ClearDicedPieces = function() {
    this.dicedPieces.removeAll(true);
};

EffectsController.prototype.SlowHit = function(duration) {
    var t = game.add.tween(GameState).to( { physicsSlowMo: 0.05 }, Math.round(duration * 0.2), Phaser.Easing.Exponential.Out, false).to( { physicsSlowMo: 1 }, Math.round(duration * 0.8), Phaser.Easing.Exponential.In, false);
    t.start();
};

EffectsController.prototype.SparkSplash = function(src) {

    this.posSpark.x = src.body.center.x;
    this.posSpark.y = src.body.center.y;

    var minVel = new Phaser.Point(50, 50);
    var maxVel = new Phaser.Point(150, 150);

    this.posSpark.minParticleSpeed.x = -150;
    this.posSpark.minParticleSpeed.y = -150;
    this.posSpark.maxParticleSpeed.x = 150;
    this.posSpark.maxParticleSpeed.y = 150;

    this.posSpark.explode(1200, 20);
};

EffectsController.prototype.EnergySplash = function(src, intensity, color, amt, vel) {

    if(!src) return;
    
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
    var boom = game.add.sprite(src.x, src.y, 'Misc', null, this.effectsGroup);
    boom.anchor.setTo(0.5);
    boom.animations.add('boom', ['Explosion0000', 'Explosion0001', 'Explosion0002', 'Explosion0003', 'Explosion0004', 'Explosion0005', 'Explosion0006'], 18, false, false);
    boom.animations.play('boom');
    boom.animations.currentAnim.killOnComplete = true;
    events.publish('camera_shake', {magnitudeX: 5, magnitudeY: 2, duration: 200});
};

EffectsController.prototype.JumpDust = function(src) {
    if(GameState.restarting) return;
    
    var dust = game.add.sprite(src.x - 50, src.y - 30, 'Misc', null, this.effectsGroup);
    dust.animations.add('dust', ['JumpDust0000', 'JumpDust0001', 'JumpDust0002', 'JumpDust0003', 'JumpDust0004', 'JumpDust0005', 'JumpDust0006'], 10, false, false);
    dust.animations.play('dust');
    dust.alpha = 0.5;
    dust.animations.currentAnim.killOnComplete = true;
};

EffectsController.prototype.DoorDust = function(src) {
    var dust = game.add.sprite(src.x - 50, src.y - 30, 'Misc', null, this.effectsGroup);
    dust.animations.add('dust', ['DoorDust0000', 'DoorDust0001', 'DoorDust0002', 'DoorDust0003', 'DoorDust0004'], 10, false, false);
    dust.animations.play('dust');
    dust.alpha = 0.5;
    dust.animations.currentAnim.killOnComplete = true;
};

EffectsController.prototype.Dust = function(x, y) {
    var dust = game.add.sprite(x - 50, y - 50, 'Misc', null, this.effectsGroup);
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
    clash.animations.add('clash', ['Clash0000', 'Clash0001', 'Clash0002', 'Clash0003'], 8, false, false);
    clash.animations.play('clash');
    clash.animations.currentAnim.killOnComplete = true;
    clash.rotation = angle;
};

EffectsController.prototype.DripSplash = function(src, onWater) {
    var yPos = src.y - (src.y % 16) + 2;

    var dripSplash = game.add.sprite(src.x - 10, yPos, 'Misc');
    dripSplash.animations.add('splish', ['DripSplash0000', 'DripSplash0001', 'DripSplash0002', 'DripSplash0003', 'DripSplash0004'], 18, false, false);
    dripSplash.animations.play('splish');
    dripSplash.animations.currentAnim.killOnComplete = true;
    dripSplash.alpha = 0.5;

    
    //if it hit water, then make a ripple
    if(onWater) {
        events.publish('play_sound', {name: 'drip', restart: false });
        
        var ripple = game.add.sprite(src.x, yPos + 8, 'Misc');
        ripple.anchor.setTo(0.5);
        ripple.animations.add('ripple', ['Ripple0000', 'Ripple0001', 'Ripple0002', 'Ripple0003', 'Ripple0004', 'Ripple0005'], 12, false, false);
        ripple.animations.play('ripple');
        ripple.animations.currentAnim.killOnComplete = true;
        ripple.alpha = 0.5;
    }
};

EffectsController.prototype.DripDirtySplash = function(src, onWater) {
    var yPos = src.y - (src.y % 16) + 2;

    var dripSplash = game.add.sprite(src.x - 10, yPos, 'Misc');
    dripSplash.animations.add('splish', ['DripDirtySplash0000', 'DripDirtySplash0001', 'DripDirtySplash0002', 'DripDirtySplash0003', 'DripDirtySplash0004'], 18, false, false);
    dripSplash.animations.play('splish');
    dripSplash.animations.currentAnim.killOnComplete = true;
    dripSplash.alpha = 0.5;

    
    //if it hit water, then make a ripple
    if(onWater) {
        events.publish('play_sound', {name: 'drip', restart: false });
        
        var ripple = game.add.sprite(src.x, yPos + 8, 'Misc');
        ripple.anchor.setTo(0.5);
        ripple.animations.add('ripple', ['RippleDirty0000', 'RippleDirty0001', 'RippleDirty0002', 'RippleDirty0003', 'RippleDirty0004', 'RippleDirty0005'], 12, false, false);
        ripple.animations.play('ripple');
        ripple.animations.currentAnim.killOnComplete = true;
        ripple.alpha = 0.5;
    }
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
    var flash = game.add.tween(this.screenLight).to( { alpha: 0.8 }, 150, Phaser.Easing.Quartic.In, false).to( { alpha: 0 }, 150, Phaser.Easing.Quartic.Out, false);
    flash.start();
};

EffectsController.prototype.ScreenDark = function(show, amt) {
    if(show) {
        this.screenDark.alpha = 0;
        this.screenDark.visible = true;
        game.add.tween(this.screenDark).to( { alpha: amt || 0.3 }, 300, Phaser.Easing.Linear.None, true);
    } else {
        game.add.tween(this.screenDark).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
    }
};

EffectsController.prototype.Fade = function(show, dur) {
    this.screenDark.bringToTop();
    if(show) {
        this.screenDark.alpha = 0;
        this.screenDark.visible = true;
        return game.add.tween(this.screenDark).to( { alpha: 1 }, dur || 2500, Phaser.Easing.Linear.In, true);
    } else {
        return game.add.tween(this.screenDark).to( { alpha: 0 }, dur || 1000, Phaser.Easing.Quintic.In, true);
    }
};

EffectsController.prototype.ExplodeDoorSeal = function(door) {

    //create all the little broken pieces
    var pieces = [];

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

        game.time.events.add(6000, function() { if(!!p && !!p.body) p.body.enable = false; } );

        effectsController.dicedPieces.addChild(p);
    });

    //make a particle spray
    effectsController.EnergySplash(door.body, 100, 'positive', 20, frauki.body.velocity);
};

EffectsController.prototype.SpawnAppleCore = function(x, y) {

    var appleCore = game.add.sprite(x, y, 'Misc', 'Apple0001', this.effectsGroup);
    game.physics.enable(appleCore, Phaser.Physics.ARCADE);
    appleCore.body.setSize(16, 16, 0, 2);
    appleCore.body.bounce.setTo(0.5);
    appleCore.body.drag.setTo(20);
    //appleCore.body.angularDrag.setTo(100);
    appleCore.anchor.setTo(0.5);
    effectsController.dicedPieces.addChild(appleCore);


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

EffectsController.prototype.MaterializeApple = function(x, y, show) {
    this.materializingApple.x = x;
    this.materializingApple.y = y;

    if(show) {
        this.materializingApple.visible = true;
    } else {
        this.materializingApple.visible = false;
    }
};

EffectsController.prototype.StarBurst = function(src) {

    this.stars.x = src.x - 5;
    this.stars.y = src.y - 5;
    this.stars.width = 10;
    this.stars.height = 10;

    this.stars.explode(250, game.rnd.between(4, 6));
};

EffectsController.prototype.SprocketBurst = function(src, amt) {

    this.sprockets.x = src.x - 5;
    this.sprockets.y = src.y - 50;
    this.sprockets.width = 10;
    this.sprockets.height = 10;

    this.sprockets.explode(2000, amt || game.rnd.between(5, 10));

    this.sprockets.minParticleSpeed.setTo(-200);
    this.sprockets.maxParticleSpeed.setTo(200, 0);
    this.sprockets.particleDrag.setTo(100);
};

EffectsController.prototype.Dizzy = function(duration) {
    return; 
    GameState.tweens.dizzies = game.add.tween(GameState).to( {currentAlpha: 0.2}, 1000, Phaser.Easing.Exponential.In, false).to( {currentAlpha: 1}, duration, Phaser.Easing.Quintic.In, false);
    GameState.tweens.dizzies.start();

    GameState.tweens.slowMo = game.add.tween(GameState).to( {physicsSlowMo: 0.6}, 1000, Phaser.Easing.Quintic.In, false).to( {physicsSlowMo: 1}, duration, Phaser.Easing.Quintic.In, false);
    GameState.tweens.slowMo.start();
};
