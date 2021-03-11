ScriptRunner.scripts['game_start'] = [
    { name: 'disallow_input', props: {} },
    { name: 'play_music', props: { name: 'Intro' } },
    { name: 'play_ambient', props: { name: 'ambient_surface' } },
    { func: function() {
        effectsController.Fade(false, 1000);
        effectsController.screenDark.bringToTop();
    } },
];

ScriptRunner.scripts['continue_game'] = [
    { name: 'stop_music', props: { name: 'Intro', duration: 2500 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },      
    
    { func: function() {
        events.publish('pan_camera', { to: frauki.body.center, duration: 2000 }); 
        game.add.tween(GameState.Menu).to({alpha: 0}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.Reset();
        frauki.state = frauki.PreMaterializing;
    } },

    { name: 'wait', props: { amount: 2000 } },
    
    { name: 'allow_input', props: {} },
    { func: function() {
        GameState.inMainMenu = false;
        GameState.uiFadeTween = game.add.tween(GameState.UI).to({alpha: 1}, 1500, Phaser.Easing.Cubic.Out, true);
        frauki.state = frauki.Materializing;
    } },
];

ScriptRunner.scripts['new_game'] = [
    { name: 'stop_music', props: { name: 'Intro', duration: 3500 } },
    { name: 'play_sound', props: { name: 'crystal_door' } },      
    
    { func: function() {
        GameData.ResetData();
        effectsController.screenDark.bringToTop();
        GameState.Restart();
    } },

    { name: 'wait', props: { amount: 4000 } },
    
    { name: 'allow_input', props: {} },
    { func: function() {
        events.publish('set_camera', { to: frauki.body.center }); 
        
        GameState.inMainMenu = false;
        GameState.Menu.alpha = 0;
    } },

    { name: 'wait', props: { amount: 800 } },

    { func: function() {
        frauki.state = frauki.Materializing;
    } }
];