ScriptRunner.scripts['demo_Apple'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Oh yum! An apple. I can snack on this to regain some health.', portrait: 'Enticed' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_ChapelDoor'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'run_script', props: { name: 'goddess_shortcut' } },
];

ScriptRunner.scripts['demo_statueDoor'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'show_text', props: { text: "I opened another seal! This is great, now I can get through this area much quicker.", portrait: 'Neutral' } },
	
	{ name: 'allow_input', props: {} },
];

ScriptRunner.scripts['demo_Checkpoint'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'show_text', props: { text: "That was pretty weird... what even is that thing.", portrait: 'Displeased' } },
	{ name: 'show_text', props: { text: "Oh well, it's probably not important.", portrait: 'Neutral' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Checkpoint2'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'wait', props: { amount: 1500 } },	
	{ name: 'show_text', props: { text: "Uhhh... that felt really weird...", portrait: 'Dazed' } },
	{ name: 'show_text', props: { text: "My legs feel like jelly.", portrait: 'Dazed' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Stab'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Whee! Now if I attack while rolling, I can shish-kebab some baddies.', portrait: 'Enticed' } },
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
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'show_text', props: { text: 'Oh neat! These heart upgrades give me more health. That should make these fights a little easier!', portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: 'I bet I can find plenty more of them too.', portrait: 'Enticed' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Shield'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'wait', props: { amount: 500 } },	
	{ name: 'show_text', props: { text: 'Looks like I got a shield. This will soak up some damage and recharge all by itself.', portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "If I get a few more I'll be unstoppable!", portrait: 'Enticed' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Damage'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 1500 } },
	{ name: 'control_up', props: { pressed: true } },
	{ name: 'wait', props: { amount: 200 } },
	{ name: 'player_slash', props: {} },
	{ name: 'control_up', props: { pressed: false } },
	{ name: 'wait', props: { amount: 1500 } },	

	{ name: 'show_text', props: { text: "Whoa... alien robot power...", portrait: 'Dazed' } },
	{ name: 'show_text', props: { text: "All of my attacks will do an extra damage now.", portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "But I better not show the Goddess... she might be mad...", portrait: 'Neutral' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_PrismDoor'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'show_text', props: { text: 'Cool, seems like I can use this prism to open these special doors. That might be useful!', portrait: 'Neutral' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Wit'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: 'Hooray! I got one of the Prism Shards!', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ func: function(params) {
		goddess.alpha = 0;
		goddess.x = Frogland.goddessPositions.Wit.x;
		goddess.y = Frogland.goddessPositions.Wit.y;
		EnemyBehavior.FacePlayer(goddess);
		frauki.SetDirection('right');
		game.add.tween(goddess).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2500 } },

	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },
	

	{ name: 'show_text', props: { text: "Well done Frauki... Well done. I'm so proud of you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You have just retrieved the Green Prism Shard of Wit.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "They say whoever holds it will be brimming with cleverness and good charm.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well, do you feel it?", portrait: 'Goddess_Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'show_text', props: { text: "Ummm, I dunno.", portrait: 'Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Ah...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Well anyway...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Good job Frauki. Three more Prism Shards are out there. Keep it up!", portrait: 'Goddess_Neutral' } },
	
	{ func: function(params) {
		game.add.tween(goddess).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	

	{ func: function(params) {
		goddess.x = Frogland.goddessPositions.start.x;
		goddess.y = Frogland.goddessPositions.start.y;
		goddess.alpha = 1;
		goddess.SetDirection('left');				
	}},
	
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Will'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: "Another Prism Shard! The Goddess will be so happy with me!", portrait: 'Silly' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ func: function(params) {
		goddess.alpha = 0;	
		goddess.x = Frogland.goddessPositions.Will.x;
		goddess.y = Frogland.goddessPositions.Will.y;
		goddess.SetDirection('right');
		frauki.SetDirection('left');
		game.add.tween(goddess).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2500 } },

	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'show_text', props: { text: "Can this be true? You've rescued another one of my glimmering beauties?", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You lovely little thing. You special, amazing, precious tadpole.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "This is the Red Prism Shard of Will. It imparts great powers of focus and positivity to the one who holds it.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "But I think you already have that!", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "There are only two more Prism Shards out there. Don't let anything stop you now.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Frauki...", portrait: 'Goddess_Neutral' } },
	
	{ func: function(params) {
		game.add.tween(goddess).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	
	{ func: function(params) {
		goddess.x = Frogland.goddessPositions.start.x;
		goddess.y = Frogland.goddessPositions.start.y;
		goddess.SetDirection('left');
		goddess.alpha = 1;
	}},
	
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Luck'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: 'Another Prism Shard... this was tricky to find!', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ func: function(params) {
		goddess.alpha = 0;
		goddess.x = Frogland.goddessPositions.Luck.x;
		goddess.y = Frogland.goddessPositions.Luck.y;
		frauki.SetDirection('right');		
		game.add.tween(goddess).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2500 } },

	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'show_text', props: { text: "The third Prism Shard. The Purple Prism Shard. I knew all along that you could get this far.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "This one has the power of luck. If you hold this, the possibilities of the universe will reveal themselves to you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "It's a beautiful and humbling feeling, Frauki.", portrait: 'Goddess_Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'show_text', props: { text: "That's neat!", portrait: 'Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "Yes Frauki, it's very neat.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "So...", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "The final Prism Shard is being kept in the Alien Robots ship itself, at the very top.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I have to warn you Frauki, it will be very difficult to reach.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "The Alien Robots will use every dirty trick they can to stop you.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "But never give up. If you persist, they will eventually lose.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Remember that...", portrait: 'Goddess_Neutral' } },
	
	{ func: function(params) {
		game.add.tween(goddess).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	

	{ func: function(params) {
		goddess.x = Frogland.goddessPositions.start.x;
		goddess.y = Frogland.goddessPositions.start.y;
		goddess.alpha = 1;
		goddess.SetDirection('left');
	}},
	
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Power'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'show_text', props: { text: 'The last Prism Shard... I did it...', portrait: 'Neutral' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ func: function(params) {
		goddess.alpha = 0;
		frauki.SetDirection('right');
		goddess.x = Frogland.goddessPositions.Power.x;
		goddess.y = Frogland.goddessPositions.Power.y;
		game.add.tween(goddess).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2500 } },

	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },
	

	{ name: 'show_text', props: { text: "Frauki... I called you here because I needed your help.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "You've proven your excellence by answering that call.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "I know it was hard. I know you've struggled.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Now that you've found the Yellow Prism Shard of Power, you've found them all. I can finally rest easy.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Thank you Frauki... Thank you...", portrait: 'Goddess_Neutral' } },

	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'show_text', props: { text: "You're welcome!", portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "It was fun.", portrait: 'Silly' } },

	{ func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'show_text', props: { text: "All that's left to do now, is bring the Prism Shards back home.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "Now that they're all together, put them back in their special resting place at the cathedral.", portrait: 'Goddess_Neutral' } },
	{ name: 'show_text', props: { text: "See you there, Frauki.", portrait: 'Goddess_Neutral' } },
	
	{ func: function(params) {
		game.add.tween(goddess).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
	}},

	{ name: 'wait', props: { amount: 2000 } },
	{ name: 'run_script', props: { name: 'exit_goddess' } },
	{ name: 'wait', props: { amount: 1000 } },
	

	{ func: function(params) {
		goddess.x = Frogland.goddessPositions.start.x;
		goddess.y = Frogland.goddessPositions.start.y;
		goddess.alpha = 1;			
	}},
	
	{ name: 'allow_input', props: {} }
];
