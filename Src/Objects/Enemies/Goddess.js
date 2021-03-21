Enemy.prototype.types['Goddess'] =  function() {

	goddess = this;

	this.body.setSize(40, 45, 0, 0);
	this.anchor.setTo(0.5);

    this.animations.add('idle', ['NPC/Goddess0000', 'NPC/Goddess0001'], 2, true, false);
    this.animations.add('stuff', ['NPC/Stand0000'], 10, false, false);

    this.energy = 5;
    this.baseStunDuration = 400;

	this.body.drag.x = 500;
	this.body.allowGravity = false;

	this.Vulnerable = function() { return false; }

	this.SetDirection('left');	
	
    this.messageQueue = GameData.GetVal('goddess_message_queue');
    this.deathMessage = GameData.GetVal('goddess_death_message');
	this.currentPortrait = 'Goddess_Neutral';
    
	this.updateFunction = function() {

	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

    this.OnHit = function() {
    	if(this.energy > 0) {
    		ScriptRunner.run('goddess_hurt_' + this.energy);
			GameData.SetFlag('goddess_smacked', true);
    	} else {
    		GameData.SetFlag('goddess_killed', true);
    	}
	};

    this.Reset = function() {

    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {

	};

	this.GetWelcomeBackMessage = function() {

	};

	this.GetGameoverScript = function() {
		//INTRO AREA TRIGGERS
		if(!GameData.GetFlag('intro_finished')) {
			if(!GameData.GetFlag('first_death')) {
				GameData.SetFlag('first_death', true);
				return 'goddess_surprised_death1';
			}
			else if(!GameData.GetFlag('second_death')) {
				GameData.SetFlag('second_death', true);
				return 'goddess_surprised_death2';
			}
			else if(!GameData.GetFlag('third_death')) {
				GameData.SetFlag('third_death', true);
				return 'goddess_surprised_death3';
			}
			else {
				return 'goddess_surprised_death_final';
			}
		}
		//FIRST RUINS AREA TRIGGERS
		else if(!GameData.IsDoorOpen('spawn_to_chapel')) {
			if(GameData.data.upgrades.includes('Health2')  && !GameData.GetFlag('first_health_upgrade')) {
				GameData.SetFlag('first_health_upgrade', true);
				return 'first_health_upgrade';
			}
			else if(GameState.death.type === 'Buzzar' && !GameData.GetFlag('first_buzzar')) {
				GameData.SetFlag('first_buzzar', true);
				return 'first_buzzar';
			}
			else if(GameState.death.name === 'first_gubr' && !GameData.GetFlag('first_gubr')) {
				GameData.SetFlag('first_gubr', true);
				return 'first_gubr';
			}
			else {
				return 'goddess_console_area1';
			}
		}
		else if(GameData.IsDoorOpen('spawn_to_chapel') && !GameData.GetFlag('spawn_to_chapel')) {
			GameData.SetFlag('spawn_to_chapel', true);
			return 'first_shortcut';
		}
		else {
			return 'goddess_console';
		}
	};

	this.GetPortrait = function() {
		return this.currentPortrait;
	};

	this.AddMessage = function(msg) {
		if(this.messageQueue.length === 5) {
			this.messageQueue.shift();
		}

		this.messageQueue.push(msg);

		GameData.SetVal('goddess_message_queue', this.messageQueue);
	};

	this.GetMessage = function() {
		if(this.messageQueue.length > 0) {
			var msg = this.messageQueue.shift();
			GameData.SetVal('goddess_message_queue', this.messageQueue);
			return msg;
		}

		return 'No message';

	};

	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle');

		this.body.velocity.y = Math.sin((GameState.gameTime) / 500) * 5;		

		return true;
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
			return true;
		}

		return false;
	};
};
