ScriptRunner.scripts['enter_goddess'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'play_interlude', props: { name: 'Goddess', fade: 1000 } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },	
];

ScriptRunner.scripts['exit_goddess'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'stop_interlude', props: { fade: 1000 } },
	{ name: 'allow_input', props: {} },

];

ScriptRunner.scripts['goddess_intro'] = [
	{ name: 'show_text', props: { text: 'There you are, Frauki...', portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Some terrible little Alien Robots have crashed their ship here and are taking over.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "They took my four beautiful Prism Gems, and are sucking all the energy out of them.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go now with my blessing and smash those Alien Robots. I want my Prism Gems back!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	
];

ScriptRunner.scripts['goddess_welcome_return'] = [
	{ func: function() {
		if(!GameData.HasGem('Wit')) {
			ScriptRunner.run('welcome_back1');
		}
		else if(!GameData.HasGem('Will')) {
			ScriptRunner.run('welcome_back2');
		}
		else if(!GameData.HasGem('Luck')) {
			ScriptRunner.run('welcome_back3');
		}
		else if(!GameData.HasGem('Power')) {
		    ScriptRunner.run('welcome_back4');
		}
		else if(!GameData.GetFlag('GAME_COMPLETE')) {
			//has all the gems. initiate the endgame
		    ScriptRunner.run('welcome_back5');
		    //ScriptRunner.run('exit_goddess');
			
		} else {
		    ScriptRunner.run('welcome_back_postgame');
		}
	}},
];

ScriptRunner.scripts['welcome_back1'] = [
	{ name: 'show_text', props: { text: GoddessSpeeches.welcome_back1, portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back2'] = [
	{ name: 'show_text', props: { text: GoddessSpeeches.welcome_back2, portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back3'] = [
	{ name: 'show_text', props: { text: GoddessSpeeches.welcome_back3, portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back4'] = [
	{ name: 'show_text', props: { text: GoddessSpeeches.welcome_back4, portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back5'] = [
	{ name: 'show_text', props: { text: "You're back! And you have all the Prism Gems! Oh joy. How sweet it is.", portrait: 'Goddess_Neutral' } },
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1000 } },
	
	{ name: 'run_script', props: { name: 'finish_game' } },	
];

ScriptRunner.scripts['gameover_postgame'] = [
	{ name: 'show_text', props: { text: "Ah, yep... There you are again...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm  a little busy, Frauki...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back_postgame'] = [
	{ name: 'show_text', props: { text: "Oh...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "What are you doing back here, Frauki?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You've served your purpose. There's no reason for you to be here.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I suppose you can look around...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Just please don't touch anything, or track anymore mud into my Cathedral...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },		
];

ScriptRunner.scripts['goddess_gameover'] = [
	{ func: function() {
		ScriptRunner.run(goddess.GetGameoverScript());
	}}
];

ScriptRunner.scripts['goddess_oh_hey'] = [
	{ name: 'show_text', props: { text: "Oh hey, Frauki, what are you doing back here?", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
];

ScriptRunner.scripts['goddess_chat'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ func: function(params) {
		ScriptRunner.run(goddess.GetChatScript());
		frauki.SetDirection('right');
	}}
];

ScriptRunner.scripts['goddess_angry1'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Did you just try and attack me, Frauki...?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm warning you, that's a very bad idea...", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },
	
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry2'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Oh, you think it's funny. Is that how it is?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You're such a little monster sometimes.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Shame on you, Frauki. Just stop it.", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry3'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Oh, you little goblin.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Why are you acting like this, Frauki? It's terrible.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Just terrible.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "This is your final warning. Stop it.", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry4'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "You've been warned, Frauki. Now you must be punished like a naughty child.", portrait: 'Goddess_Neutral' } },

	{ name: 'wait', props: { amount: 1500 } },

	{ func: function() {
		frauki.ChangeState(frauki.Dying);
		frauki.body.velocity.y = -300;
		frauki.body.velocity.x = -500;
		GameState.physicsSlowMo = 0.1;
		GameState.death.name = 'goddess';
		goddess.beenAttacked = false;
		
		for(var i = 0, max = energyController.GetHealth() + energyController.GetShield(); i < max; i++) {
            game.time.events.add(i * 400, function() {
				effectsController.Explosion({ x: frauki.body.center.x + game.rnd.between(-20, 20), y: frauki.body.center.y + game.rnd.between(-20, 20) });
				effectsController.StarBurst(frauki.body.center);
				
				energyController.RemoveHealth(1);	
            });
        };
	}},
	
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_shortcut'] = [
	{ func: function() {
		goddess.SetDirection('right');
		GameData.SetFlag('intro_finished', true);
	}},
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'show_text', props: { text: "Oh, you're behind me now.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Bit of a sneaky little thing, aren't you?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Anyway...", portrait: 'Goddess_Neutral' } },	
	{ name: 'show_text', props: { text: "That seal you just broke will now remain open, letting you take a nice shortcut.", portrait: 'Goddess_Neutral' } },	
	{ name: 'show_text', props: { text: "Feel free to open more of them. It should make your work a lot easier.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 2000 } },
	
	{ func: function() {
		goddess.SetDirection('left');
	}},
];
