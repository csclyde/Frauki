ScriptRunner.scripts['enter_enemy'] = [
	{ name: 'disallow_input', props: {} },

	{ func: function(params) {
		//events.publish('play_interlude', { name: 'Sunshine', fade: 1000 });

		var enemy = objectController.enemyList.find(function(e) {
			return e.name === params.name;
		});

		if(!!enemy && !!enemy.body) {
			EnemyBehavior.FacePlayer(enemy);
			events.publish('pan_camera', { to: enemy.body.center, duration: 1000 });
		} else {
			params.name = null;
		}
	} },
	
	{ name: 'wait', props: { amount: 1500 } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) {
			return e.name === params.name;
		});

		if(!!enemy && !!enemy.body) {
			ScriptRunner.run(params.name);
		} else {
			ScriptRunner.run('exit_enemy');
		}
	} },	
];

ScriptRunner.scripts['exit_enemy'] = [
	{ func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
	} },

	{ name: 'wait', props: { amount: 1000 } },

	//{ name: 'stop_interlude', props: { fade: 500 } },	
	{ name: 'allow_input', props: {} },
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

ScriptRunner.scripts['tower_troll'] = [
	{ name: 'show_text', props: { text: 'Hey, dork, you ready to get DUNKED ON? Ha ha ha.', portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['tower_ninja'] = [
	{ name: 'play_music', props: { name: 'Decimation' } },
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

ScriptRunner.scripts['fan_kr32'] = [
	{ name: 'show_text', props: { text: "Ha! So far you have merely been lucky.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "That ends now. With this gravity fan, you won't even be able to touch me.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Pathetic fool!", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['protector_sw8t'] = [
	{ name: 'show_text', props: { text: "I'm sick of you picking on my little buddies.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Let's see how tough you are with me protecting them!", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['power_gubr'] = [
	{ name: 'show_text', props: { text: "I'm your worst nightmare.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'm the chill running down your spine.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'm the shiver you feel in the dark.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "I'm the noise you hear at night.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Prepare yourself. Death comes swiftly..", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['tower_swat1'] = [
	{ name: 'show_text', props: { text: "We're the buster brothers!", portrait: 'red' } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'tower_swat2'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
		EnemyBehavior.FacePlayer(enemy);
		
	} },
	{ name: 'wait', props: { amount: 500 } },

	{ name: 'show_text', props: { text: "Yeah!", portrait: 'red' } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'tower_swat1'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
	} },
	{ name: 'wait', props: { amount: 500 } },

	{ name: 'show_text', props: { text: "And we're gonna bust you up!", portrait: 'red' } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'tower_swat2'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
	} },
	{ name: 'wait', props: { amount: 500 } },

	{ name: 'show_text', props: { text: "That's right!", portrait: 'red' } },
	
	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'tower_swat1'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
	} },
	{ name: 'wait', props: { amount: 500 } },
	
	{ name: 'show_text', props: { text: "So get ready for a serious bustin'!", portrait: 'red' } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'tower_swat2'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
	} },
	{ name: 'wait', props: { amount: 500 } },

	{ name: 'show_text', props: { text: "Yeah, get ready! Hu hu hu...", portrait: 'red' } },

	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_gubr'] = [
	{ name: 'show_text', props: { text: "Hey, FRAUK... come close, I got a little surprise for ya...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Heh heh heh...", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_kr32'] = [
	{ name: 'show_text', props: { text: "Finally... A worthy challenger...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "It will be an honor to end your life.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "We begin!", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['wit_guard1'] = [
	{ name: 'show_text', props: { text: "You have traveled far to face me, Frauki.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Sad. It's all for nothing. Your little adventure ends now!", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_hwk9'] = [
	{ name: 'show_text', props: { text: "Huh? Ba ha ha ha ha ha...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "That's it??", portrait: 'red' } },
	{ name: 'show_text', props: { text: "From the stories, I was expecting so much more! What a dweeb!", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Well, this shouldn't take long.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_h0p8'] = [
	{ name: 'show_text', props: { text: "ENEMY DETECTED...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "KILL... KILL... KILL...", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['double_hopper'] = [
	{ name: 'show_text', props: { text: "ERROR... ENEMY NOT KILLED...", portrait: 'red' } },
	{ name: 'show_text', props: { text: "ENACTING DOUBLE REAPER PROTOCOL...", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_sw8t'] = [
	{ name: 'show_text', props: { text: "Halt! You are in violation of Policy Zeta-Rho, Section Two.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "No unlawful frog-hopping, rolling, or apple-eating.", portrait: 'red' } },
	{ name: 'show_text', props: { text: "Prepare for corrective measures.", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['angry_hawk'] = [
	{ name: 'show_text', props: { text: "Grrrraaahhhhh! It's time we stop this little punk. You restrain her and I'll dice her to pieces.", portrait: 'red' } },

	{ func: function(params) {
		var enemy = objectController.enemyList.find(function(e) { return e.name === 'angry_swat'; });
		if(!!enemy && !!enemy.body) { events.publish('pan_camera', { to: enemy.body.center, duration: 500 }); }
		EnemyBehavior.FacePlayer(enemy);
		
	} },
	{ name: 'wait', props: { amount: 500 } },

	{ name: 'show_text', props: { text: "Positive confirmation on that. Neutralizing target...", portrait: 'red' } },

	{ name: 'run_script', props: { name: 'exit_enemy' } },
];

ScriptRunner.scripts['first_AZP3'] = [
	{ name: 'show_text', props: { text: "Hu hu hu... no yappin. Just bashin!", portrait: 'red' } },
	{ name: 'run_script', props: { name: 'exit_enemy' } },
];