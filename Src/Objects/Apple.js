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

    this.body.allowGravity = false;

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

    a.body.allowGravity = true;

    a.body.velocity.y = -250;

    if(frauki.body.center.x < a.body.center.x)
        a.body.velocity.x = 75;
    else
        a.body.velocity.x = -75;

    a.body.angularVelocity = 1000;

    a.spinTween = game.add.tween(a.body).to({angularVelocity: 0}, 3000, Phaser.Easing.Exponential.In, true);

    a.spinTween.onComplete.add(function() { 
        game.time.events.add(1000, function(){ a.destroy(); } );
    }, a);

    energyController.AddPower(5);
};

Apple.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Apple.prototype.Fresh = function() {
    this.PlayAnim('fresh');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 30;
};

Apple.prototype.Eaten = function() {
    this.PlayAnim('eaten');

};
