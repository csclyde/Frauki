Upgrade = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'Upgrade';
    this.objectName = 'Upgrade';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 64, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Active;

    this.timers = new TimerUtil();

    this.body.allowGravity = false;

    this.animations.add('active3', ['Upgrade0000'], 10, true, false);
    this.animations.add('active2', ['Upgrade0001'], 10, true, false);
    this.animations.add('active1', ['Upgrade0002'], 10, true, false);

    this.animations.add('eaten', ['Upgrade0000'], 10, false, false);

    this.health = 3;

    this.icon = game.add.image(20, 20, 'Misc', 'Upgrade0003');
    this.icon.animations.add('thing', ['Upgrade0003'], 18, false, false);
    this.icon.animations.play('thing');
    this.icon.x = this.x;
    this.icon.y = this.y;
    this.icon.visible = false;

};

Upgrade.prototype = Object.create(Phaser.Sprite.prototype);
Upgrade.prototype.constructor = Upgrade;

Upgrade.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();

    if(GameData.HasUpgrade(this.upgrade)) {
        this.destroy();
    }

    this.icon.visible = this.visible;

};

Upgrade.prototype.ChangeLayerAway = function() {
    this.icon.visible = false;
};

function HitUpgrade(f, o) {
    if(o.timers.TimerUp('hit')) {
        effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
        events.publish('stop_sound', {name: 'crystal_door'});
        events.publish('play_sound', {name: 'crystal_door'});
        events.publish('play_sound', {name: 'attack_connect'});
        o.timers.SetTimer('hit', 500);

        o.health--;

        //if its dead break it, otherwise just shake it
        if(o.health <= 0) {
            effectsController.Dust(o.body.center.x, o.body.center.y);
            effectsController.ScreenFlash();
            effectsController.DiceObject(o.objectName, o.body.center.x, o.body.center.y, o.body.velocity.x, o.body.velocity.y, o.owningLayer);
            
            events.publish('stop_sound', {name: 'crystal_door'});
            events.publish('play_sound', {name: 'door_break'});
            
            GameData.AddUpgrade(o.upgrade);

            if(o.upgrade.indexOf('Health') >= 0) {
                ScriptRunner.run('demo_Health');
            } else {
                ScriptRunner.run('demo_' + o.upgrade);
            }

            o.icon.destroy();
            o.destroy();
        } else {
            o.shakeMagnitudeX = 100;
            game.add.tween(o).to({shakeMagnitudeX: 0 }, 500, Phaser.Easing.Linear.None, true);
        }
    }

};

Upgrade.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Upgrade.prototype.Active = function() {
    this.PlayAnim('active' + this.health);

    this.body.velocity.y = Math.sin(game.time.now / 400) * 30;

    if(this.shakeMagnitudeX > 0) {
        this.body.velocity.x = Math.sin(game.time.now * 150) * this.shakeMagnitudeX;
    } else {
        this.body.velocity.x = 0;
    }

    this.icon.x = this.x - 25;
    this.icon.y = this.y - 25;
};
