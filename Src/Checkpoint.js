Checkpoint = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'checkpoint';

    this.animations.add('active', ['Checkpoint0000', 'Checkpoint0001', 'Checkpoint0002', 'Checkpoint0003', 'Checkpoint0004'], 10, true, false);
    this.animations.add('inactive', ['Checkpoint0005'], 10, true, false);

    this.anchor.setTo(0.5, 0.5);

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.moves = false;
    this.body.setSize(30, 30, 0, 0);

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

    if(Frogland.currentLayer !== this.owningLayer) {
        this.visible = false;
    } else {
        this.visible = true;
    }
};

Checkpoint.prototype.CheckpointHit = function(o) {

    Frogland.checkpoints.forEach(function(check) {
        check.active = false;
    });

    localStorage.setItem('fraukiCheckpoint', this.id);

	this.active = true;
};