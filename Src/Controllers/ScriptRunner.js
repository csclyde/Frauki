ScriptRunner = {};

ScriptRunner.create = function() {
	this.waitEvent = null;
	this.currentCommand = null;
	this.waitTime = 200;

	events.subscribe('text_hidden', function(params) {
		if(!!this.waitEvent) {
			game.time.events.remove(this.waitEvent);
			this.waitEvent = null;

			if(!!this.currentCommand && !!this.currentCommand.nextCommand) {
				this.executeCommand(this.currentCommand.nextCommand);
			}
		}
	}, this);
};

ScriptRunner.run = function(name, params) {
	//find the script, and then execute each item sequentially
	if(!!this.scripts[name]) {

		//chain all the commands together by informing each of the next one
		for(var i = 0; i < this.scripts[name].length - 1; i++) {
			this.scripts[name][i].nextCommand = this.scripts[name][i + 1];
		}

		//execute the first command in the chain. It will call the following commands
		this.executeCommand(this.scripts[name][0]);

	} else {
		console.warn('Script with name ' + name + ' was not found');
	}
};

ScriptRunner.executeCommand = function(cmd) {
	var that = this;

	this.currentCommand = cmd;
	this.waitEvent = null;

	if(!cmd) return;

	if(cmd.name === 'wait') {
		this.waitEvent = game.time.events.add(cmd.props.amount, function() { that.executeCommand(cmd.nextCommand); });
	} else {
		events.publish(cmd.name, cmd.props);

		this.executeCommand(cmd.nextCommand);
	}
};

ScriptRunner.scripts = [];

ScriptRunner.scripts['demo_Baton'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Oh neat! This weapon let\'s me throw my energy out like a boomerang. The more energy I have, the stronger it will be!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'activate_weapon', props: { activate: true, override: true } },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Stab'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Whee! Now if I attack while rolling, I can shish-kebab some baddies.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_roll', props: {} },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_slash', props: {} },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Dive'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Whoa... Down attacking in the air now lets me do a power attack!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_jump', props: { jump: true } },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_crouch', props: { crouch: true } },
	{ name: 'player_slash', props: {} },
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'player_crouch', props: { crouch: false } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Health'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Yay, more health!', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Apple'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Apples are tasty. If I find one, I can eat it with the right shoulder button to regain health.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 8000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Will'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Hooray! This must be the prism thing of... whatever... I should take it back to that lady.', portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Wit'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Yay, another prism shard! I\'ll be done in no time...', portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Luck'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Toss another prism on the pile. This is too easy!', portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Power'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'This prism will make a fine addition to my collection.', portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Will_no_intro'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Hooray! I found some big... jewel thing...', portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 6000 } },
	{ name: 'hide_text', props: {} },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_intro'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: 'Oh, hello there...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'It\'s been a long time since I\'ve seen... anyone...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Would you mind helping me out of this prison? All you need to do is find the four prism shards.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'The first one looks like... hmm... a big red floating jewel thing. You can\'t miss it.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Please hurry... I\'ve been trapped in here a very long time.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_shard'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'You found it!! You beautiful little person thing!!', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'Great work. Now if you walk up to the door, it will open the first of four seals.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 250 } },
	{ name: 'show_text', props: { text: 'Find the other three and I will finally be free...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_4'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "OUCH! What's your problem!? Don't do that again.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_3'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "Frauki why are you doing this?? I demand you stop!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_2'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "It hurts so bad... stop it you evil creature...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_hurt_1'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "I'm warning you... if you do that again you're not going to like what happens...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_rez_angry'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "I really don't appreciate being killed...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Don\'t.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Do.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'It.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 100 } },
	{ name: 'show_text', props: { text: 'Again!!!!!!', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];

ScriptRunner.scripts['seal_hall_intro'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "Nice work, you've opened the first of four seals.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Keep it up, I'm sure the other prism shards can't be far.", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "There is a special gift for you in the room behind me. Use that red prism shard to get it!", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['goddess_restate'] = [
	{ name: 'show_text', props: { text: "Yep, go find the red Prism Shard and free me. It looks like a big red jewel. Hurry along now.", portrait: 'Goddess_Neutral' } }
];

ScriptRunner.scripts['goddess_freedom'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "Freedom!! No more musty cell...", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'No more dank dripping ceiling...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Just the sweet, juicy nectar of freedom...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: '...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Now Frauki, I know I\'ve already asked a lot of you. But there is more to do. That prism shard you hold is a powerful artifact.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'In fact, it\'s one of four powerful artifacts. Together they make up the Mother Prism, an object of great and mysterious power.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'If you could find the remaining three prism shards that have been carelessly tossed around the world... well...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Just trust me. It will be pretty cool. I know you can do it... I\'m counting on you...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 9000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];

ScriptRunner.scripts['goddess_meet_with_shard'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'Oh, hello there...', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 4000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'It looks like you\'ve found a Prism Shard! Yes, that big red jewel.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: 'That\'s very good news, because I happen to need that shard to escape this horrible prison.', portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "I've been in here so long... would you mind just walking up and opening this door for me?", portrait: 'Goddess_Neutral' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'allow_input', props: {} }

];

ScriptRunner.scripts['door_victory'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 350 } },

	{ name: 'play_sound', props: { name: 'fanfare_short'} },

	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'show_text', props: { text: 'Yay, a shortcut!! I can use this to get around much easier now.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'allow_input', props: {} }

];
