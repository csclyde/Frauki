Junk = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Junk', name);
    this.spriteType = 'junk';

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.bounce.setTo(0.5);

    this.enemyName = name.split('/')[0];

    this.destroyed = false;


    this.initialX = this.body.x;
    this.initialY = this.body.y;

};

Junk.prototype = Object.create(Phaser.Sprite.prototype);
Junk.prototype.constructor = Junk;
Junk.prototype.types = {};

Junk.prototype.JunkHit = function(o) {

	if(this.destroyed) return;

	this.destroyed = true;

	var vel = new Phaser.Point(o.body.center.x - frauki.body.center.x, o.body.center.y - frauki.body.center.y);
    vel = vel.normalize();

    vel = vel.setMagnitude(150);

    this.body.velocity = vel;

	var probTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3];

	setTimeout(function() {

	    effectsController.SpawnEnergyNuggets(o.body.center, frauki.body.center, 'neutral', null, probTable[Math.round(Math.random() * (probTable.length - 1))]);
	    effectsController.SpawnEnergyNuggets(o.body.center, frauki.body.center, 'positive', null, probTable[Math.round(Math.random() * (probTable.length - 1))]);

	    effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
	    effectsController.DiceEnemy(o, o.body.center.x, o.body.center.y);
	    events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 5, duration: 150});
	    events.publish('play_sound', {name: 'smash'});
	    o.destroy();
	}, 100);
};