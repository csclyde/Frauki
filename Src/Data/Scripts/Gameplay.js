ScriptRunner.scripts['game_start'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_music', props: { name: 'Intro' } },
    { name: 'play_ambient', props: { name: 'ambient_surface' } },
    { func: function() {
        effectsController.Fade(false, 1000);
    } },
];

ScriptRunner.scripts['continue_game'] = [
    { name: 'stop_music', props: { name: 'Intro', fade: 2000 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },      
    
    { func: function() {
        events.publish('pan_camera', { to: goddess.body.center, duration: 2000 }); 
        game.add.tween(GameState.Menu).to({alpha: 0}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.Reset();
        frauki.state = frauki.PreMaterializing;
        GameState.menuSelectionMade = true;
    } },

    { name: 'wait', props: { amount: 2500 } },
    { name: 'run_script', props: { name: 'enter_goddess' } },
    
    { func: function() {
        GameState.inMenu = false;
        GameState.uiFadeTween = game.add.tween(GameState.UI).to({alpha: 1}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.state = frauki.Materializing;
    } },

    { name: 'wait', props: { amount: 2000 } },
    { name: 'run_script', props: { name: 'goddess_welcome_return' } },
    
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
        events.publish('set_camera', { to: goddess.body.center }); 
        
        GameState.inMenu = false;
        GameState.Menu.alpha = 0;
        effectsController.Fade(false, 500);
    } },

    { name: 'wait', props: { amount: 800 } },
    { name: 'run_script', props: { name: 'enter_goddess' } },
    { name: 'wait', props: { amount: 1500 } },
    { name: 'run_script', props: { name: 'goddess_summon_frauki' } },
    { name: 'wait', props: { amount: 8000 } },
    
    { func: function() {
        frauki.state = frauki.Materializing;
    } },

    { name: 'wait', props: { amount: 3000 } },
    { name: 'run_script', props: { name: 'goddess_intro' } },
    
];

ScriptRunner.scripts['show_settings_menu'] = [

    { name: 'play_sound', props: { name: 'baton_catch' } },
    
    { func: function() {
        GameState.currentMenu = Menus.settings;
        GameState.menuSelection = 0;
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
        GameState.uiFadeTween = game.add.tween(GameState.UI).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);  
            
    } },
];

ScriptRunner.scripts['unpause_game'] = [
    { name: 'stop_music', props: { name: 'Intro', fade: 1000 } },    
    { name: 'unpause_all_music', props: { } },  
    { name: 'play_sound', props: { name: 'baton_catch' } },    
    
    { func: function() {
        events.publish('pan_camera', { to: GameState.prePauseCameraTarget, duration: 1000 });
        game.add.tween(GameState.Menu).to({alpha: 0}, 500, Phaser.Easing.Cubic.Out, true);
        GameState.uiFadeTween = game.add.tween(GameState.UI).to({alpha: 1}, 500, Phaser.Easing.Cubic.In, true); 
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
    } },

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        effectsController.Fade(false, 500);
        events.publish('set_camera', { to: goddess.body.center });         
    } },

    { name: 'wait', props: { amount: 1000 } },

    { name: 'run_script', props: { name: 'enter_goddess' } },
    
    { name: 'wait', props: { amount: 500 } },
    
    { func: function() {
        frauki.state = frauki.Materializing;
    } },
    { name: 'wait', props: { amount: 2000 } },

    { name: 'run_script', props: { name: 'goddess_console' } },
    
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
        GameState.UI.alpha = 1;
        GameState.Reset();
    } },

    { name: 'wait', props: { amount: 400 } },
    
    { func: function() {
        effectsController.Fade(false, 500);
        events.publish('set_camera', { to: goddess.body.center });         
    } },

    { name: 'wait', props: { amount: 1000 } },

    { name: 'run_script', props: { name: 'enter_goddess' } },
    
    { name: 'wait', props: { amount: 500 } },
    
    { func: function() {
        frauki.state = frauki.Materializing;
    } },
    { name: 'wait', props: { amount: 2000 } },

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