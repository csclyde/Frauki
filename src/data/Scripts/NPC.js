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
	{ name: 'show_text', props: { text: "A babies tear?", portrait: 'Neutral' } },
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
	{ name: 'show_text', props: { text: "I've been standing around waiting to blast her for months now. Nothing! I feel like such a fool.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Oh don't worry, I'm sure you'll find her soon!", portrait: 'Neutral' } },	
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
	{ name: 'show_text', props: { text: "Fine, I didn't want one anyway.", portrait: 'Displeased' } },	
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_mushroom'] = [
	{ name: 'show_text', props: { text: "Frauki? Is that really you?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I think I ate too many of those mushrooms...", portrait: 'green' } },
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
	{ name: 'show_text', props: { text: "Oh wassup Frauki.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Welcome to my secret hangout.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Just remember the password next time to get in.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "It's 'coolio', heh heh.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Keep it crispy out there Frauki.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_cooking'] = [
	{ name: 'show_text', props: { text: "Oh yeah...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Mmmm! Comon' lil' mama...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "That's right, get nice and crispy...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "MMMMM! This is gonna be good...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Easy now... easy now... let those flames lick ya.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_gossip'] = [
	{ name: 'show_text', props: { text: "Frauki...?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "That you there?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Did I ever tell you about the winter of...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I think it was, say twelve years ago...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "No... hold on...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Thirteen years ago...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Is that right?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Well let's see, little baby Pflugarth is eleven and a half now.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "And he was born about six months before this winter.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "No hold on, Pflugarth is thirteen and three quarters.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "I was getting him mixed up with little Ebeneezer.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "It was EBENEEZER who was born six months prior.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "But how old is Ebeneezer now?", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Well let's see, his mom is fourty-three now, and she was...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Umm, I gotta go Mr. Gnome... I think the Goddess is summoning me...", portrait: 'Displeased' } },
	{ name: 'show_text', props: { text: "Hold on, it wasn't a winter at all... it was a spring...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Bye!", portrait: 'Neutral' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_cowboy'] = [
	{ name: 'show_text', props: { text: "Yeeeeeeeeeeeeeeeeeeee...", portrait: 'green' } },
	{ name: 'show_text', props: { text: "HAWWWWWWWWWW!", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Giddy up ya lil' rascal! GIDDY UP NAH!", portrait: 'green' } },
	{ name: 'show_text', props: { text: "It looks like you're squishing him.", portrait: 'Neutral' } },
	{ name: 'show_text', props: { text: "Ahhh whadda you know anyway. I been bustin broncs since before you was born.", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];

ScriptRunner.scripts['gnome_pickaxe'] = [
	{ name: 'show_text', props: { text: "Here we go, almost there.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Gotta get my hands on those little gemmies.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Can't wait to give them to the Goddess.", portrait: 'green' } },
	{ name: 'show_text', props: { text: "She might even make me her king!", portrait: 'green' } },
	{ name: 'show_text', props: { text: "Yahoo!", portrait: 'green' } },
	{ name: 'run_script', props: { name: 'exit_NPC' } },		
];