ScriptRunner.scripts['demo_Apple'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Oh yum! An apple. I can snack on this to regain some health.', portrait: 'Enticed' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Door'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'run_script', props: { name: 'enter_goddess' } },
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'run_script', props: { name: 'goddess_shortcut' } },
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

ScriptRunner.scripts['demo_Wit'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: 'Hooray! This HAS to be one of those prism things the nice lady was talking about...', portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "It's my mission to get it back to her right away!", portrait: 'Mad' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Will'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "Yay, another prism shard! I'll be done in no time...", portrait: 'Silly' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Luck'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "Toss another prism on the pile. This is too easy!", portrait: 'Silly' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_Power'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'show_text', props: { text: "This prism will make a fine addition to my collection.", portrait: 'Silly' } },
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['demo_PrismDoor'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 3000 } },
	{ name: 'show_text', props: { text: 'Cool, seems like I can use this prism to open these special doors. That might be useful!', portrait: 'Neutral' } },
	{ name: 'allow_input', props: {} }
];
