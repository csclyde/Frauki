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

    this.animations.add('active3', ['Upgrade0000', 'Upgrade0001', 'Upgrade0002'], 10, true, false);
    this.animations.add('active2', ['Upgrade0003', 'Upgrade0004', 'Upgrade0005'], 10, true, false);
    this.animations.add('active1', ['Upgrade0006', 'Upgrade0007', 'Upgrade0008'], 10, true, false);

    this.animations.add('eaten', ['Upgrade0000'], 10, false, false);

    this.health = 3;

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

            //speechController.Activate('test!!!', 'Neutral');

            ScriptRunner.run('demo_' + o.upgrade);

            o.destroy();
        } else {

        }
    }

};

Upgrade.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Upgrade.prototype.Active = function() {
    this.PlayAnim('active' + this.health);
};
