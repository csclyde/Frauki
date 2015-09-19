Checkpoint = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'checkpoint';

    this.animations.add('active', ['Checkpoint0000'], 10, true, false);
    this.animations.add('inactive', ['Checkpoint0001'], 10, true, false);

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.moves = false;

    this.active = false;

    if(!Frogland.checkpoints) Frogland.checkpoints = [];
    Frogland.checkpoints.push(this);

};

Checkpoint.prototype = Object.create(Phaser.Sprite.prototype);
Checkpoint.prototype.constructor = Checkpoint;
Checkpoint.prototype.types = {};

Checkpoint.prototype.update = function() {

    if(this.active) {
        this.animations.play('active');
    } else {
        this.animations.play('inactive');
    }
};

Checkpoint.prototype.CheckpointHit = function(o) {

    Frogland.checkpoints.forEach(function(check) {
        check.active = false;
    });

    localStorage.setItem('fraukiCheckpoint', this.id);

	this.active = true;
};