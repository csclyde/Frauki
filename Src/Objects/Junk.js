Junk = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Junk', name + '0000');
    this.spriteType = 'junk';

    this.anchor.setTo(0.5);

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(0.5);
    this.body.drag.setTo(200);

    this.objectName = 'Junk' + name;

    this.destroyed = false;


    this.initialX = this.body.x;
    this.initialY = this.body.y;

};

Junk.prototype = Object.create(Phaser.Sprite.prototype);
Junk.prototype.constructor = Junk;
Junk.prototype.types = {};

Junk.prototype.collideWithPlayer = function(f) {
    if(f.state === f.Rolling) {
        this.JunkHit();
    }

    return false;
};

Junk.prototype.JunkHit = function(o) {

	if(this.destroyed) return;

	this.destroyed = true;

	var vel = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel = vel.setMagnitude(150);

    this.body.velocity = vel;

	var probTable = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3];

	game.time.events.add(100, function() {

	    effectsController.SpawnEnergyNuggets(this.body, frauki.body, 'neutral', probTable[Math.round(Math.random() * (probTable.length - 1))]);
	    //effectsController.SpawnEnergyNuggets(this.body, frauki.body, 'positive', probTable[Math.round(Math.random() * (probTable.length - 1))]);

	    effectsController.ClashStreak(this.body.center.x, this.body.center.y, game.rnd.between(1, 2));
        effectsController.Dust(this.body.center.x, this.body.center.y);
	    effectsController.DiceObject(this.objectName, this.body.center.x, this.body.center.y, this.body.velocity.x, this.body.velocity.y, this.owningLayer);
	    events.publish('play_sound', {name: 'smash'});
	    this.destroy();
	}, this);
};