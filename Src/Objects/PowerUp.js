PowerUp = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'powerup';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0.5;
    this.body.drag.setTo(500);
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Waiting;

    this.timers = new TimerUtil();

    //this.body.allowGravity = false;

    this.shakeMagnitudeX = 0;

    this.animations.add('waiting', ['Heart0000', 'Heart0001'], 4, true, false);
    var used = this.animations.add('used', ['Stars0000', 'Stars0001','Stars0002','Stars0003'], 10, false, false);
    used.killOnComplete = true;

};

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.create = function() {

};

PowerUp.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();
};

function UsePowerUp(f, a) {
    if(a.state === a.Eaten)
        return;
    
    a.state = a.Eaten;

    events.publish('play_sound', {name: 'crystal_door'});

    if(!GameData.GetFlag('first_apple_eaten')) {
        ScriptRunner.run('demo_Apple');
        GameData.SetFlag('first_apple_eaten', true);
    }


    energyController.AddApple();
    a.destroy();

    

};

PowerUp.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

PowerUp.prototype.Waiting = function() {
    this.PlayAnim('waiting');
};

PowerUp.prototype.Used = function() {
    this.PlayAnim('used');

};
