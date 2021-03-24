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

ScriptRunner.scripts['robo_slickback'] = [
	{ name: 'show_text', props: { text: "Scram, kid. I'm stylin' here...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Ain't got no time for your silly kid games.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I've killed a hundred men, and didn't feel a thing.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Yep...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'm pretty tough...", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['robo_samurai'] = [
	{ name: 'show_text', props: { text: "Every blade of grass... a poem.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Every breath of wind... a fleeting dream.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Every drop of water...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Hmm, I'll have to think about that one.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "A babies tear?", portrait: 'red' } },
	{ name: 'show_text', props: { text: "No no, that's stupid. Hmm...", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['robo_chonker'] = [
	{ name: 'show_text', props: { text: "I'm really just not feeling it today.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I know how to blast. But I don't know WHY I blast.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Oh well, I'm gonna give myself a break.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'll try again tomorrow.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
];

ScriptRunner.scripts['robo_spikey'] = [
	{ name: 'show_text', props: { text: "CALCULATING...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "CALCULATING...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "CALCULATING...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "CALCULATIONS COMPLETE.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "TWO PLUS TWO IS FIVE.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "ERROR.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
];

ScriptRunner.scripts['robo_puncher'] = [
	{ name: 'show_text', props: { text: "I could squish your head like a moldy apple.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Ha ha ha just playing with you Frauki. You're cool.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
];

ScriptRunner.scripts['robo_armed'] = [
	{ name: 'show_text', props: { text: "They told me to watch out for a little demon swinging around a green energy sword.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "But I'm starting to think they were just messing with me.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I've been standing around waiting to blast her for months now. Nothing! Ughhhh.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
];

ScriptRunner.scripts['robo_oldie'] = [
	{ name: 'show_text', props: { text: "Whoa whoa whoa, you're coming in pretty hot. Chill...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Just chill out for one second... geez... don't slash me...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Look, this is our secret hangout. You really shouldn't be here. We like to fight and get rowdy in there.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "But you look pretty tough...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'll tell ya what... if you can beat all my Robo bros, I'll give you some of our power", portrait: 'red' } },
	{ name: 'show_text', props: { text: "If not... then bye bye Frauki! Heh heh heh. You're not scared... are you?", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },
];

ScriptRunner.scripts['gnome_garden'] = [
	{ name: 'show_text', props: { text: "These here is my tomaters.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "And before ya ask, NO. Ya can't have none.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "They's all mine so keep yer grabbers off 'em!", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_mushroom'] = [
	{ name: 'show_text', props: { text: "Frauki? Is that really you?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I think I just ate too many of those mushrooms...", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_sleepy'] = [
	{ name: 'show_text', props: { text: "Ahhhh...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Gots my lil' feet kicked up.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Gots the sunshine.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Gots the fresh air.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "It just don't get no better than this.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I'll say it again. No sir it do not.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_love'] = [
	{ name: 'show_text', props: { text: "Mmmmmmm... Esmerelda...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Mmmmmmm...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Schluuuurp...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Muah...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I love you so much...", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_city'] = [
	{ name: 'show_text', props: { text: "Hey, I can see the city over there.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Well that's just swell.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Yep. It's all about the simple things.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_fishing'] = [
	{ name: 'show_text', props: { text: "Boobadee boobadaa, yippity scoop lap, pappy pap pap.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Dedede doo doo doo rap pop pippy.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "HOP TOP RIDDLY SCOP, ZIPPITY BOM BOOP.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Sure do love singing that when I'm fishin'.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_windy'] = [
	{ name: 'show_text', props: { text: "Oh, it's you Frauki.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "No one ever finds me up here.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I think I just like the quiet and solitude.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "But I try not to get addicted to it...", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_cool'] = [
	{ name: 'show_text', props: { text: " Oh wassup Frauki.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Welcome to my secret hangout.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Just remember the password next time to get in.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "It's 'coolio', heh heh.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Keep it crispy out there Frauki.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];
