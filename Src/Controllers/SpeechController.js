SpeechController = function() {

	var that  = this;

	events.subscribe('activate_speech', this.ShowSpeech, this);
	events.subscribe('control_up', this.Investigate, this);
	//events.subscribe('deactivate_speech', this.HideSpeech, this);

	events.subscribe('advance_text', this.AdvanceText, this);

	events.subscribe('show_text', function(props) {
		this.Activate(props.text, props.portrait);
	}, this);

	events.subscribe('hide_text', this.AdvanceText, this);


	this.timers = new TimerUtil();

	this.speechVariables = {
		goober: 'booper'
	};

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

	this.font = game.add.retroFont('font', 9, 15, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890?,.!:#\' ', 13);
	this.font.autoUpperCase = false;
	this.font.multiLine = true;

	this.text = game.add.image(0, 0, this.font);
	this.text.fixedToCamera = true;
	this.text.visible = false;
	this.text.cameraOffset.x = 110 + speechOffsetX; 
	this.text.cameraOffset.y = 20 + speechOffsetY;

	this.portraits = {};

	FileMap.Portraits.forEach(function(portrait) {
		this.portraits[portrait.Name] = game.add.image(80, 70, 'UI', portrait.Frame);
		this.portraits[portrait.Name].fixedToCamera = true;
		this.portraits[portrait.Name].visible = false;
		this.portraits[portrait.Name].cameraOffset.x = 10 + speechOffsetX;
		this.portraits[portrait.Name].cameraOffset.y = 0 + speechOffsetY; 
	}, this);

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

	GameData.SetFlag('test_flag', true);

	this.LoadSpeechZones(4);
	this.LoadSpeechZones(3);

};

SpeechController.prototype.LoadSpeechZones = function(layer) {
	var that = this;

	Frogland.map.objects['Triggers_' + layer].forEach(function(o) {
        if(o.type === 'speech') {
        	var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
        	zone.owningLayer = layer;
            zone.text = o.properties ? o.properties.text : 'Error';
            zone.speechName = o.name;
            zone.active = true;

            if(!!o.properties && !!o.properties.show_flag) {
            	zone.showFlag = o.properties.show_flag;
            } else {
            	zone.showFlag = null;
            }

            that.speechZones.push(zone);
             
        }
    });
};

SpeechController.prototype.Update = function() {

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.showFlag && (GameData.GetFlag(zone.showFlag) || GameData.IsDoorOpen(zone.showFlag))) {
			zone.active = false;
		}
	}

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

	if(this.timers.TimerUp('auto_hide') && this.text.visible) {
		this.HideSpeech();
	}

	if(!this.text.visible && this.FraukiInSpeechZone()) {
		this.questionMark.visible = true;
		this.questionMark.x = frauki.x;
		this.questionMark.y = frauki.y - 140 + Math.sin(game.time.now / 200) * 3;
		//this.ShowSpeech();
        events.publish('play_sound', {name: 'speech'});

	} else {
		this.questionMark.visible = false;
        events.publish('stop_sound', {name: 'speech'});

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

SpeechController.prototype.CurrentTextIsAllPrinted = function() {
	return this.displayIndex === this.currentText.length;
}

SpeechController.prototype.Activate = function(text, portrait) {
	//if there is an array, pull a random one from it
	if(Array.isArray(text)) {
		text = text[Math.floor(Math.random()*text.length)];
	}

	this.SetText(text);

	this.portraits[this.currentPortrait].visible = false;
	this.currentPortrait = portrait || 'Neutral';
	this.portraitBox.visible = true;
	this.portraits[this.currentPortrait].visible = true;
	this.dialogBox.visible = true;
	this.text.visible = true;

	this.speechVisible = true;

	this.timers.SetTimer('auto_hide', 10000);

	return true;
};

SpeechController.prototype.FraukiInSpeechZone = function() {

	if(game.physics.arcade.overlap(frauki, goddess)) {
		return true;
	}

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.active && zone.owningLayer === Frogland.currentLayer && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
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

	events.publish('text_hidden', {});
};

SpeechController.prototype.SetText = function(text) {
	if(!text) {
		this.currentText = '';
		this.displayIndex = 0;
		return;
	}

	var parsedText = this.ParseTextVariables(text);

	var words = parsedText.split(' ');

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

SpeechController.prototype.ParseTextVariables = function(text) {
	var that = this;

	text = text.replace(/\{.*\}/g, function(match) {
		match = match.slice(1, -1);
		if(!!that.speechVariables[match]) {
			return that.speechVariables[match];
		} else {
			return 'X';
		}
	});

	return text;
};