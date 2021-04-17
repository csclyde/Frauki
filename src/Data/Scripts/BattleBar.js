ScriptRunner.scripts['check_battlebar'] = [
	
	{ func: function(params) {
		if(GameData.HasUpgrade('Damage')) {
			ScriptRunner.run('battlebar_scram');
		} else {
			ScriptRunner.run('enter_battlebar');
		}
	} },
];

ScriptRunner.scripts['battlebar_scram'] = [
	{ name: 'disallow_input', props: {} },
	{ func: function(params) {
		events.publish('pan_camera', { to: objectController.npcMap['robo_bouncer'].body.center, duration: 1000 });
		EnemyBehavior.FacePlayer(objectController.npcMap['robo_bouncer']);		
	} },
	{ name: 'wait', props: { amount: 1000 } },
	
	{ name: 'show_text', props: { text: "Eh? Whadda ya want now, frog-dork.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You already humiliated us. Are you just back to gloat?", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You want more prizes? Well I ain't GOT NONE. So beat it.", portrait: 'red' } },

	{ name: 'open_enemy_door', props: { door: "battle_bar" } },
	
	{ name: 'run_script', props: { name: 'exit_battlebar' } },	
];

ScriptRunner.scripts['enter_battlebar'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Decimation', fade: 1000 } },
	
	{ name: 'wait', props: { amount: 1000 } },

	{ func: function(params) {
		events.publish('pan_camera', { to: objectController.npcMap['robo_bouncer'].body.center, duration: 1000 });
		EnemyBehavior.FacePlayer(objectController.npcMap['robo_bouncer']);
	} },

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'show_text', props: { text: "Alright, this is what I'm talkin' about... some action!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Let's get to the slashin' and smashin'. I love this stuff.", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'GUBr', on_death: "run_script,name:kill_gubr" }},
	{ name: 'wait', props: { amount: 2000 } },

	{ name: 'show_text', props: { text: "First up is our lil' bro GUBr, the Gooberino.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Is he small? Yeah. Is he weak? Yeah. But is he tough as nails? Well, no...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "But once in a while, he'll surprise ya! Watch out.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!", portrait: 'red' } },


	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['exit_battlebar'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1500 } },
	
	{ name: 'allow_input', props: {} },
];

ScriptRunner.scripts['enter_bouncer'] = [
	{ name: 'disallow_input', props: {} },
	{ func: function(params) {
		events.publish('pan_camera', { to: objectController.npcMap['robo_bouncer'].body.center, duration: 1000 });
		EnemyBehavior.FacePlayer(objectController.npcMap['robo_bouncer']);		
	} },
];

ScriptRunner.scripts['kill_gubr'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Huh... ok. Well that was pretty lame.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "On with the show!!", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'KR32', on_death: "run_script,name:kill_kr32" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "Next up is a deadly killer. A viscious assassin. A murder machine.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "He's got a big sword and he's happy to use it. Let's see which of Frauki's limbs he will lop off first.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	
	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_kr32'] = [
	{ name: 'wait', props: { amount: 1000 } },	

	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Ok, now that's what I'm talkin' about!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Spicy spicy action, tsssss. Yummy.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I mean, I think he had a glitch. That's the only way he lost, heh.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Forget him! He stinks! On with the show!", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'H0P8', on_death: "run_script,name:kill_h0p8" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "Ok let's see, this next fella gives me the creeps. He's not much of a conversationalist, but he sure knows how to kill!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "And that's what we're here for, right?", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	
	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_h0p8'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Wow. Alright, wasn't expexting that...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Hmm, this isn't going too well for us.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Good thing our next fighter is an", portrait: 'red' } },
	{ name: 'show_text', props: { text: "UNSTOPPABLE", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FORCE", portrait: 'red' } },
	{ name: 'show_text', props: { text: "OF DESTRUCTION!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Yeah you know who I'm talking about, the big bruiser himself! Bring him on out.", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'A3PZ', on_death: "run_script,name:kill_a3pz" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "Personally, I just stay out of his way. But that's not really an option for the little Frog-dork!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	
	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_a3pz'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Woof! That clumsy oaf!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "What an embarrasing buffoon.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Ugh. Alright. We're gonna need a little finesse. Brute strength won't cut it.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Our next fighter, well, this is just between us, but I'm in love with her.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I wrote her a poem, but I haven't shown her yet.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Bah, it's stupid anyway. Nevermind. Here she comes!", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'HWK9', on_death: "run_script,name:kill_hwk9" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "Isn't she lovely? Such a fine specimen of Alien engineering. Ahh......", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_hwk9'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "My love...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Rent asunder by a careless, silly little Frog-girl...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I must cry but it's not in my programming. My spirit is broken.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Eh, forget her, she stinks. They'll make another one of her later.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "On with the show!", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'SW8T', on_death: "run_script,name:kill_sw8t" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "When all else fails, bring in the big guns.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "This next sucker has been forcibly smothering us Alien Robots with his protection protocol for hundreds of years.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Just do exactly what he says and everything will be fine!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_sw8t'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Alright...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "How...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You weren't supposed to get this far...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "It's really not fair.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You're cheating! It's so obvious. That fight was rigged.", portrait: 'red' } },

	{ name: 'spawn_enemy', props: { name: 'SW8T', on_death: "run_script,name:kill_sw8t2" }},
	{ name: 'wait', props: { amount: 2000 } },	

	{ name: 'show_text', props: { text: "No cheating this time, dweeb. Please just die.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "FIGHT!!", portrait: 'red' } },

	{ name: 'run_script', props: { name: 'exit_battlebar' } },
];

ScriptRunner.scripts['kill_sw8t2'] = [
	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'run_script', props: { name: 'enter_bouncer' } },
	{ name: 'wait', props: { amount: 1500 } },	
	
	{ name: 'show_text', props: { text: "Yep, you're definitely cheating. There is NO other way you could have won there.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Sorry, cheaters don't get any prizes. Good day to you, begone.", portrait: 'red' } },

	{ func: function(params) {
		events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });	
	} },

	{ name: 'wait', props: { amount: 1000 } },	
	

	{ name: 'show_text', props: { text: "No prize?? But I killed them all! You promised! And stop calling me a dork...", portrait: 'Mad' } },
	{ name: 'show_text', props: { text: "Grrr.... You're next.", portrait: 'Mad' } },

	{ func: function(params) {
		events.publish('pan_camera', { to: objectController.npcMap['robo_bouncer'].body.center, duration: 1000 });		
	} },

	{ name: 'wait', props: { amount: 1000 } },	

	{ name: 'show_text', props: { text: "Whoa! Cool it. Don't have a tantrum. Geez. Ok, ok...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You get your prize, ya little cheater.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I hope you feel really great about yourself.", portrait: 'red' } },

	{ name: 'open_enemy_door', props: { door: "battle_bar" } },

	{ func: function(params) {
		events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
		GameData.AddUpgrade('Damage');
		//achievement6
		try { require('electron').ipcRenderer.send('achievement', 'BATTLE_BAR'); } catch(e) { }
		
	} },

	{ name: 'wait', props: { amount: 1000 } },	
	
	{ name: 'stop_music', props: { name: 'Decimation', fade: 1000 } },
	{ name: 'unpause_all_music', props: {} },	
	
	{ name: 'run_script', props: { name: 'demo_Damage' } },
];

ScriptRunner.scripts['start_battle_arena'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Decimation', fade: 1000 } },

	{ func: function(params) {
		energyController.shield = 0;		
		frauki.states.shieldBlock = true;
		energyController.remainingApples = 0;
	} },

	{ name: 'run_script', props: { name: 'battle_arena_fight' } },	
];

var enemyList = [
	'Sporoid',
	'Insectoid',
	'Buzzar',
	'H0P8',
	'GUBr',
	'SW8T',
	'QL0k',
	'KR32',
	'A3PZ',
	'HWK9',
	'RKN1d',
];

ScriptRunner.scripts['battle_arena_fight'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 500 } },

	{ func: function(params) {
		events.publish('display_kill_text', {
			text: Frogland.battleArenaKills + ' KILLS',
		});

		Frogland.battleArenaKills++;

		GameData.RegisterArenaKills(Frogland.battleArenaKills);
	} },

	{ name: 'wait', props: { amount: 1000 } },
	
	{ func: function(params) {
		events.publish('spawn_enemy', {
			name: enemyList[game.rnd.between(0, enemyList.length - 1)],
			x: Frogland.battleArenaSpawn.x,
			y: Frogland.battleArenaSpawn.y,
			on_death: "run_script,name:battle_arena_fight"
		});
	} },

	{ name: 'wait', props: { amount: 500 } },

	{ name: 'allow_input', props: {} },
];