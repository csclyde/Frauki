Apple = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'apple';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Fresh;

    this.timers = new TimerUtil();

    this.body.allowGravity = false;

    this.shakeMagnitudeX = 0;

    this.animations.add('fresh', ['Apple0000'], 10, false, false);
    this.animations.add('eaten', ['Apple0001'], 10, false, false);

};

Apple.prototype = Object.create(Phaser.Sprite.prototype);
Apple.prototype.constructor = Apple;

Apple.prototype.create = function() {

};

Apple.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();
};

function EatApple(f, a) {
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

Apple.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Apple.prototype.Fresh = function() {
    this.PlayAnim('fresh');

    if(this.shakeMagnitudeX > 0) {
        this.body.velocity.x = Math.sin(game.time.now * 150) * this.shakeMagnitudeX;
        this.body.velocity.y = 0;
    } else {
        this.body.velocity.y = Math.sin(game.time.now / 150) * 30;
        this.body.velocity.x = 0;
    }
};

Apple.prototype.Eaten = function() {
    this.PlayAnim('fresh');

};
