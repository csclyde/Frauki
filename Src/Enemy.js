Enemy = function(game, x, y, name) {
	Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(.5, 1);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.y = 500;
    this.direction = 'right';

    this.updateFunction = Insectoid.Update;

    Insectoid.Create(this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function() {
	//use the type property to call the correct create function. that function will assign the update function


};

Enemy.prototype.update = function() {
	//if(!!this.updateFunction) {
		this.updateFunction.apply(this);
	//} else {
		//console.log('what haps');
	//}
};

//provide utility functions here that the specific enemies can all use
Enemy.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};