SpeechController = function() {

	var that  = this;

	events.subscribe('activate_speech', this.ShowSpeech, this);
	events.subscribe('control_up', this.Investigate, this);
	//events.subscribe('deactivate_speech', this.HideSpeech, this);

	events.subscribe('player_slash', this.AdvanceText, this);

	events.subscribe('show_text', function(props) {
		this.Activate(props.text, props.portrait);
	}, this);

	events.subscribe('hide_text', this.AdvanceText, this);


	this.timers = new TimerUtil();

};

SpeechController.prototype.Create = function() {

	var speechOffsetX = 91;
	var speechOffsetY = 240;

	this.portraitBox = game.add.image(80, 70, 'UI', 'Speech0000');
	this.portraitBox.animations.add('flicker', ['Speech0000', 'Speech0001'], 18, true, false);
	this.portraitBox.animations.play('flicker');
	this.portraitBox.fixedToCamera = true;
	this.portraitBox.alpha = 0.7;
	this.portraitBox.visible = false;
	this.portraitBox.cameraOffset.x = 0 + speechOffsetX;
	this.portraitBox.cameraOffset.y = 10 + speechOffsetY; 

	this.dialogBox = game.add.image(7, 7, 'UI', 'Speech0002');
	this.dialogBox.fixedToCamera = true;
	this.dialogBox.animations.add('flicker', ['Speech0002', 'Speech0003'], 18, true, false);
	this.dialogBox.animations.play('flicker');
	this.dialogBox.alpha = 0.7;
	this.dialogBox.visible = false;
	this.dialogBox.cameraOffset.x = 70 + speechOffsetX; 
	this.dialogBox.cameraOffset.y = 10 + speechOffsetY; 

	this.font = game.add.retroFont('font', 9, 13, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890?,.!#\' ', 13);
	this.font.autoUpperCase = false;
	this.font.multiLine = true;

	this.text = game.add.image(0, 0, this.font);
	this.text.fixedToCamera = true;
	this.text.visible = false;
	this.text.cameraOffset.x = 110 + speechOffsetX; 
	this.text.cameraOffset.y = 20 + speechOffsetY;

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

	for(var key in this.portraits) {
		this.portraits[key].cameraOffset.x = 10 + speechOffsetX;
		this.portraits[key].cameraOffset.y = 0 + speechOffsetY; 
	}

	this.speechVisible = false;

	this.currentText = '';
	this.currentPortrait = 'Neutral';

	this.SetText('');

	this.questionMark = game.add.sprite(0, 0, 'UI');
    this.questionMark.animations.add('blink', ['QuestionMark0000', 'QuestionMark0001'], 18, true, false);
    this.questionMark.animations.play('blink');
    this.questionMark.alpha = 0.8;
    this.questionMark.anchor.setTo(0.5);
    this.questionMark.visible = false;

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
            zone.text = o.properties ? o.properties.text : 'Error';
            zone.speechName = o.name;

            that.speechZones.push(zone);
             
        }
    });

    Frogland.map.objects['Objects_' + layer].forEach(function(o) {
    	if(!!o.properties && !!o.properties.speech) {
    		var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
        	zone.owningLayer = layer;
            zone.speechName = o.properties.speech;

            that.speechZones.push(zone);
    	}

    });

};

SpeechController.prototype.Update = function() {

	if(this.text.visible && this.displayIndex < this.currentText.length && this.timers.TimerUp('display_progress')) {
		this.displayIndex += 1;
		this.timers.SetTimer('display_progress', 1);
           
        events.publish('play_sound', {name: 'text_bloop'});

	}

	if(this.text.visible && !!this.currentSpeechZone) {
		if(this.currentSpeechZone.owningLayer !== Frogland.currentLayer || 
			frauki.body.x + frauki.body.width < this.currentSpeechZone.x || 
			frauki.body.x > this.currentSpeechZone.x + this.currentSpeechZone.width || 
			frauki.body.y + frauki.body.height < this.currentSpeechZone.y || 
			frauki.body.y > this.currentSpeechZone.y + this.currentSpeechZone.height) {

			this.HideSpeech();
		}
	}

	this.font.text = this.currentText.slice(0, this.displayIndex);

	if(this.timers.TimerUp('auto_hide')) {
		this.HideSpeech();
	}

	if(!this.text.visible && this.FraukiInSpeechZone()) {
		this.questionMark.visible = true;
		this.questionMark.x = frauki.x;
		this.questionMark.y = frauki.y - 140 + Math.sin(game.time.now / 200) * 3;
		//this.ShowSpeech();
	} else {
		this.questionMark.visible = false;
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
	this.SetText('');

	if(game.physics.arcade.overlap(frauki, goddess)) {
		this.Activate(goddess.GetSpeech(), goddess.GetPortrait());
		this.currentSpeechZone = {
			x: goddess.body.x,
			y: goddess.body.y,
			width: goddess.body.width,
			height: goddess.body.height,
			owningLayer: Frogland.currentLayer
		};
		return true;
	}

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.owningLayer === Frogland.currentLayer && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
			this.Activate(Speeches[zone.speechName].text, Speeches[zone.speechName].portrait);

			this.currentSpeechZone = zone;

			return true;
		}
	}

	return false;
};

SpeechController.prototype.Investigate = function() {
	if(!this.text.visible && this.FraukiInSpeechZone()) {
		this.ShowSpeech();
	}
};

SpeechController.prototype.AdvanceText = function() {
	if(this.text.visible) {
		if(this.displayIndex !== this.currentText.length) {
			this.displayIndex = this.currentText.length;
		} else {
			this.HideSpeech();
		}
	}
};

SpeechController.prototype.Activate = function(text, portrait) {
	this.SetText(text);

	this.currentPortrait = portrait || 'Neutral';
	this.portraitBox.visible = true;
	this.portraits[this.currentPortrait].visible = true;
	this.dialogBox.visible = true;
	this.text.visible = true;

	this.speechVisible = true;

	this.timers.SetTimer('auto_hide', 6000);

	return true;
};

SpeechController.prototype.FraukiInSpeechZone = function() {

	if(game.physics.arcade.overlap(frauki, goddess)) {
		return true;
	}

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

	this.currentSpeechZone = null;
};

SpeechController.prototype.SetText = function(text) {
	if(!text) {
		this.currentText = '';
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