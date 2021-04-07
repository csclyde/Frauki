Orb = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x + 8, y, name);
    this.spriteType = 'orb';
    this.objectName = 'Orb';
    this.name = 'orb';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(30, 30, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0.5;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.animations.add('floating', ['Orb0000', 'Orb0001', 'Orb0002', 'Orb0003'], 5, true, false);
    this.animations.add('eaten', ['Orb0000'], 10, false, false);

    this.floatPhase = game.rnd.between(1, 200);

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

Orb.prototype.collideWithPlayer = function(f) {
    return false;
};

function SmashOrb(f, o) {
    effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
    effectsController.Dust(o.body.center.x, o.body.center.y);
    effectsController.ScreenFlash();
    effectsController.DiceObject(o.objectName, o.body.center.x, o.body.center.y, o.body.velocity.x, o.body.velocity.y);
    events.publish('play_sound', {name: 'door_break'});
    o.destroy();
};

Orb.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Orb.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin((GameState.gameTime / 300) + this.floatPhase) * 30;
};

/*
need a general case for multiple events triggering one event. kill multiple enemies, and
one door opens. Or smash multiple orbs, one door opens. or whatever. Each object needs to be
somehow denoted as part of a group. they can have the group name as one of the message.

The event router could somehow handle group messages. or, for doors specifically there needs
to be code at the end of the open door event that checks if the thing is part of a group.

On the open door by id function, there is an optional second paramtere, the group name. if the
group name is specified, then then entire group needs to be accounted for before the door will
open. How is the threshold specified? 
*/