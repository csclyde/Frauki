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

	this.currentText = '';

	this.SetText('This is a test to see if Frauki is cool and this is to pad out the text because i am implementing text wrapping and eventually multiple screens of text for really obnoxiously long bits of text.');

	this.text = game.add.bitmapText(0, 0, 'font', this.currentText, 18);
	this.text.fixedToCamera = true;
	this.text.visible = false;
};

SpeechController.prototype.Update = function() {

	this.portraitBox.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.portraitBox.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

	this.portrait.cameraOffset.x = Math.round(pixel.width * 0.27 + cameraController.camX / pixel.scale) + 10;// - 82  + 82 * (this.energy / 30);
	this.portrait.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 10;

	this.dialogBox.cameraOffset.x = Math.round(pixel.width * 0.42 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.dialogBox.cameraOffset.y = Math.round(pixel.height * 0.8 + cameraController.camY / pixel.scale) + 2;

	this.text.cameraOffset.x = Math.round(pixel.width * 0.5 + cameraController.camX / pixel.scale) + 2;// - 82  + 82 * (this.energy / 30);
	this.text.cameraOffset.y = Math.round(pixel.height * 0.82 + cameraController.camY / pixel.scale) + 2;

	this.text.setText(this.currentText);

};

SpeechController.prototype.ShowSpeech = function() {
	this.portraitBox.visible = true;
	this.portrait.visible = true;
	this.dialogBox.visible = true;
	this.text.visible = true;
};

SpeechController.prototype.HideSpeech = function() {
	this.portraitBox.visible = false;
	this.portrait.visible = false;
	this.dialogBox.visible = false;
	this.text.visible = false;
};

SpeechController.prototype.SetText = function(text) {
	var words = text.split(' ');

	this.processedText = [];

	//three lines of text
	for(var i = 0; i < 6; i++) {
		var line = '';
		var charCount = 0;

		//each one a max of 40 chars
		while(words.length > 0) {
			//pop words off the front of the word list
			if(line.length + words[0].length + 1 > 39) {
				break;
			}

			line += words.shift() + ' ';
		}

		this.processedText.push(line);
	}

	this.currentText = this.processedText.join('\n');
};