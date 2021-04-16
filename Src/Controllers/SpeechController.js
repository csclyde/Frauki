SpeechController = function() {

	events.subscribe('control_up', this.Investigate, this);
	events.subscribe('hide_speech', this.HideSpeech, this);

	events.subscribe('advance_text', this.AdvanceText, this);

	events.subscribe('show_text', function(props) {
		this.Activate(props.text, props.portrait);
	}, this);

	events.subscribe('hide_text', this.HideSpeech, this);

	events.subscribe('display_region_text', function(params) {
		if(!this.timers.TimerUp('region_text') || GameState.inFinale) return;

		game.add.tween(this.regionText).
			to({alpha: 1}, 800, Phaser.Easing.Linear.None, true).
			chain(game.add.tween(this.regionText).to({alpha: 0}, 800, Phaser.Easing.Linear.None, false, 2000));

		this.regionText.setText(params.text);

		this.timers.SetTimer('region_text', 4000);
	}, this);


	this.timers = new TimerUtil();

	this.targetEnemy = null;

	this.tweens = {};
	this.tweens.surpriseMarkShake = 3;

};

SpeechController.prototype.Create = function() {

	this.speechGroup = game.add.group(Frogland.froglandGroup, 'speech');

	var speechOffsetX = 91;
	var speechOffsetY = 240;

	this.portraitBox = game.add.image(80, 70, 'UI', 'Speech0000', this.speechGroup);
	this.portraitBox.animations.add('green', ['Speech0000'], 18, true, false);
	this.portraitBox.animations.play('green');
	this.portraitBox.fixedToCamera = true;
	this.portraitBox.alpha = 0.9;
	this.portraitBox.visible = false;
	this.portraitBox.cameraOffset.x = 0 + speechOffsetX;
	this.portraitBox.cameraOffset.y = 10 + speechOffsetY; 

	this.dialogBoxX = 70 + speechOffsetX;
	this.dialogBoxSmallX = 20 + speechOffsetX;

	this.dialogBox = game.add.image(7, 7, 'UI', 'Speech0002', this.speechGroup);
	this.dialogBox.fixedToCamera = true;
	this.dialogBox.animations.add('green', ['Speech0001'], 18, true, false);
	this.dialogBox.animations.add('green_npc', ['Speech0002'], 18, true, false);
	this.dialogBox.animations.add('red_npc', ['Speech0003'], 18, true, false);
	this.dialogBox.animations.play('green');
	this.dialogBox.alpha = 0.9;
	this.dialogBox.visible = false;
	this.dialogBox.cameraOffset.x = this.dialogBoxX; 
	this.dialogBox.cameraOffset.y = 10 + speechOffsetY; 

	this.textX = 110 + speechOffsetX;
	this.textSmallX = 60 + speechOffsetX;

	this.text = game.add.bitmapText(0, 0, 'diest64','', 16);
	this.text.fixedToCamera = true;
	this.text.visible = false;
	this.text.cameraOffset.x = 110 + speechOffsetX; 
	this.text.cameraOffset.y = 15 + speechOffsetY;
	this.speechGroup.add(this.text);

	this.regionText = game.add.bitmapText(0, 0, 'rise', null, 36);
	this.regionText.fixedToCamera = true;
	this.regionText.alpha = 0;
	this.regionText.anchor.setTo(0.5);
	this.regionText.cameraOffset.x = game.width / 2; 
	this.regionText.cameraOffset.y = game.height / 3;
	this.speechGroup.add(this.regionText);	

	this.portraits = {};

	FileMap.Portraits.forEach(function(portrait) {
		this.portraits[portrait.Name] = game.add.image(200, 200, 'UI', portrait.Frame, this.speechGroup);
		this.portraits[portrait.Name].anchor.setTo(0.5, 1);
		this.portraits[portrait.Name].fixedToCamera = true;
		this.portraits[portrait.Name].visible = false;
		this.portraits[portrait.Name].cameraOffset.x = 40 + speechOffsetX;
		this.portraits[portrait.Name].cameraOffset.y = 105 + speechOffsetY; 
	}, this);

	this.speechVisible = false;

	this.currentText = '';
	this.currentPortrait = 'Neutral';

	this.SetText('');

	this.questionMark = game.add.sprite(0, 0, 'UI', null, this.speechGroup);
    this.questionMark.animations.add('blink', ['QuestionMark0000', 'QuestionMark0001'], 18, true, false);
    this.questionMark.animations.play('blink');
    this.questionMark.alpha = 0.8;
    this.questionMark.anchor.setTo(0.5);
    this.questionMark.visible = false;

    this.exclamationMark = game.add.sprite(0, 0, 'UI', null, this.speechGroup);
    this.exclamationMark.animations.add('blink', ['ExclamationMark0000', 'ExclamationMark0001'], 18, true, false);
    this.exclamationMark.animations.play('blink');
    this.exclamationMark.alpha = 0.8;
    this.exclamationMark.anchor.setTo(0.5);
    this.exclamationMark.visible = false;

	this.surpriseMark = game.add.sprite(0, 0, 'UI', 'SurpriseMark0000', this.speechGroup);
	this.surpriseMark.animations.add('shake', ['SurpriseMark0000', 'SurpriseMark0001', 'SurpriseMark0002', 'SurpriseMark0003'], 50, true, false);
    this.surpriseMark.animations.play('shake');
    this.surpriseMark.anchor.setTo(0.5);
    this.surpriseMark.visible = false;

	this.speechZones = [];

	this.LoadSpeechZones();

};

SpeechController.prototype.LoadSpeechZones = function() {
	Frogland.map.objects['Triggers'].forEach(function(o) {
        if(o.type === 'speech') {
        	var zone = new Phaser.Rectangle(o.x, o.y, o.width, o.height);
            zone.text = o.properties ? o.properties.text : 'Error';
            zone.speechName = o.name;
            zone.active = true;

            if(!!o.properties && !!o.properties.show_flag) {
            	zone.showFlag = o.properties.show_flag;
            } else {
            	zone.showFlag = null;
            }

            this.speechZones.push(zone);
             
        }
	}, this);
	
	if(!GameData.GetFlag('GAME_COMPLETE')) {
		//create speech zones for all the NPCs
		Frogland.map.objects['Enemies'].forEach(function(o) {
			if(o.gid === 149) {
				var zone = new Phaser.Rectangle(o.x + 8 - 50, o.y + 8 - 20, 100, 30);
				zone.text = o.properties ? o.properties.text : 'Error';
				zone.speechName = o.name;
				zone.NPC = true;
				zone.active = true;
	
				if(!!o.properties && !!o.properties.show_flag) {
					zone.showFlag = o.properties.show_flag;
				} else {
					zone.showFlag = null;
				}
	
				this.speechZones.push(zone);
			}
		}, this);
	}
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
		this.timers.SetTimer('display_progress', 20);
           
        events.publish('play_sound', {name: 'text_bloop'});

	}

	if(this.text.visible && !!this.currentSpeechZone) {
		if(frauki.body.x + frauki.body.width < this.currentSpeechZone.x || 
		   frauki.body.x > this.currentSpeechZone.x + this.currentSpeechZone.width || 
		   frauki.body.y + frauki.body.height < this.currentSpeechZone.y || 
		   frauki.body.y > this.currentSpeechZone.y + this.currentSpeechZone.height) {

			this.HideSpeech();
		}
	}

	this.text.setText(this.currentText.slice(0, this.displayIndex));

	if(this.timers.TimerUp('auto_hide') && this.text.visible) {
		//this.HideSpeech();
	}

	if(!this.text.visible && this.FraukiInSpeechZone() && inputController.allowInput) {
		this.questionMark.visible = true;
		this.questionMark.x = frauki.x;
		this.questionMark.y = frauki.y - 140 + Math.sin(GameState.gameTime / 200) * 3;
		//this.ShowSpeech();
        events.publish('play_sound', {name: 'speech'});

	} else {
		this.questionMark.visible = false;
        events.publish('stop_sound', {name: 'speech', fade: 600});

	}


	if(!!goddess && goddess.messageQueue.length > 0) {
		this.exclamationMark.visible = true;
		this.exclamationMark.x = goddess.x;
		this.exclamationMark.y = goddess.y - 80 + Math.sin(GameState.gameTime / 200) * 3;
		//this.ShowSpeech();

	} else {
		this.exclamationMark.visible = false;

	}

	if(!this.timers.TimerUp('enemy_surprised') && !!this.targetEnemy && !!this.targetEnemy.body) {
		this.surpriseMark.visible = true;
		this.surpriseMark.x = this.targetEnemy.body.center.x + Math.sin(GameState.gameTime / 10) * this.tweens.surpriseMarkShake;
		this.surpriseMark.y = this.targetEnemy.body.y - 20 + Math.sin(GameState.gameTime / 200) * 3;	
	} else {
		this.surpriseMark.visible = false;
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

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
			if(zone.NPC === true) {
				ScriptRunner.run('enter_NPC', { name: zone.speechName });
			} else {
				this.Activate(Speeches[zone.speechName].text, Speeches[zone.speechName].portrait);
			}

			this.currentSpeechZone = zone;

			return true;
		}
	}

	return false;
};

SpeechController.prototype.Investigate = function(params) {
	if(params.pressed && !this.text.visible && this.FraukiInSpeechZone()) {
		this.ShowSpeech();
	}
};

SpeechController.prototype.AdvanceText = function() {
	if(this.text.visible) {
		if(this.displayIndex !== this.currentText.length) {
			this.displayIndex = this.currentText.length;
		} else {
			this.HideSpeech();
			events.publish('skip_text');
		}
	}
};

SpeechController.prototype.SpeechVisible = function() {
	return this.text.visible;
};

SpeechController.prototype.CurrentTextIsAllPrinted = function() {
	return this.displayIndex === this.currentText.length;
};

SpeechController.prototype.Activate = function(text, portrait) {
	//if there is an array, pull a random one from it
	if(Array.isArray(text)) {
		text = text[Math.floor(Math.random()*text.length)];
	}

	this.SetText(text);

	this.portraits[this.currentPortrait].visible = false;
	this.currentPortrait = portrait || 'Neutral';

	if(portrait === 'red') {
		this.dialogBox.animations.play('red_npc');
		this.dialogBox.cameraOffset.x = this.dialogBoxSmallX;
		this.text.cameraOffset.x = this.textSmallX;
	} else if(portrait === 'green') {	
		this.dialogBox.animations.play('green_npc');
		this.dialogBox.cameraOffset.x = this.dialogBoxSmallX;		
		this.text.cameraOffset.x = this.textSmallX;
	} else {
		this.dialogBox.animations.play('green');
		this.dialogBox.cameraOffset.x = this.dialogBoxX;
		this.text.cameraOffset.x = this.textX;		
		
		this.portraitBox.visible = true;
		this.portraits[this.currentPortrait].visible = true;
	}

	this.dialogBox.visible = true;
	this.text.visible = true;

	this.speechVisible = true;

	this.timers.SetTimer('auto_hide', 10000);

	return true;
};

SpeechController.prototype.FraukiInSpeechZone = function() {

	if(!frauki.body.onFloor()) {
		return false;
	}

	for(var i = 0; i < this.speechZones.length; i++) {
		var zone = this.speechZones[i];
		if(zone.active && frauki.body.x + frauki.body.width > zone.x && frauki.body.x < zone.x + zone.width && frauki.body.y + frauki.body.height > zone.y && frauki.body.y < zone.y + zone.height) {
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

	var parsedText = text;

	var words = parsedText.split(' ');

	this.processedText = [];

	//three lines of text
	for(var i = 0; i < 6; i++) {
		var line = '';

		//each one a max of 40 chars
		while(words.length > 0) {
			//pop words off the front of the word list
			if(line.length + words[0].length + 1 > 42) {
				break;
			}

			line += words.shift() + ' ';
		}

		this.processedText.push(line);
	}

	this.currentText = this.processedText.join('\n');
	this.displayIndex = 0;
};

SpeechController.prototype.ShowExclamationMark = function(e) {
	if(this.timers.TimerUp('enemy_surprised') && e.objectName !== 'Goddess') {
		this.targetEnemy = e;
		this.timers.SetTimer('enemy_surprised', 2000);
		this.tweens.surpriseMarkShake = 5;
		game.add.tween(this.tweens).to( { surpriseMarkShake: 0 }, 1000, Phaser.Easing.Linear.None, true);
	}
};
