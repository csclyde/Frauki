SpeechController = function() {

	var that  = this;

	events.subscribe('activate_speech', this.ShowSpeech, this);
	events.subscribe('deactivate_speech', this.HideSpeech, this);

};

SpeechController.prototype.Create = function() {

	this.portraitBox = game.add.image(80, 70, 'UI', 'Speech0000');
	this.portraitBox.fixedToCamera = true;
	this.portraitBox.alpha = 0.7;
	this.portraitBox.visible = false;

	this.dialogBox = game.add.image(7, 7, 'UI', 'Speech0001');
	this.dialogBox.fixedToCamera = true;
	this.dialogBox.alpha = 0.7;
	this.dialogBox.visible = false;

	this.portrait = game.add.image(80, 70, 'UI', 'PortraitsFraukiNeutral');
	this.portrait.fixedToCamera = true;
	this.portrait.visible = false;
};

SpeechController.prototype.Update = function() {

	this.portraitBox.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.portraitBox.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

	this.portrait.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 10;// - 82  + 82 * (this.energy / 30);
	this.portrait.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 10;

	this.dialogBox.cameraOffset.x = Math.round(pixel.width * 0.42 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.dialogBox.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

};

SpeechController.prototype.ShowSpeech = function() {
	this.portraitBox.visible = true;
	this.portrait.visible = true;
	this.dialogBox.visible = true;
};

SpeechController.prototype.HideSpeech = function() {
	this.portraitBox.visible = false;
	this.portrait.visible = false;
	this.dialogBox.visible = false;
};