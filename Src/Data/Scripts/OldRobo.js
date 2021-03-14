ScriptRunner.scripts['enter_oldrobo'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Sunshine', fade: 1000 } },

	{ func: function() {
        events.publish('pan_camera', { to: oldrobo.body.center, duration: 1000 });
	} },
	
	{ name: 'wait', props: { amount: 1500 } },

	{ name: 'run_script', props: { name: 'oldrobo_intro' } },	
];

ScriptRunner.scripts['exit_oldrobo'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'stop_music', props: { name: 'Sunshine', fade: 1000 } },	

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'unpause_all_music', props: {} },	
	{ name: 'allow_input', props: {} },

];

ScriptRunner.scripts['oldrobo_intro'] = [
	{ name: 'show_text', props: { text: "Whoa whoa whoa, you're coming in pretty hot. Chill...", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 5000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Just chill out for one second... geez... don't slash me...", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "Look, this is our secret hangout. You really shouldn't be here. We like to fight and get rowdy in there.", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "But you look pretty tough...", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "I'll tell ya what... if you can beat all my Robo bros, I'll give you some of our power", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'wait', props: { amount: 200 } },
	{ name: 'show_text', props: { text: "If not... then bye bye Frauki! Heh heh heh. You're not scared... are you?", portrait: 'OldRobo' } },
	{ name: 'wait', props: { amount: 7000 } },
	{ name: 'hide_text', props: {} },

	{ name: 'run_script', props: { name: 'exit_oldrobo' } },	
	
];
