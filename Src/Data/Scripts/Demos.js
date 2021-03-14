ScriptRunner.scripts['demo_Door'] = [
	{ name: 'disallow_input', props: {} },

	{ name: 'wait', props: { amount: 350 } },

	{ name: 'play_music', props: { name: 'fanfare_short'} },

	{ name: 'wait', props: { amount: 1000 } },
	{ name: 'show_text', props: { text: 'Yay, a shortcut!! I can use this to get around much easier now.', portrait: 'Enticed' } },
	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'allow_input', props: {} }
];

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
