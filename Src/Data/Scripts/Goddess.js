ScriptRunner.scripts['enter_goddess'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Goddess', fade: 1000 } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },	
];

ScriptRunner.scripts['exit_goddess'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'stop_music', props: { name: 'Goddess', fade: 1000 } },	

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'unpause_all_music', props: {} },
	{ name: 'allow_input', props: {} },

];

ScriptRunner.scripts['goddess_intro'] = [
	{ name: 'show_text', props: { text: 'There you are Frauki...', portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Some terrible little alien robots have crashed their ship here and are taking over.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "They took my four beautiful Prism Shards, and are sucking all the energy out of them.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Go now with my blessing and smash those alien robots. I want my Prism Shards back!", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	
];

ScriptRunner.scripts['goddess_welcome_return'] = [
	{ func: function() {
		if(!GameData.HasShard('Wit')) {
			ScriptRunner.run('welcome_back1');
		}
		else if(!GameData.HasShard('Will')) {
			ScriptRunner.run('welcome_back2');
		}
		else if(!GameData.HasShard('Luck')) {
			ScriptRunner.run('welcome_back3');			
		}
		else if(!GameData.HasShard('Power')) {
		    ScriptRunner.run('welcome_back4');						
		}
		else if(!GameData.GetFlag('GAME_COMPLETE')) {
			//has all the shards. initiate the endgame
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
	{ name: 'show_text', props: { text: "You're back! And you have all the Prism Shards! Oh joy. How sweet it is.", portrait: 'Goddess_Neutral' } },
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1000 } },
	
	{ name: 'run_script', props: { name: 'finish_game' } },	
];

ScriptRunner.scripts['gameover_postgame'] = [
	{ name: 'show_text', props: { text: "Ah, yep... There you are again...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'm  a little busy Frauki...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['welcome_back_postgame'] = [
	{ name: 'show_text', props: { text: "Oh...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "What are you doing back here Frauki?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You've served your purpose. There's no reason for you to be here.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I suppose you can look around...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Just please don't touch anything. Or track anymore mud into my Cathedral...", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },		
];

ScriptRunner.scripts['goddess_gameover'] = [
	{ func: function() {
		ScriptRunner.run(goddess.GetGameoverScript());
	}}
];

ScriptRunner.scripts['goddess_oh_hey'] = [
	{ name: 'show_text', props: { text: "Oh hey Frauki, what are you doing back here?", portrait: 'Goddess_Neutral' } },
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

	{ name: 'show_text', props: { text: "Did you just try and attack me Frauki...?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I'll warn you, that is a very bad idea...", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },
	
	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry2'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Oh, you think it's funny. Is that how it is?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Oh you're such a little monster sometimes.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Shame on you Frauki. Just stop it.", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry3'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Oh, you little goblin.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Why are you acting like this Frauki? It's terrible.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Just terrible.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Stop it.", portrait: 'Goddess_Neutral' } },
	
	{ func: function() {
		goddess.beenAttacked = false;
	} },

	{ name: 'run_script', props: { name: 'exit_goddess' } },	
];

ScriptRunner.scripts['goddess_angry4'] = [
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "You've been warned Frauki. Now you must be punished like a naughty child.", portrait: 'Goddess_Neutral' } },

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
	{ name: 'show_text', props: { text: "Bit of a sneaky little thing, aren't you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Anyway...", portrait: 'Goddess_Neutral' } },	
	{ name: 'show_text', props: { text: "That seal you just broke will now remain open, letting you take a nice shortcut.", portrait: 'Goddess_Neutral' } },	
	{ name: 'show_text', props: { text: "Feel free to open more of them. It should make your work a lot easier.", portrait: 'Goddess_Neutral' } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 2000 } },
	
	{ func: function() {
		goddess.SetDirection('left');
	}},
];


/*
You found it!! You beautiful little person thing!!
Great work. Now if you walk up to the door, it will open the first of four seals.
Find the other three and I will finally be free...
FREEEEEEEE!!!

OUCH! What's your problem!? Don't do that again
Frauki why are you doing this?? I demand you stop!
It hurts so bad... stop it you evil creature...
I'm warning you... if you do that again you're not going to like what happens...
I really don't appreciate being killed...
Don't.
Do.
It.
Again!!!!

Oh my! You've opened the first of four seals! I know you could do it. YOu really are a wonderful little creature.
Now keep it up, I'm sure the other prism shards can't be far. Don't get discouraged. YOu can do this.
Oh yeah, there is a special gift for you in the room behind me. Use that red prism shard to get it!

You opened the second seal! This is unbelievable...
So close to freedom!! No more musty cell...
No more dank dripping ceiling...
Just the sweet, juicy nectar of freedom...
...
Heh heh heh... just... please be careful. Don't give up.
...and thanks. Thanks for helping me.

You opened another seal!! Frauki... the closer you get, the harder it is to wait.
Before I met you, I gave up on being free.
I gave up on existing at all.
As the years and decades went by, my spirit faded into oblivion.
I no longer felt real, and time passed for me like it does for a stone.
But now that there is just one seal left, I feel real again. I'm so scared of how excited I am. This might be too good to be happening.
Please open the last seal. I know I'm asking so much of you. But if I don't escape now, my spirit will be destroyed.
I'm so scared...

The last seal is open...
I'm free...
But I'm scared to leave...
Nothing will be the same...
But the universe is calling me. I'm leaving this plane of existence.
The joy is covering me... Goodbye Frauki... I love you.
*/
