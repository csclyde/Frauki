Orb = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'orb';
    this.objectName = 'Orb';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.animations.add('floating', ['Orb0000'], 10, false, false);
    this.animations.add('eaten', ['Orb0000'], 10, false, false);

};

Orb.prototype = Object.create(Phaser.Sprite.prototype);
Orb.prototype.constructor = Orb;

Orb.prototype.create = function() {

};

Orb.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();
};

function SmashOrb(f, o) {
    effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
    effectsController.Dust(o.body.center.x, o.body.center.y);
    effectsController.ScreenFlash();
    effectsController.DiceObject(o, o.body.center.x, o.body.center.y);
    events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 5, duration: 150});
    events.publish('play_sound', {name: 'door_break'});
    o.destroy();
};

Orb.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Orb.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin(game.time.now / 300) * 30;
};
