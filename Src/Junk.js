Junk = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Junk', name);
    this.spriteType = 'junk';

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.enemyName = 'Barrel';


    this.initialX = this.body.x;
    this.initialY = this.body.y;

};

Junk.prototype = Object.create(Phaser.Sprite.prototype);
Junk.prototype.constructor = Junk;
Junk.prototype.types = {};


