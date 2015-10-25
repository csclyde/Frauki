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

ProjectileController.prototype.Spore = function(e) {
	var spore = game.add.sprite(e.body.center.x, e.body.center.y, 'EnemySprites');
	game.physics.enable(spore, Phaser.Physics.ARCADE);

	spore.body.setSize(18, 20);
	spore.body.allowGravity = false;
	spore.animations.add('idle', ['Sporoid/Spore0000'], 14, true, false);
	spore.play('idle');

	game.physics.arcade.moveToXY(spore, frauki.body.center.x, frauki.body.center.y, 200);

	spore.body.velocity.x += Math.random() * 50 - 25;
	spore.body.velocity.y += Math.random() * 50 - 25;

	spore.body.bounce.set(0.2);

	spore.projType = 'spore';
	spore.owningEnemy = e;
	spore.spawnTime = game.time.now;
	spore.lifeTime = 5000;
	spore.solid = true;

	this.projectiles.add(spore);
};

ProjectileController.prototype.FallingTile = function(sourceTile) {

	var tileName = Math.random() * 3;

	if(tileName < 1) {
		tileName = 'Tiles0000';
	} else if(tileName < 2) {
		tileName = 'Tiles0001';
	} else {
		tileName = 'Tiles0002';
	}

	var tile = game.add.sprite(sourceTile.worldX, sourceTile.worldY, 'Misc', tileName);
	game.physics.enable(tile, Phaser.Physics.ARCADE);

	tile.body.setSize(16, 16);

	tile.body.bounce.set(0.2);
	tile.rotation = (Math.random() * 1) - 0.5;
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
			p.destroy();
			childrenToRemove.push(p);
		} else if(p.solid) {
			game.physics.arcade.collide(p, Frogland.GetCurrentCollisionLayer(), this.CollideProjectileWithWorld, this.CollideProjectileWithWorld);
		}

	});

	childrenToRemove.forEach(function(e) {
		e.destroy();
	});
};

ProjectileController.prototype.CollideProjectileWithWorld = function(p, t) {
	if(t.index === 1) {
		return false;
	} else {
		return false;
	}
};

function ProjectileHit(f, p) {
	if(p.projType === 'tar' || p.projType === 'spore') {
		p.destroy();
	}
};