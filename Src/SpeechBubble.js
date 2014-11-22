SpeechBubble = function(x, y, text) {
	this.topLeft = game.add.image(x, y, 'UI', 'Speech0001');
	this.bottomLeft = game.add.image(x, y, 'UI', 'Speech0003');
	this.bottomRight = game.add.image(x, y, 'UI', 'Speech0005');
	this.topRight = game.add.image(x, y, 'UI', 'Speech0007');

	this.leftWall = game.add.tileSprite(x, y, 0, 0, 'UI', 'Speech0002');
	this.bottomWall = game.add.tileSprite(x, y, 0, 0, 'UI', 'Speech0004');
	this.rightWall = game.add.tileSprite(x, y, 0, 0, 'UI', 'Speech0006');
	this.topWall = game.add.tileSprite(x, y, 0, 0, 'UI', 'Speech0008');

	this.arrow = game.add.image(x, y, 'UI', 'Speech0009');
	this.interior = game.add.tileSprite(x, y, 0, 0, 'UI', 'Speech0000');
};