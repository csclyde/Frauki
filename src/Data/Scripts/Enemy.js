ScriptRunner.scripts['enter_enemy'] = [
	{ name: 'disallow_input', props: {} },
	{ name: 'pause_all_music', props: {} },

	{ func: function(params) {
		events.publish('play_music', { name: 'Sunshine', fade: 1000 });

		var enemy = objectController.enemyList.find(function(e) {
			return e.name === params.name;
		});

		if(!!enemy && !!enemy.body) {
			events.publish('pan_camera', { to: enemy.body.center, duration: 1000 });
		}
	} },
	
	{ name: 'wait', props: { amount: 1500 } },

	{ func: function(params) {
        	ScriptRunner.run(params.name);
	} },	
];

ScriptRunner.scripts['exit_enemy'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },
	{ name: 'stop_music', props: { name: 'Sunshine', fade: 1000 } },

	{ name: 'wait', props: { amount: 1000 } },

	{ name: 'unpause_all_music', props: {} },	
	{ name: 'allow_input', props: {} },
];

ScriptRunner.scripts['tower_troll'] = [
	{ name: 'show_text', props: { text: 'Hey dork, you ready to get DUNKED ON?', portrait: 'red' } },
	{ name: 'show_text', props: { text: 'Ha ha ha.', portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['tower_ninja'] = [
	{ name: 'show_text', props: { text: 'So, you have come to my dojo...', portrait: 'red' } },
	{ name: 'show_text', props: { text: 'Your slippery little rolls may not serve you so well anymore...', portrait: 'red' } },
	{ name: 'show_text', props: { text: 'Nothing personal... kid...', portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['tower_hawk'] = [
	{ name: 'show_text', props: { text: "Finally, you arrived.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "You think your pathetic little frog-jumps are impressive? Ha!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I rule these skies, Frauki. Let's see how great your little jumps are in my super-gravity chamber.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['apple_drain'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'show_text', props: { text: 'ERROR! WARNING! CONTRABAND DETECTED!', portrait: 'red' } },
	{ name: 'show_text', props: { text: "THIS IS A STRICT NON-APPLE ZONE.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "THEIR SWEET JUICY DELICIOUSNESS IS NOT ALLOWED!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "REMOVING APPLES...", portrait: 'red' } },

	{ func: function() {

		var i = energyController.GetApples();
        while(i--) {
			game.time.events.add(i * 400, function() {
				energyController.remainingApples -= 1;
				effectsController.SpawnAppleCore(frauki.body.center.x, frauki.body.y - 5);				
            });
		}
	} },

	{ name: 'wait', props: { amount: 2000 } },	
	{ name: 'allow_input', props: {} }
];

ScriptRunner.scripts['shield_drain'] = [
	{ name: 'disallow_input', props: {} },
	
	{ name: 'wait', props: { amount: 500 } },
	{ name: 'show_text', props: { text: 'ERROR! WARNING! CONTRABAND DETECTED!', portrait: 'red' } },
	{ name: 'show_text', props: { text: "ILLEGAL DEFENSIVE MEASURES ARE BEING USED.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "UNFAIR CHEATING DEVICES ARE STRICTLY PROHIBITED!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "REMOVING SHIELD...", portrait: 'red' } },

	{ func: function() {
		energyController.shield = 0;
		frauki.states.shieldBlock = true;
	} },

	{ name: 'play_sound', props: { name: 'frauki_stun' } },
	

	{ name: 'wait', props: { amount: 1000 } },	
	{ name: 'allow_input', props: {} }
];
