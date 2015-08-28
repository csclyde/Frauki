Junk = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Junk', name);
    this.spriteType = 'junk';

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.enemyName = name.split('/')[0];


    this.initialX = this.body.x;
    this.initialY = this.body.y;

};

Junk.prototype = Object.create(Phaser.Sprite.prototype);
Junk.prototype.constructor = Junk;
Junk.prototype.types = {};

Junk.prototype.JunkHit = function() {
	var probTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3];

    effectsController.SpawnEnergyNuggets(this.body.center, frauki.body.center, 'neutral', null, probTable[Math.round(Math.random() * (probTable.length - 1))]);
    effectsController.SpawnEnergyNuggets(this.body.center, frauki.body.center, 'positive', null, probTable[Math.round(Math.random() * (probTable.length - 1))]);

    effectsController.ClashStreak(this.body.center.x, this.body.center.y, game.rnd.between(1, 2));
    effectsController.DiceEnemy(this, this.body.center.x, this.body.center.y);
    events.publish('camera_shake', {magnitudeX: 10, magnitudeY: 5, duration: 150});
    events.publish('play_sound', {name: 'smash'});
    this.destroy();
};