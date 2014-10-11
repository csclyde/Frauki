Door = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 70, 0, 0);
    this.anchor.setTo(0.5, 0.5);
    
    this.SetDirection('left');

    this.state = this.Closed;

    this.body.allowGravity = false;
    this.body.immovable = true;

    this.animations.add('closed', ['Door0000'], 10, true, false);
};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.create = function() {

};

Door.prototype.update = function() {

    if(!!this.state)
        this.state();
};

Door.prototype.SetDirection = function(dir) {
    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

Door.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Door.prototype.Closed = function() {
    this.PlayAnim('closed');
};

Door.prototype.Opening = function() {

};

Door.prototype.Open = function() {

};
