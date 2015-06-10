ProjectileController = function() {
	this.projectiles = game.add.group();
};

ProjectileController.prototype.Tarball = function(e) {
	var tar = game.add.sprite(e.body.center.x, e.body.center.y, 'EnemySprites');
	game.physics.enable(tar, Phaser.Physics.ARCADE);

	tar.body.setSize(18, 20);
	tar.animations.add('idle', ['Haystax/Tarball0000', 'Haystax/Tarball0001'], 14, true, false);
	tar.play('idle');

	//parabolic arc
	var duration = 1.2;
	tar.body.velocity.x = (frauki.body.center.x - tar.body.center.x) / duration;
	tar.body.velocity.y = (frauki.body.center.y + -0.5 * game.physics.arcade.gravity.y * duration * duration - tar.body.center.y) / duration;

	tar.body.bounce.set(0.75);

	tar.projType = 'tar';
	tar.owningEnemy = e;
	tar.spawnTime = game.time.now;
	tar.lifeTime = 5000;
	tar.solid = true;

	this.projectiles.add(tar);
};

ProjectileController.prototype.FallingTile = function(sourceTile) {

	console.log('tile spawn', sourceTile);

	var tile = game.add.sprite(sourceTile.worldX, sourceTile.worldY, 'Misc', 'Tiles0000');
	game.physics.enable(tile, Phaser.Physics.ARCADE);

	tile.body.setSize(16, 16);

	tile.body.bounce.set(0.2);
	tile.rotation = (Math.random() * 0.2) - 0.1;
	tile.body.velocity.x = Math.random() * 50;
	tile.body.drag.x = 200;

	tile.projType = 'tile';
	tile.spawnTime = game.time.now;
	tile.lifeTime = 3000;

	this.projectiles.add(tile);
};

ProjectileController.prototype.Update = function() {
	var that = this;

	var childrenToRemove = [];

	this.projectiles.forEach(function(p) {

		if(game.time.now - p.spawnTime > p.lifeTime && p.lifeTime !== 0) {
			p.kill();
			childrenToRemove.push(p);
		} else if(p.solid) {
			game.physics.arcade.collide(p, Frogland.GetCurrentCollisionLayer());
		}

	});

	childrenToRemove.forEach(function(e) {
		e.destroy();
	});
};

function ProjectileHit(f, p) {
	if(p.projType === 'tar') {
		p.destroy();
	}
};