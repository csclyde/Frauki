ScriptRunner.scripts['apply_settings'] = [
    { func: function() {
        var newVolume = 1;
        var soundSetting = GameData.GetSoundSetting();

        if(soundSetting === 1) {
            newVolume = 0.5;
        } else if(soundSetting === 2) {
            newVolume = 0.1;
        } else if(soundSetting === 3) {
            newVolume = 0;
        }

        game.sound.volume = newVolume;
    } },

    { name: 'update_ui', props: { } },
    
];

ScriptRunner.scripts['adjust_sound'] = [
    { func: function() {
        var newSetting = GameData.GetSoundSetting() + 1;
        if(newSetting > 3) {
            newSetting = 0;
        }
        GameData.SetSoundSetting(newSetting);
    } },

    { name: 'run_script', props: { name: 'apply_settings' }},
    
];
