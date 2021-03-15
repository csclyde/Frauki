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
	
    this.messageQueue = GameData.GetVal('goddess_message_queue');
    this.deathMessage = GameData.GetVal('goddess_death_message');
	this.currentPortrait = 'Goddess_Neutral';


    events.subscribe('door_open_start', function(params) {
    	if(params.id === 'final_second' && !GameData.GetFlag('seal_hall_intro')) {
			ScriptRunner.run('seal_hall_intro');
			GameData.SetFlag('seal_hall_intro', true);
		} else if(params.id === 'final_first' && !GameData.GetFlag('open_second_seal')) {
			ScriptRunner.run('open_second_seal');
			GameData.SetFlag('open_second_seal', true);
		} else if(params.id === 'final_third' && !GameData.GetFlag('open_third_seal')) {
			ScriptRunner.run('open_third_seal');
			GameData.SetFlag('open_third_seal', true);
		} else if(params.id === 'final_fourth' && !GameData.GetFlag('open_fourth_seal')) {
			ScriptRunner.run('open_fourth_seal');
			GameData.SetFlag('open_fourth_seal', true);
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

        // if(GameData.GetCheckpoint() === '0' && false) {

        //     //if they killed the goddess, give the player a lecture then make her angry
        //     if(GameData.GetFlag('goddess_killed')) {
        //         ScriptRunner.run('goddess_rez_angry');
        //         GameData.SetFlag('goddess_killed', false);
        //         GameData.SetFlag('goddess_angry', true);
        //     } else if(this.deathMessage) {
        //     	events.publish('show_text', { text: this.deathMessage, portrait: 'Goddess_Neutral' });

        //     	GameData.SetVal('goddess_death_message', null);
     
        //     } else {
        //         events.publish('show_text', { text: [
		// 			"My, my... you need to be more careful! Well, brush it off and try again. On your way now.",
		// 			"Are you ok? That looked really painful... Well, I fixed you up. Go give it another shot!",
		// 			"Sorry that happened Frauki... But don't get discouraged. You can do it!"
		// 			], portrait: 'Goddess_Neutral' 
		// 		});

        //     }
        // }
    };

	///////////////////////////////ACTIONS////////////////////////////////////
	this.GetSpeech = function() {
		if(GameData.GetFlag('goddess_angry')) {
			this.currentPortrait = 'Goddess_Neutral';
			return "I'm still mad at you for killing me. Hrmph.";

		} else if(GameData.GetFlag('goddess_smacked') && this.energy > 3) {
			GameData.SetFlag('goddess_smacked', false);
			this.currentPortrait = 'Goddess_Neutral';
			return "Why have you been smacking me? Cut it out.";

		} else if(this.energy === 1) {
			this.currentPortrait = 'Goddess_Neutral';
			return "Just get away from me...";

		} else if(this.energy <= 3) {
			this.currentPortrait = 'Goddess_Neutral';
			return "You're just a bully... leave me alone.";

		} else if(energyController.GetHealth() < energyController.GetMaxHealth()) {
        	events.publish('full_heal', {});
			this.currentPortrait = 'Goddess_Neutral';
			return "Oh my, you're not looking so good. Let me fix you up...";
		} else if(this.messageQueue.length > 0) {
			return this.GetMessage();
		} else {
			this.currentPortrait = 'Goddess_Neutral';
			return ['Do you need something Frauki?', 'Oh, hello.', 'Things just aren\'t the same.', 'Yes?'];

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

		this.SetDirection('left');

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
