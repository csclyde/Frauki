CAM_DRAG_RATE = 5;
X_VEL_DIV = 15;
Y_VEL_DIV = 30;

CameraController = function(player, map) {
	this.player = player;
	this.map = map;

	this.camX = player.body.x;
	this.camY = player.body.y;

	this.repulsiveTiles = [];

	this.prevXVel = 0;
	this.prevYVel = 0;

	this.retweenY = false;

	events.subscribe('player_crouch', this.CrouchCamera, this);
}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	

	var xOffset = this.player.direction === 'left' ? -15 : 15;
	var yOffset = this.player.body.velocity.y > 0 ? 20 : 0;

	yOffset += (this.player.isCrouching ? 50 : 0);

	var tileXOffset = 0;
	var tileYOffset = 0;

	this.map.forEach(function(tile) {
		if(tile && this.repulsiveTiles.indexOf(tile.index) > -1) {
			//tile is on the right
			if(tile.x > (game.camera.x + (game.camera.width / 2)) / map.tileWidth) {
				tileXOffset -= 1;
			} else {
				tileXOffset += 1;
			}

			//tile is on the bottom
			if(tile.y > (game.camera.y + (game.camera.height / 2)) / map.tileHeight) {
				tileYOffset -= 1;
			} else {
				tileYOffset += 1;
			}
		}

	}, this,
	Math.floor(game.camera.x / map.tileWidth),
	Math.floor(game.camera.y / map.tileHeight),
	Math.floor(game.camera.width / map.tileWidth),
	Math.floor(game.camera.height / map.tileHeight));

	tileXOffset /= 2;
	tileYOffset /= 2;

	if(this.prevXVel !== this.player.body.velocity.x)
		game.add.tween(this).to({camX:Math.floor((this.player.body.velocity.x / X_VEL_DIV) + xOffset + tileXOffset)}, 700, Phaser.Easing.Sinusoidal.Out, true);

	if(this.prevYVel !== this.player.body.velocity.y || this.retweenY) {
		game.add.tween(this).to({camY:Math.floor((this.player.body.velocity.y / Y_VEL_DIV) + yOffset + tileYOffset)}, 400, Phaser.Easing.Sinusoidal.Out, true);
		this.retweenY = false;
	}

	game.camera.focusOnXY(this.camX + this.player.body.x, this.camY + this.player.body.y);

	this.prevXVel = this.player.body.velocity.x;
	this.prevYVel = this.player.body.velocity.y;
}

CameraController.prototype.SetRepulsiveTiles = function(tileArray) {
	this.repulsiveTiles = tileArray;
}

CameraController.prototype.CrouchCamera = function(params) {
	this.retweenY = true;
}
