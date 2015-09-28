SpeechController = function() {

	var that  = this;

	events.subscribe('activate_speech', this.ShowSpeech, this);
	events.subscribe('deactivate_speech', this.HideSpeech, this);

};

SpeechController.prototype.Create = function() {

	this.portrait = game.add.image(80, 70, 'UI', 'Speech0000');
	this.portrait.fixedToCamera = true;
	this.portrait.alpha = 0.7;
	this.portrait.visible = false;

	this.dialogBox = game.add.image(7, 7, 'UI', 'Speech0001');
	this.dialogBox.fixedToCamera = true;
	this.dialogBox.alpha = 0.7;
	this.dialogBox.visible = false;
};

SpeechController.prototype.Update = function() {

	this.portrait.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.portrait.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

	this.dialogBox.cameraOffset.x = Math.round(pixel.width * 0.42 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.dialogBox.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

};

SpeechController.prototype.ShowSpeech = function() {
	this.portrait.visible = true;
	this.dialogBox.visible = true;
};

SpeechController.prototype.HideSpeech = function() {
	this.portrait.visible = false;
	this.dialogBox.visible = false;
};