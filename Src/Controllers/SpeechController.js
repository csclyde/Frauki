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

	events.subscribe('player_roll', function(params) {
		this.HideSpeech();
	}, this);

	events.subscribe('player_jump', function(params) {
		this.HideSpeech();
	}, this);

	events.subscribe('player_heal', function(params) {
		this.HideSpeech();
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

	this.portraits = {};

	this.portraits['Neutral'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiNeutral');
	this.portraits['Neutral'].fixedToCamera = true;
	this.portraits['Neutral'].visible = false;

	this.portraits['Mad'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiMad');
	this.portraits['Mad'].fixedToCamera = true;
	this.portraits['Mad'].visible = false;

	this.portraits['Dazed'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiDazed');
	this.portraits['Dazed'].fixedToCamera = true;
	this.portraits['Dazed'].visible = false;

	this.portraits['Peaceful'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiPeaceful');
	this.portraits['Peaceful'].fixedToCamera = true;
	this.portraits['Peaceful'].visible = false;

	this.portraits['Enticed'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiEnticed');
	this.portraits['Enticed'].fixedToCamera = true;
	this.portraits['Enticed'].visible = false;

	this.portraits['Displeased'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiDispleased');
	this.portraits['Displeased'].fixedToCamera = true;
	this.portraits['Displeased'].visible = false;

	this.portraits['Mischeif'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiMischeif');
	this.portraits['Mischeif'].fixedToCamera = true;
	this.portraits['Mischeif'].visible = false;

	this.portraits['Silly'] = game.add.image(80, 70, 'UI', 'PortraitsFraukiSilly');
	this.portraits['Silly'].fixedToCamera = true;
	this.portraits['Silly'].visible = false;

	this.portraits['Irena'] = game.add.image(80, 70, 'UI', 'PortraitsIrena');
	this.portraits['Irena'].fixedToCamera = true;
	this.portraits['Irena'].visible = false;

	this.speechVisible = false;

	this.currentText = '';
	this.currentPortrait = 'Neutral';

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

	Frogland.map.objects['Triggers_' + layer].forEach(function(o) {
        if(o.type === 'speech') {
        	var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
        	zone.owningLayer = layer;
            zone.text = o.properties.text;
            zone.speechName = o.name;

            that.speechZones.push(zone);
             
        }
    });

    Frogland.map.objects['Objects_' + layer].forEach(function(o) {
    	if(!!o.properties.speech) {
    		var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
        	zone.owningLayer = layer;
            zone.speechName = o.properties.speech;

            that.speechZones.push(zone);
    	}

    });

};

SpeechController.prototype.Update = function() {

	this.portraitBox.cameraOffset.x = 140;
	this.portraitBox.cameraOffset.y = 230; 

	for(var key in this.portraits) {
		this.portraits[key].cameraOffset.x = 150;
		this.portraits[key].cameraOffset.y = 220; 
	}

	this.dialogBox.cameraOffset.x = 215; 
	this.dialogBox.cameraOffset.y = 230; 

	this.text.cameraOffset.x = 250; 
	this.text.cameraOffset.y = 240;

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

		return false;
	}

	this.displayIndex = 0;
	this.text.setText('');

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.owningLayer === Frogland.currentLayer && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
			this.SetText(Speeches[zone.speechName].text);

			this.currentPortrait = Speeches[zone.speechName].portrait || 'Neutral';
			this.portraitBox.visible = true;
			this.portraits[this.currentPortrait].visible = true;
			this.dialogBox.visible = true;
			this.text.visible = true;

			this.speechVisible = true;

			this.timers.SetTimer('auto_hide', 6000);

			return true;
		}
	}

	return false;
};

SpeechController.prototype.FraukiInSpeechZone = function() {
	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.owningLayer === Frogland.currentLayer && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
			return true;
		}
	}

	return false;

};

SpeechController.prototype.HideSpeech = function() {
	this.portraitBox.visible = false;
	this.portraits[this.currentPortrait].visible = false;
	this.dialogBox.visible = false;
	this.text.visible = false;
	this.displayIndex = 0;

	this.speechVisible = false;
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
			if(line.length + words[0].length + 1 > 36) {
				break;
			}

			line += words.shift() + ' ';
		}

		this.processedText.push(line);
	}

	this.currentText = this.processedText.join('\n');
	this.displayIndex = 0;
};