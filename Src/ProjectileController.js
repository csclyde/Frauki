ProjectileController = function() {
	this.projectiles = game.add.group();
};

ProjectileController.prototype.Tarball = function(e) {
	var tar = game.add.sprite(e.body.center.x, e.body.center.y, 'EnemySprites');
	game.physics.enable(tar, Phaser.Physics.ARCADE);
	tar.animations.add('idle', ['Haystax/Tarball0000', 'Haystax/Tarball0001'], 14, true, false);
	tar.play('idle');

	//parabolic arc
	var duration = 1.2;
	tar.body.velocity.x = (frauki.body.center.x - tar.body.center.x) / duration;
	tar.body.velocity.y = (frauki.body.center.y + -0.5 * game.physics.arcade.gravity.y * duration * duration - tar.body.center.y) / duration;

	tar.projType = 'tar';
	tar.owningEnemy = e;

	this.projectiles.add(tar);
};