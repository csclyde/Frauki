ScriptRunner.scripts['game_start'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_music', props: { name: 'Intro' } },
    { name: 'play_ambient', props: { name: 'ambient_surface' } },
    { name: 'update_ui', props: {  } },
    { func: function() {
        GameState.Fade(false, 1000);
    } },
];

ScriptRunner.scripts['quit_game'] = [
    { func: function() {
        //console.log(require('electron'));
        try {
            if(!!require) require('electron').ipcRenderer.send('close-app');
        } catch(e) {

        }
        //console.log(electron);
        // if(!!app) {
        //     app.exit();
        // }
    } },
];

ScriptRunner.scripts['continue_game'] = [
    { name: 'stop_music', props: { fade: 2000 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },  
    
    { func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 2000 }); 
        game.add.tween(GameState.Menu).to({alpha: 0}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.Reset();
        frauki.state = frauki.PreMaterializing;
        GameState.menuSelectionMade = true;
    } },

    { name: 'wait', props: { amount: 2500 } },
    
    { func: function() {
        GameState.inMenu = false;
        GameState.uiFadeTween = game.add.tween(GameState.HUD).to({alpha: 1}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.state = frauki.Materializing;
    } },

    { name: 'wait', props: { amount: 2000 } },
    
    { name: 'run_script', props: { name: 'enter_goddess' } },

    { name: 'wait', props: { amount: 1500 } },

    { name: 'run_script', props: { name: 'goddess_welcome_return' } },
];

ScriptRunner.scripts['select_new_game'] = [
    { func: function() {
        if(GameData.SaveDataExists()) {
            GameState.currentMenu = Menus.confirm;
            GameState.menuSelection = 0;
        } else {
            ScriptRunner.run('new_game');
        }       
    } },

    { name: 'update_ui', props: { } },
];

ScriptRunner.scripts['exit_confirmation'] = [
    { func: function() {
        GameState.currentMenu = Menus.main;
        GameState.menuSelection = 0; 
    } },

    { name: 'update_ui', props: { } },
];

ScriptRunner.scripts['new_game'] = [
    { name: 'stop_music', props: { fade: 3500 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },
    
    { func: function() {
        GameData.ResetData();
        GameState.Reset();
        GameState.Fade(true, 3000);  
        GameState.menuSelectionMade = true;  
    } },

    { name: 'wait', props: { amount: 4000 } },
    
    { func: function() {
        GameData.SaveDataToStorage();
        events.publish('set_camera', { to: goddess.body.center }); 
        GameState.inMenu = false;
        GameState.Menu.alpha = 0;
        GameState.Fade(false, 2000);
    } },

    { name: 'run_script', props: { name: 'enter_goddess' } },
    { name: 'wait', props: { amount: 4000 } },
    { name: 'show_text', props: { text: "Frauki... I need your help. Come along now. It's time to get to work...", portrait: 'Goddess_Neutral' } },

    { func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
    } },

    { name: 'wait', props: { amount: 3000 } },
    
    { func: function() {
        frauki.state = frauki.Materializing;
        GameState.HUDFadeTween = game.add.tween(GameState.HUD).to({alpha: 1}, 1500, Phaser.Easing.Cubic.Out, true);
    } },

    { name: 'wait', props: { amount: 3000 } },

    { func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
    } },


    { name: 'wait', props: { amount: 3000 } },
    { name: 'run_script', props: { name: 'goddess_intro' } },
    
];

ScriptRunner.scripts['show_settings_menu'] = [

    { name: 'play_sound', props: { name: 'baton_catch' } },
    
    { func: function() {
        GameState.currentMenu = Menus.settings;
        GameState.menuSelection = 0;
        GameState.settingsMenu.visible = true;
        //game.state.start('SettingsState', false, false);

    } },

    { name: 'update_ui', props: { } },
];

ScriptRunner.scripts['exit_settings_menu'] = [
    { name: 'play_sound', props: { name: 'baton_catch' } },
    
    { func: function() {
        if(GameState.paused) {
            GameState.currentMenu = Menus.pause;
            GameState.menuSelection = 2;
        } else {
            GameState.currentMenu = Menus.main;
            GameState.menuSelection = 2;
        }

        GameState.settingsMenu.visible = false;
    } },

    { name: 'update_ui', props: { } },
];

ScriptRunner.scripts['pause_game'] = [
    { name: 'disallow_input', props: {} },
    { name: 'pause_all_sound', props: { } },
    { name: 'play_interlude', props: { name: 'Intro', fade: 2000 } },
    
    { func: function() {
        GameState.pauseTween = game.add.tween(GameState).to( {physicsSlowMo: 0}, 250, Phaser.Easing.Quartic.Out, true);
        GameState.currentMenu = Menus.pause;
        GameState.menuSelection = 0;
        GameState.inMenu = true;
        GameState.menuSelectionMade = true;
    } },

    { name: 'update_ui', props: {  } },
    { name: 'wait', props: { amount: 250 } },

    { func: function() {
        GameState.paused = true;
        GameState.prePauseCameraTarget = cameraController.target;
        events.publish('pan_camera', { to: cameraController.menuTarget, duration: 500 });

        game.add.tween(GameState.Menu).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true);
        GameState.HUDFadeTween = game.add.tween(GameState.HUD).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);
    } },

    { name: 'wait', props: { amount: 750 } },

    { func: function() {
        GameState.menuSelectionMade = false;
    } },
    
];

ScriptRunner.scripts['unpause_game'] = [
    { name: 'stop_interlude', props: { fade: 1000 } },  
    { name: 'play_sound', props: { name: 'baton_catch' } },
    
    { func: function() {
        GameState.inMenu = false;        
        events.publish('pan_camera', { to: GameState.prePauseCameraTarget, duration: 1000 });
        game.add.tween(GameState.Menu).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);
        GameState.uiFadeTween = game.add.tween(GameState.HUD).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true); 
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function() {
        GameState.paused = false;
        GameState.pauseTween = game.add.tween(GameState).to( {physicsSlowMo: 1}, 250, Phaser.Easing.Quartic.In, true);
    } },

    { name: 'unpause_all_sound', props: { } },
    { name: 'allow_input', props: {} },
];

ScriptRunner.scripts['game_over'] = [
    { name: 'disallow_input', props: {} },
    { name: 'stop_interlude', props: { fade: 500 } },
    { name: 'stop_music', props: { fade: 500 } },
    { name: 'stop_all_music', props: { fade: 500 } },
    { name: 'stop_all_ambient', props: {} },
    { name: 'hide_speech', props: {} },
    
    { func: function() {
        GameState.BeginGameover();
        GameState.Fade(true, 4000);
    } },

    { name: 'wait', props: { amount: 800 } },
    
    { name: 'play_music', props: { name: 'Gameover' } },
    
    { name: 'wait', props: { amount: 4000 } },
    
    { func: function() {
        if(GameData.HasShard('Wit') && GameData.HasShard('Will') && GameData.HasShard('Luck') && GameData.HasShard('Power')) {
            GameState.inFinale = true;
        }

        GameState.Reset();
        events.publish('set_camera', { to: frauki.body.center });
        GameData.AddDeath();
    } },

    { name: 'stop_all_sound', props: {} },    

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        GameState.Fade(false, 500);
    } },

    { name: 'wait', props: { amount: 500 } },

    { func: function() {
        GameState.restarting = false;
        frauki.state = frauki.Materializing;
    } },

    { name: 'wait', props: { amount: 1000 } },

    { name: 'run_script', props: { name: 'enter_goddess' } },
    
    { name: 'wait', props: { amount: 1000 } },

    { name: 'run_script', props: { name: 'goddess_gameover' } },
    
];

ScriptRunner.scripts['restart_game'] = [
    { name: 'disallow_input', props: {} },
    { name: 'stop_music', props: { fade: 1000 } },
    { name: 'stop_all_ambient', props: {} },
    { name: 'hide_speech', props: {} },
    { name: 'play_sound', props: { name: 'baton_catch' } },
    
    { func: function() {
        GameState.paused = false;
        GameState.inMenu = false;
        GameState.physicsSlowMo = 1;

        GameState.BeginGameover();
        GameState.Fade(true, 1000);
    } },

    { name: 'wait', props: { amount: 1000 } },

    { func: function() {
        GameState.Menu.alpha = 0;
        GameState.HUD.alpha = 1;
        GameState.Reset();
    } },

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        GameState.Fade(false, 500);
        events.publish('set_camera', { to: frauki.body.center });  
        frauki.state = frauki.Materializing;
        GameState.restarting = false;      
    } },

    { name: 'wait', props: { amount: 2000 } },

    { name: 'run_script', props: { name: 'enter_goddess' } },
    
    { name: 'wait', props: { amount: 1500 } },

    { name: 'run_script', props: { name: 'goddess_oh_hey' } },
    
];

ScriptRunner.scripts['start_fight'] = [
    { name: 'disallow_input', props: {} },
    { name: 'set_attack_wait', props: { duration: 1000 } },
    { func: function(params) {
        if(params.song) {
            events.publish('play_interlude', { name: params.song, fade: 1000});
        }
        events.publish('close_enemy_door', { door: params.door });
    } },
    { name: 'wait', props: { amount: 1000 } },
    { name: 'allow_input', props: {} },

    { func: function(params) {
        if(params.script) {
            ScriptRunner.run(params.script, params);
        }
    }}
];

ScriptRunner.scripts['end_fight'] = [
    { name: 'wait', props: { amount: 1000 } },

    { func: function(params) {
        events.publish('stop_interlude', { fade: 1000});
    } },
];

ScriptRunner.scripts['play_fanfare'] = [
    { name: 'play_interlude', props: { name: 'FanfareShort', fade: null } },
    { name: 'wait', props: { amount: 2500 } },  
    { name: 'stop_interlude', props: { fade: 500 } },
];

ScriptRunner.scripts['use_checkpoint'] = [
    { name: 'disallow_input', props: {} },
    { name: 'stop_music', props: { fade: 1000 }},
    
    
    { func: function(params) {
        effectsController.StarBurst(frauki);
        effectsController.SparkSplash(frauki);
        frauki.ChangeState(frauki.Teleporting);
        game.add.tween(frauki).to({x: params.dest.x, y: params.dest.y + 60}, 2000, Phaser.Easing.Exponential.InOut, true);
    } },

    { name: 'play_sound', props: {name: 'frauki_materialize_end'}},
    { name: 'play_sound', props: {name: 'frauki_materialize'}},
    

    { name: 'wait', props: { amount: 2000 } },

    { func: function(params) {
        frauki.ChangeState(frauki.Standing);
        effectsController.StarBurst(frauki);
        effectsController.SparkSplash(frauki);
    } },

    { name: 'stop_sound', props: {name: 'frauki_materialize'}},
    { name: 'play_sound', props: {name: 'frauki_materialize_end'}},
    { name: 'stop_all_ambient', props: {name: 'frauki_materialize_end'}},

    { name: 'allow_input', props: {} },

    { func: function(params) {
        if(!GameData.GetFlag('used_checkpoint')) {
            ScriptRunner.run('demo_Checkpoint2');
            GameData.SetFlag('used_checkpoint', true);
        }

        if(params.dest.id === '0') {
            events.publish('play_ambient', { name: 'ambient_surface'} );
        } else if(params.dest.id === '1') {
            events.publish('play_ambient', { name: 'ambient_tenements'} );
        } else if(params.dest.id === '2') {
            events.publish('play_ambient', { name: 'ambient_cave'} );
        }
    } },
];

ScriptRunner.scripts['destroy_gemsucker'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_sound', props: { name: 'robosplosion'} },
    { name: 'wait', props: { amount: 950 } },
    
    { func: function(params) {
        var shard = effectsController.shardList[params.prism.prism];
        shard.visible = true;
        shard.x = params.prism.x - 15;
        shard.y = params.prism.y - 50;
        params.prism.BlowUp();
    } },

    { name: 'stop_music', props: { fade: 500 } },
    { name: 'wait', props: { amount: 500 } },
    
    { func: function(params) {
        var shard = effectsController.shardList[params.prism.prism];
        game.add.tween(shard).to({x: frauki.body.center.x, y: frauki.body.center.y}, 4000, Phaser.Easing.Exponential.In, true);
    } },
    { name: 'play_music', props: { name: 'FanfareLong' } },

    { name: 'wait', props: { amount: 4000 } }, 

    { name: 'screen_flash', props: {} },
    { func: function(params) {
        GameData.AddShard(params.prism.prism); 
        effectsController.shardList[params.prism.prism].visible = false;
        effectsController.StarBurst(frauki.body.center);
        effectsController.SparkSplash(frauki);
    } },

    { name: 'update_ui', props: { } },
    { name: 'wait', props: { amount: 1000 } },

    { name: 'stop_music', props: { } },
    
    { func: function(params) {
        ScriptRunner.run('demo_' + params.prism.prism);
    } },

   // { name: 'allow_input', props: {} },
];

ScriptRunner.scripts['finish_game'] = [
    { name: 'disallow_input', props: {} },
	{ name: 'play_music', props: { name: 'Goddess', fade: 1000 } },
    { name: 'wait', props: { amount: 1500 } },
    
    { func: function(params) {
        var wit = effectsController.shardList.Wit;
        GameState.inFinale = true;

        wit.visible = true;
        wit.x = frauki.body.center.x;
        wit.y = frauki.body.center.y;
        //4456, 2656
        game.add.tween(wit).to(Frogland.prismPositions.Wit, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var will = effectsController.shardList.Will;

        will.visible = true;
        will.x = frauki.body.center.x;
        will.y = frauki.body.center.y;
        //4456, 2656
        game.add.tween(will).to(Frogland.prismPositions.Will, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var power = effectsController.shardList.Power;

        power.visible = true;
        power.x = frauki.body.center.x;
        power.y = frauki.body.center.y;
        //4456, 2656
        game.add.tween(power).to(Frogland.prismPositions.Power, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var luck = effectsController.shardList.Luck;

        luck.visible = true;
        luck.x = frauki.body.center.x;
        luck.y = frauki.body.center.y;
        //4456, 2656
        game.add.tween(luck).to(Frogland.prismPositions.Luck, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 4500 } },

    { func: function() {
        objectController.Reset();
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
        GameState.HUDFadeTween = game.add.tween(GameState.HUD).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);
    } },
    
    { name: 'wait', props: { amount: 1500 } },
    
    
    { name: 'show_text', props: { text: "Well, there they are Frauki. All of my beautiful Prism Shards all back safely in their home.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "Just look at them glimmering happily.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "My they're pretty little things...", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "Don't you agree Frauki?", portrait: 'Goddess_Neutral' } },

    { func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 1000 });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { name: 'show_text', props: { text: "Uh, sure!", portrait: 'Neutral' } },
    
    { func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 1000 });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { name: 'show_text', props: { text: "Now that they are returned, I have my powers back.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "And with those powers, I will obliterate utterly the Alien Robots, with extreme prejudice and wrath.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "Watch carefully Frauki, as I unleash an unholy wave of destruction and terror.", portrait: 'Goddess_Neutral' } },

    { func: function() {
        events.publish('pan_camera', { to: cameraController.shipBaseTarget, duration: 4000 });
    } },

    { name: 'wait', props: { amount: 5000 } },
    
    
    { func: function() {
        events.publish('pan_camera', { to: cameraController.shipTopTarget, duration: 20000 });
    } },

    { name: 'wait', props: { amount: 4000 } },
    { name: 'destroy_enemy', props: { name: 'tower_troll' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 1500 } },
    { name: 'destroy_enemy', props: { name: 'tower_ninja' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 200 } },
    { name: 'destroy_enemy', props: { name: 'tower_qlok1' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_qlok2' } },
    { name: 'destroy_enemy', props: { name: 'tower_qlok3' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 100 } },    
    { name: 'destroy_enemy', props: { name: 'tower_hopper' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 100 } },
    { name: 'destroy_enemy', props: { name: 'tower_spider1' } },
    { name: 'destroy_enemy', props: { name: 'tower_spider2' } },
    { name: 'destroy_enemy', props: { name: 'tower_spider3' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 1500 } },
    { name: 'destroy_enemy', props: { name: 'tower_hawk' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 200 } },
    { name: 'destroy_enemy', props: { name: 'tower_goob1' } },
    { name: 'wait', props: { amount: 100 } },
    { name: 'destroy_enemy', props: { name: 'tower_goob2' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 1000 } },
    { name: 'destroy_enemy', props: { name: 'tower_azp3' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 100 } },
    { name: 'destroy_enemy', props: { name: 'tower_spider4' } },
    { name: 'destroy_enemy', props: { name: 'tower_spider5' } },
    { name: 'destroy_enemy', props: { name: 'tower_spider6' } },    
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'fan_kr32' } },
    { name: 'destroy_enemy', props: { name: 'fan_qlok' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'protector_sw8t' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 100 } },
    { name: 'destroy_enemy', props: { name: 'lil_buddy1' } },
    { name: 'destroy_enemy', props: { name: 'lil_buddy2' } },
    { name: 'destroy_enemy', props: { name: 'power_gubr' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 1500 } },
    { name: 'destroy_enemy', props: { name: 'tower_swat1' } },
    { name: 'destroy_enemy', props: { name: 'tower_swat2' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    { name: 'wait', props: { amount: 1000 } },
    { name: 'destroy_enemy', props: { name: 'robo_chonker' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },

    
    { name: 'wait', props: { amount: 5000 } },
    
    { name: 'show_text', props: { text: "My people...", portrait: 'red' } },
    { name: 'show_text', props: { text: "Our way of life... Extinguished...", portrait: 'red' } },
    { name: 'show_text', props: { text: "Gone forever, like a blip of light from a dying star.", portrait: 'red' } },
    { name: 'show_text', props: { text: "Now we fade back into non-existence, as though we were never here.", portrait: 'red' } },
    { name: 'show_text', props: { text: "Let my final words of wisdom be somehow etched into the universe...", portrait: 'red' } },
    { name: 'show_text', props: { text: "The only lasting--", portrait: 'red' } },

    { name: 'destroy_enemy', props: { name: 'robo_oldie' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    { name: 'wait', props: { amount: 1500 } },
    
    { func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 3000 });
    } },

    { name: 'wait', props: { amount: 3500 } },
    { name: 'show_text', props: { text: "Now that takes care of those nasty little pests.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "I think we really taught them a lesson.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "Well done Frauki, Frogland is saved!", portrait: 'Goddess_Neutral' } },

    { name: 'wait', props: { amount: 3000 } },
    
	{ name: 'stop_music', props: { fade: 4000 } },
    { func: function() {
        GameState.Fade(true, 4000);
    } },

    { name: 'wait', props: { amount: 4000 } },

    { func: function() {
        objectController.DestroyAllEnemies();        
        frauki.visible = false;
        goddess.visible = false;
        GameData.SetFlag('GAME_COMPLETE', true);
        GameState.inCredits = true;
        //achievement5
        try { if(!!require) require('electron').ipcRenderer.send('achievement', 'FINISH_GAME'); } catch(e) { }
        
    } },

    { name: 'play_music', props: { name: 'Denoument', fade: 1000 } },

    { name: 'run_script', props: { name: 'show_random_scene' }}
    
];

ScriptRunner.scripts['show_random_scene'] = [
    
    { func: function(params) {
        var newTarget = {
            x: game.rnd.between(100, 300) * 16,
            y: game.rnd.between(175, 575) * 16
        };

        // GameState.creditsText.x = 100;
        // GameState.creditsText.y = 100;
        GameState.creditsText.setText(Credits.shift() || '');

        events.publish('set_camera', { to: newTarget });
    } },

    { func: function() {
        GameState.Fade(false, 3000);
    } },

    { name: 'wait', props: { amount: 8000 } },

    { func: function() {
        GameState.Fade(true, 3000);
    } },

    { name: 'wait', props: { amount: 3000 } },

    { name: 'run_script', props: { name: 'show_random_scene' }}
    
];
