CAM_DRAG_RATE = 5;
X_VEL_DIV = 5;
Y_VEL_DIV = 30;

CameraController = function(player, map) {
	this.player = player;

	this.camX = player.body.x;
	this.camY = player.body.y;

	this.repulsiveTiles = [];
}

//camera is controlled in player centric space
CameraController.prototype.UpdateCamera = function() {
	

	var xOffset = this.player.direction === 'left' ? -20 : 20;
	var yOffset = this.player.body.velocity.y > 0 ? 20 : 0;

	game.add.tween(this).to({camX:Math.floor((this.player.body.velocity.x / X_VEL_DIV) + xOffset)}, 300, Phaser.Easing.Linear.None, true);
	game.add.tween(this).to({camY:(this.player.body.velocity.y / Y_VEL_DIV) + yOffset}, 40, Phaser.Easing.Exponential.None, true);

	game.camera.focusOnXY(this.camX + this.player.body.x, this.camY + this.player.body.y);

	function RepulseCamera(tile) {

	}
}

CameraController.prototype.SetRepulsiveTiles = function(tileArray) {
	this.repulsiveTiles = tileArray;
}