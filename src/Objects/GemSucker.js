GemSucker = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'GemSucker';
    this.objectName = 'GemSucker';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 64, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0;

    this.state = this.Active;

    this.timers = new TimerUtil();

    this.animations.add('sucking', ['GemSucker0000', 'GemSucker0001'], 6, true, false);
    this.animations.add('broken', ['GemSucker0002'], 10, true, false);

    this.health = 6;

    this.icon = game.add.image(20, 20, 'Misc', 'Shard0000');
    this.icon.animations.add('Wit', ['Shard0000'], 6, false, false);
    this.icon.animations.add('Will', ['Shard0001'], 6, false, false);
    this.icon.animations.add('Luck', ['Shard0002'], 6, false, false);
    this.icon.animations.add('Power', ['Shard0003'], 6, false, false);
    this.icon.iconSet = false;
    this.icon.x = -40;
    this.icon.y = -77;

    this.addChild(this.icon);

};

GemSucker.prototype = Object.create(Phaser.Sprite.prototype);
GemSucker.prototype.constructor = GemSucker;

GemSucker.prototype.collideWithPlayer = function(f) {
    return false;
};

GemSucker.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();

    if(GameData.HasShard(this.prism)) {        
        this.destroy();
    }

    if(!this.icon.iconSet) {
        this.icon.animations.play(this.prism);
        this.icon.iconSet = true;
    }
};

GemSucker.prototype.Hit = function() {
    if(this.timers.TimerUp('hit')) {
        effectsController.ClashStreak(this.body.center.x, this.body.center.y, game.rnd.between(1, 2));
        effectsController.StarBurst(this.body.center);        
        events.publish('play_sound', {name: 'attack_connect', restart: true});
        this.timers.SetTimer('hit', 500);

        this.health -= frauki.GetCurrentDamage();

        //if its dead break it, otherwise just shake it
        if(this.health <= 0) {
            ScriptRunner.run('destroy_gemsucker', { prism: this });
        } else {
            this.shakeMagnitudeX = 300;
            game.add.tween(this).to({shakeMagnitudeX: 0 }, 500, Phaser.Easing.Linear.None, true);
        }
    }

};

GemSucker.prototype.BlowUp = function() {
    var center = this.body.center.clone();
    effectsController.Dust(center.x, center.y);
    effectsController.ScreenFlash();
    effectsController.DiceObject(this.objectName, center.x, center.y, this.body.velocity.x, this.body.velocity.y);

    for(var i = 0, max = 3; i < max; i++) {
        game.time.events.add(i * game.rnd.between(150, 200), function() {
    
            var pt = center.clone();
            pt.x += game.rnd.between(-20, 20);
            pt.y += game.rnd.between(-20, 20);

            effectsController.Explosion(pt);
        });
    };

    effectsController.SprocketBurst(center);
    this.destroy();    
};

GemSucker.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

GemSucker.prototype.Active = function() {
    this.PlayAnim('sucking');

    this.icon.y = (Math.sin(GameState.gameTime / 30) * 2) - 77;

    if(this.health <= 2) {
        this.state = this.Broken;
    }

    if(this.shakeMagnitudeX > 0) {
        this.body.velocity.x = Math.sin(GameState.gameTime * 300) * this.shakeMagnitudeX;
    } else {
        this.body.velocity.x = 0;
    }
};

GemSucker.prototype.Broken = function() {
    this.PlayAnim('broken');

    this.icon.y = (Math.sin(GameState.gameTime / 15) * 2) - 77;
    

    if(this.shakeMagnitudeX > 0) {
        this.body.velocity.x = Math.sin(GameState.gameTime * 300) * this.shakeMagnitudeX;
    } else {
        this.body.velocity.x = 0;
    }
};
