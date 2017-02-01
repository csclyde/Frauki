Enemy.prototype.types['Goddess'] =  function() {

	goddess = this;

	this.body.setSize(25, 80, 0, 0);
	this.anchor.setTo(.5);

    this.animations.add('idle', ['Goddess/Goddess0000'], 10, false, false);
    this.animations.add('stuff', ['Goddess/Stand0000'], 10, false, false);

    this.energy = 5;
    this.baseStunDuration = 400;


    this.body.drag.x = 500;

    this.messageQueue = GameData.GetVal('goddess_message_queue');
    this.deathMessage = GameData.GetVal('goddess_death_message');

    events.subscribe('door_open_start', function(params) {
    	if(params.id === 'final_second' && !GameData.GetFlag('seal_hall_intro')) {
			ScriptRunner.run('seal_hall_intro');
			GameData.SetFlag('seal_hall_intro', true);
    	} else if(params.id === 'prison_door') {
    		GameData.SetFlag('goddess_released', true);
    	}
    });

    events.subscribe('door_open_finish', function(params) {
    	if(params.id === 'prison_door' && !GameData.GetFlag('prison_door_intro')) {
			ScriptRunner.run('goddess_freedom');
			GameData.SetFlag('prison_door_intro', true);
    	}
    });
    
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
    	//if the goddess is angry from being killed, reset that
        GameData.SetFlag('goddess_angry', false);

        if(GameData.GetCheckpoint() === '0') {

            //if they killed the goddess, give the player a lecture then make her angry
            if(GameData.GetFlag('goddess_killed')) {
                ScriptRunner.run('goddess_rez_angry');
                GameData.SetFlag('goddess_killed', false);
                GameData.SetFlag('goddess_angry', true);
            } else if(this.deathMessage) {
            	events.publish('show_text', { text: this.deathMessage, portrait: 'Goddess_Neutral' });

            	GameData.SetVal('goddess_death_message', null);
     
            } else {
                events.publish('show_text', { text: [
					"My, my... you need to be more careful! Well, brush it off and try again. On your way now.",
					"Are you ok? That looked really painful... Well, I fixed you up. Go give it another shot!",
					"Sorry that happened Frauki... But don't get discouraged. You can do it!"
					], portrait: 'Goddess_Neutral' 
				});

            }
        }
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {
		if(GameData.GetFlag('goddess_angry')) {
			return "I'm still mad at you for killing me. Hrmph.";

		} else if(GameData.GetFlag('goddess_smacked') && this.energy > 3) {
			GameData.SetFlag('goddess_smacked', false);
			return "Why have you been smacking me? Cut it out.";

		} else if(this.energy === 1) {
			return "Just get away from me...";

		} else if(this.energy <= 3) {
			return "You're just a bully... leave me alone.";

		} else if(energyController.GetHealth() < energyController.GetMaxHealth()) {
        	events.publish('full_heal', {});
			return "Oh my, you're not looking so good. Let me fix you up...";
		} else if(this.messageQueue.length > 0) {
			return this.GetMessage();
		} else {
			return ['Do you need something Frauki?', 'Oh, hello.', 'Things just aren\'t the same.', 'Yes?'];

		}
	};

	this.GetPortrait = function() {
		return 'Goddess_Neutral';
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

		EnemyBehavior.FacePlayer(this);

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



	this.attackFrames = {

	};

};
