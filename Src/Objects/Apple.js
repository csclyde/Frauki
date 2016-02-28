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
    
    if(energyController.GetApples() < GameData.GetMaxApples()) {
        a.state = a.Eaten;
        Frogland.shardGroup.addChild(a);

        a.fixedToCamera = true;
        a.cameraOffset.x = a.x - game.camera.x;
        a.cameraOffset.y = a.y - game.camera.y;

        var xOffset = (20 * (energyController.GetApples() + 1)) - 3;

        a.zipTween = game.add.tween(a.cameraOffset).to({x: xOffset, y: 57}, 2000, Phaser.Easing.Exponential.InOut, true);

        a.zipTween.onComplete.add(function() { 
            a.destroy();
            energyController.AddApple();
        }, a);

    } else if(a.timers.TimerUp('denial')) {
        a.shakeMagnitudeX = 250;
        game.add.tween(a).to({shakeMagnitudeX: 0}, 500, Phaser.Easing.Linear.None, true);

        events.publish('play_sound', {name: 'no_energy'});

        a.timers.SetTimer('denial', 2000);
    }
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
