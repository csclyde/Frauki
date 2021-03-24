ScriptRunner.scripts['enter_NPC'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },

	{ func: function(params) {
		if(params.name.includes('robo')) {
			events.publish('play_music', { name: 'Sunshine', fade: 1000 });
		} else if(params.name.includes('gnome')) {
			events.publish('play_music', { name: 'Loopy', fade: 1000 });
		}

        	events.publish('pan_camera', { to: objectController.npcMap[params.name], duration: 1000 });
	} },
	
	{ name: 'wait', props: { amount: 1500 } },

	{ func: function(params) {
        	ScriptRunner.run(params.name);
	} },	
];

ScriptRunner.scripts['exit_NPC'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'stop_music', props: { name: 'Sunshine', fade: 1000 } },	
	{ name: 'stop_music', props: { name: 'Loopy', fade: 1000 } },	

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'unpause_all_music', props: {} },	
	{ name: 'allow_input', props: {} },
];

ScriptRunner.scripts['oldrobo_intro'] = [
	{ name: 'show_text', props: { text: "Whoa whoa whoa, you're coming in pretty hot. Chill...", portrait: 'OldRobo' } },
	{ name: 'show_text', props: { text: "Just chill out for one second... geez... don't slash me...", portrait: 'OldRobo' } },
	{ name: 'show_text', props: { text: "Look, this is our secret hangout. You really shouldn't be here. We like to fight and get rowdy in there.", portrait: 'OldRobo' } },
	{ name: 'show_text', props: { text: "But you look pretty tough...", portrait: 'OldRobo' } },
	{ name: 'show_text', props: { text: "I'll tell ya what... if you can beat all my Robo bros, I'll give you some of our power", portrait: 'OldRobo' } },
	{ name: 'show_text', props: { text: "If not... then bye bye Frauki! Heh heh heh. You're not scared... are you?", portrait: 'OldRobo' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
	
];

ScriptRunner.scripts['gnome_garden'] = [
	{ name: 'show_text', props: { text: "These here is my tomaters.", portrait: 'none' } },
	{ name: 'show_text', props: { text: "And before ya ask, NO. Ya can't have none.", portrait: 'none' } },
	{ name: 'show_text', props: { text: "They's all mine so keep yer grabbers off 'em!", portrait: 'none' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },	
	
];
