ScriptRunner.scripts['game_start'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_music', props: { name: 'Intro' } },
    { name: 'play_ambient', props: { name: 'ambient_surface' } },
    { name: 'update_ui', props: {  } },
    { func: function() {
        effectsController.Fade(false, 1000);
    } },
];

ScriptRunner.scripts['quit_game'] = [
    { func: function() {
        if(!!app) {
            app.exit();
        }
    } },
];

ScriptRunner.scripts['continue_game'] = [
    { name: 'stop_music', props: { name: 'Intro', fade: 2000 } },
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

    // { name: 'wait', props: { amount: 2000 } },
    
    // { name: 'run_script', props: { name: 'enter_goddess' } },

    // { name: 'wait', props: { amount: 1500 } },

    // { name: 'run_script', props: { name: 'goddess_welcome_return' } },

    { name: 'allow_input', props: {} },
    
    
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
    { name: 'stop_music', props: { name: 'Intro', fade: 3500 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },
    
    { func: function() {
        GameData.ResetData();
        GameState.Reset();
        effectsController.Fade(true, 3000);  
        GameState.menuSelectionMade = true;  
    } },

    { name: 'wait', props: { amount: 4000 } },
    
    { func: function() {
        GameData.SaveDataToStorage();        
        events.publish('set_camera', { to: goddess.body.center }); 
        GameState.inMenu = false;
        GameState.Menu.alpha = 0;
        effectsController.Fade(false, 2000);
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
    { name: 'pause_all_music', props: { fade: 250 } },
    { name: 'pause_all_sound', props: { } },
    { name: 'play_music', props: { name: 'Intro', fade: 2000 } },    
    
    { func: function() {
        GameState.pauseTween = game.add.tween(GameState).to( {physicsSlowMo: 0}, 250, Phaser.Easing.Quartic.Out, true);
        GameState.currentMenu = Menus.pause;
        GameState.menuSelection = 0;
        GameState.inMenu = true;
        GameState.menuSelectionMade = false;
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
];

ScriptRunner.scripts['unpause_game'] = [
    { name: 'stop_music', props: { name: 'Intro', fade: 1000 } },    
    { name: 'unpause_all_music', props: { } },  
    { name: 'play_sound', props: { name: 'baton_catch' } },    
    
    { func: function() {
        events.publish('pan_camera', { to: GameState.prePauseCameraTarget, duration: 1000 });
        game.add.tween(GameState.Menu).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);
        GameState.uiFadeTween = game.add.tween(GameState.HUD).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true); 
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function() {
        GameState.paused = false;
        GameState.pauseTween = game.add.tween(GameState).to( {physicsSlowMo: 1}, 250, Phaser.Easing.Quartic.In, true);
        GameState.inMenu = false;        
    } },

    { name: 'unpause_all_sound', props: { } },        
    { name: 'allow_input', props: {} },    
];

ScriptRunner.scripts['game_over'] = [
    { name: 'disallow_input', props: {} },
    { name: 'stop_all_music', props: { fade: 500 } },
    { name: 'stop_all_ambient', props: {} },
    { name: 'hide_speech', props: {} },
    
    { func: function() {
        GameState.BeginGameover();
        effectsController.Fade(true, 4000);
    } },

    { name: 'wait', props: { amount: 800 } },
    
    { name: 'play_music', props: { name: 'Gameover' } },
    
    { name: 'wait', props: { amount: 4000 } },
    
    { func: function() {
        GameState.Reset();
        events.publish('set_camera', { to: frauki.body.center });        
    } },

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        effectsController.Fade(false, 500);
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
    { name: 'stop_all_music', props: { fade: 1000 } },
    { name: 'stop_all_ambient', props: {} },
    { name: 'hide_speech', props: {} },
    { name: 'play_sound', props: { name: 'baton_catch' } },    
    
    { func: function() {
        GameState.paused = false;
        GameState.inMenu = false;
        GameState.physicsSloMo = 1;

        GameState.BeginGameover();
        effectsController.Fade(true, 1000);
    } },

    { name: 'wait', props: { amount: 1000 } },

    { func: function() {
        GameState.Menu.alpha = 0;
        GameState.HUD.alpha = 1;
        GameState.Reset();
    } },

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        effectsController.Fade(false, 500);
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
            events.publish('pause_all_music', {});
            events.publish('play_music', { name: params.song, fade: 1000});
        }
        events.publish('close_enemy_door', { door: params.door });
    } },
    { name: 'wait', props: { amount: 1000 } },
    { name: 'allow_input', props: {} },
];

ScriptRunner.scripts['end_fight'] = [
    { func: function(params) {
        if(params.song) {
            events.publish('stop_music', { name: params.song, fade: 1000});
        }
    } },
    { name: 'wait', props: { amount: 1000 } },

    { func: function(params) {
        if(params.song) {
            events.publish('unpause_all_music', { fade: 1000});
        }
    } },
];

ScriptRunner.scripts['use_checkpoint'] = [
    { name: 'disallow_input', props: {} },
    
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

    { name: 'allow_input', props: {} },

    { func: function(params) {
        if(!GameData.GetFlag('used_checkpoint')) {
            ScriptRunner.run('demo_Checkpoint2');
            GameData.SetFlag('used_checkpoint', true);
        }
    } },
];

ScriptRunner.scripts['destroy_gemsucker'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_sound', props: { name: 'robosplosion'} },
    { name: 'wait', props: { amount: 950 } },
    
    { func: function(params) {
        var shard = objectController.prisms[params.prism.prism];
        shard.visible = true;
        console.log(shard)
        shard.x = params.prism.x - 15;
        shard.y = params.prism.y - 50;
        shard.FlyAway();
        shard.bringToTop();
        params.prism.BlowUp();
    } },

    { name: 'pause_all_music', props: {} },
    { name: 'wait', props: { amount: 500 } },
    
    { func: function(params) {
        var shard = objectController.prisms[params.prism.prism];
        shard.body.velocity.setTo(0);
        game.add.tween(shard).to({x: frauki.body.center.x, y: frauki.body.center.y}, 4000, Phaser.Easing.Exponential.In, true);
    } },
    { name: 'play_music', props: { name: 'FanfareLong' } },

    { name: 'wait', props: { amount: 4000 } }, 

    { name: 'screen_flash', props: {} },    
    { func: function(params) {
        GameData.AddShard(params.prism.prism); 
        objectController.prisms[params.prism.prism].visible = false;
        effectsController.StarBurst(frauki.body.center);
        effectsController.SparkSplash(frauki);
    } },

    { name: 'update_ui', props: { } },
    { name: 'wait', props: { amount: 1000 } },
    
    { func: function(params) {
        ScriptRunner.run('demo_' + params.prism.prism);
    } },

   // { name: 'allow_input', props: {} },
];

ScriptRunner.scripts['finish_game'] = [
    { name: 'disallow_input', props: {} },
    { name: 'pause_all_music', props: {} },
	{ name: 'play_music', props: { name: 'Goddess', fade: 1000 } },
    { name: 'wait', props: { amount: 1500 } },
    
    { func: function(params) {
        var wit = objectController.prisms.Wit;
        GameState.inFinale = true;

        wit.visible = true;
        wit.x = frauki.body.center.x;
        wit.y = frauki.body.center.y;
        wit.bringToTop();
        //4456, 2656
        game.add.tween(wit).to({x: 4456, y: 2656}, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var will = objectController.prisms.Will;

        will.visible = true;
        will.x = frauki.body.center.x;
        will.y = frauki.body.center.y;
        will.bringToTop();
        //4456, 2656
        game.add.tween(will).to({x: 4488, y: 2656}, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var power = objectController.prisms.Power;

        power.visible = true;
        power.x = frauki.body.center.x;
        power.y = frauki.body.center.y;
        power.bringToTop();
        //4456, 2656
        game.add.tween(power).to({x: 4472, y: 2640}, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 1500 } },

    { func: function(params) {
        var luck = objectController.prisms.Luck;

        luck.visible = true;
        luck.x = frauki.body.center.x;
        luck.y = frauki.body.center.y;
        luck.bringToTop();
        //4456, 2656
        game.add.tween(luck).to({x: 4472, y: 2673}, 4000, Phaser.Easing.Quartic.InOut, true);

        game.time.events.add(4000, function() {
            events.publish('play_sound', { name: 'crystal_door', restart: true });
            effectsController.ScreenFlash();
        });
    } },

    { name: 'wait', props: { amount: 4500 } },

    { func: function() {
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

    { name: 'wait', props: { amount: 1000 } },
    { name: 'destroy_enemy', props: { name: 'tower_hopper' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_hawk' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_spider1' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_spider2' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_spider3' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_goob1' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 500 } },
    { name: 'destroy_enemy', props: { name: 'tower_goob2' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 1500 } },
    { name: 'destroy_enemy', props: { name: 'tower_swat' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },
    
    { name: 'wait', props: { amount: 5000 } },
    
    { name: 'show_text', props: { text: "My people...", portrait: 'OldRobo' } },
    { name: 'show_text', props: { text: "Our way of life... Extinguished...", portrait: 'OldRobo' } },
    { name: 'show_text', props: { text: "Gone forever, like a blip of light from a dying star.", portrait: 'OldRobo' } },
    { name: 'show_text', props: { text: "Now we fade back into non-existence, as though we were never here.", portrait: 'OldRobo' } },
    { name: 'show_text', props: { text: "Let my final words of wisdom be somehow etched into the universe...", portrait: 'OldRobo' } },
    { name: 'show_text', props: { text: "The only lasting--", portrait: 'OldRobo' } },

    { name: 'destroy_enemy', props: { name: 'tower_leader' } },
    { name: 'play_sound', props: { name: 'explosion', restart: true } },    
    { name: 'wait', props: { amount: 1500 } },
    
    { func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 3000 });
    } },

    { name: 'wait', props: { amount: 3500 } },
    { name: 'show_text', props: { text: "Now that takes care of those nasty little pests.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "I think we really taught them a lesson.", portrait: 'Goddess_Neutral' } },
    { name: 'show_text', props: { text: "Well done Frauki, Frogland is saved!", portrait: 'Goddess_Neutral' } },

	{ name: 'stop_music', props: { name: 'Goddess', fade: 4000 } },
    { func: function() {
        objectController.DestroyAllEnemies();
        effectsController.Fade(true, 4000);
        GameState.creditsText = game.add.bitmapText(320, 180, 'bubble','', 18);
        GameState.creditsText.anchor.setTo(0.5);
        GameState.creditsText.fixedToCamera = true;
        
    } },

    { name: 'wait', props: { amount: 4000 } },
    { name: 'play_music', props: { name: 'Denoument', fade: 1000 } },

    { name: 'run_script', props: { name: 'show_random_scene' }}
    
];

ScriptRunner.scripts['show_random_scene'] = [
    
    { func: function(params) {
        var newTarget = {
            x: game.rnd.between(100, 300) * 16,
            y: game.rnd.between(175, 575) * 16
        };

        GameState.creditsText.x = 100;
        GameState.creditsText.y = 100;
        GameState.creditsText.setText(Credits.shift());

        events.publish('set_camera', { to: newTarget });
    } },

    { func: function() {
        effectsController.Fade(false, 3000);
    } },

    { name: 'wait', props: { amount: 8000 } },

    { func: function() {
        effectsController.Fade(true, 3000);
    } },

    { name: 'wait', props: { amount: 3000 } },

    { name: 'run_script', props: { name: 'show_random_scene' }}
    
];
