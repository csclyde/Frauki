SpeechController = function() {

	var that  = this;

	events.subscribe('activate_speech', this.ShowSpeech, this);
	//events.subscribe('deactivate_speech', this.HideSpeech, this);

	events.subscribe('player_slash', function(params) {
		if(this.displayIndex !== this.currentText.length) {
			this.displayIndex = this.currentText.length;
		} else {
			this.HideSpeech();
		}
	}, this);

	this.timers = new TimerUtil();

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


	this.SetText('');

	this.text = game.add.bitmapText(0, 0, 'font', this.currentText, 18);
	this.text.fixedToCamera = true;
	this.text.visible = false;

	this.speechZones = [];

	this.LoadSpeechZones(4);
	this.LoadSpeechZones(3);
	this.LoadSpeechZones(2);

};

SpeechController.prototype.LoadSpeechZones = function(layer) {
	var that = this;

	Frogland.map.objects['Objects_' + layer].forEach(function(o) {
        if(o.type === 'speech') {
        	var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
        	zone.owningLayer = layer;
            zone.text = o.properties.text;
            zone.name = o.name;

            that.speechZones.push(zone);
             
        }
    });

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

	if(this.text.visible && this.displayIndex < this.currentText.length && this.timers.TimerUp('display_progress')) {
		this.displayIndex += 1;
		this.timers.SetTimer('display_progress', 1);
	}

	this.text.setText(this.currentText.slice(0, this.displayIndex));

	if(this.timers.TimerUp('auto_hide')) {
		this.HideSpeech();
	}

};

SpeechController.prototype.ShowSpeech = function() {
	if(this.text.visible) {
		if(this.displayIndex !== this.currentText.length) {
			this.displayIndex = this.currentText.length;
		} else {
			this.HideSpeech();
		}

		return;
	}

	this.displayIndex = 0;
	this.text.setText('');

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.owningLayer === Frogland.currentLayer && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
			this.SetText(Speeches[zone.name]);

			this.portraitBox.visible = true;
			this.portrait.visible = true;
			this.dialogBox.visible = true;
			this.text.visible = true;

			this.timers.SetTimer('auto_hide', 4000);

			break;
		}
	}
};

SpeechController.prototype.HideSpeech = function() {
	this.portraitBox.visible = false;
	this.portrait.visible = false;
	this.dialogBox.visible = false;
	this.text.visible = false;
	this.displayIndex = 0;
};

SpeechController.prototype.SetText = function(text) {
	if(!text) {
		this.currentText = 'undefined';
		this.displayIndex = 0;
		return;
	}

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
	this.displayIndex = 0;
};