AudioController = function() {
    var that = this;

    this.timers = new TimerUtil();

    events.subscribe('update_sound_settings', this.UpdateVolumeSettings, this);

    events.subscribe('play_sound', this.PlaySound, this);
    events.subscribe('stop_sound', this.StopSound, this);
    events.subscribe('pause_all_sound', this.PauseAllSound, this);
    events.subscribe('unpause_all_sound', this.UnpauseAllSound, this);

    events.subscribe('play_music', this.PlayMusic, this);
    events.subscribe('stop_music', this.StopMusic, this);
    events.subscribe('stop_all_music', this.StopAllMusic, this);
    events.subscribe('pause_all_music', this.PauseAllMusic, this);
    events.subscribe('unpause_all_music', this.UnpauseAllMusic, this);

    events.subscribe('play_ambient', this.PlayAmbient, this);
    events.subscribe('stop_ambient', this.StopAmbient, this);
    events.subscribe('stop_all_ambient', this.StopAllAmbient, this);

    events.subscribe('stop_attack_sounds', function() {
        for(var key in this.sounds) {
            if(key.indexOf('attack') > -1 && key !== 'attack_connect') {
                this.sounds[key].stop();
            }
        }
    }, this);

    this.sounds = {};
    this.music = {};
    this.ambient = {};

    //load audio
    FileMap.Audio.forEach(function(audio) {
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
        that.sounds[audio.Name].initialVolume = audio.Volume;
    });

    FileMap.Music.forEach(function(music) {
        that.music[music.Name] = game.add.audio(music.Name, music.Volume, music.Loop);
        var musicAudio = that.music[music.Name];

        musicAudio.initialVolume = music.Volume;
        musicAudio.initialName = music.Name;
        musicAudio.initialLoop = music.Loop;
        
    });

    FileMap.Ambient.forEach(function(ambient) {
        that.ambient[ambient.Name] = game.add.audio(ambient.Name, ambient.Volume, ambient.Loop);
        that.ambient[ambient.Name].initialVolume = ambient.Volume;
    });
};

AudioController.prototype.Update = function() {

};

AudioController.prototype.Reset = function() {
    
};

AudioController.prototype.UpdateVolumeSettings = function() {
    var soundSetting = GameData.GetSetting('sound');
    var musicSetting = GameData.GetSetting('music');

    game.sound.volume = soundSetting / 8;
    game.sound.volume = Math.pow(game.sound.volume, 2);

    for(key in this.music) {
        if(this.music[key].isPlaying) {
            this.music[key].volume = this.music[key].initialVolume * (musicSetting / 8);
        }
    }
};

AudioController.prototype.PlaySound = function(params) {
    var sfxSetting = GameData.GetSetting('sfx');    

    if(!!params.name && !!this.sounds[params.name] && !this.sounds[params.name].paused) {

        //if the sound is already playing and they dont want to start it over
        if(this.sounds[params.name].isPlaying && params.restart !== true) return;
        
        //if this is the damage sound, or an attack sound, stop all attack sounds
        if((params.name.indexOf('frauki_ouch') > -1 || params.name.indexOf('attack') > -1) && params.name !== 'attack_connect') {
            this.sounds['attack_slash'].stop();
            this.sounds['attack_stab'].stop();
            this.sounds['attack_dive_charge'].stop();
            this.sounds['attack_dive_fall'].stop();
            this.sounds['attack_dive_land'].stop();
        }
        
        this.sounds[params.name].play();
        this.sounds[params.name].volume = this.sounds[params.name].initialVolume * (sfxSetting / 8);
    }
};

AudioController.prototype.StopSound = function(params) {
    if(!!params.name && !!this.sounds[params.name] && this.sounds[params.name].isPlaying) {
        if(!!params.fade) {
            this.sounds[params.name].fadeOut(params.fade);
        } else {
            this.sounds[params.name].stop();
        }
    }
};

AudioController.prototype.PauseAllSound = function(params) {
    for(var key in this.sounds) {
        if(!this.sounds.hasOwnProperty(key)) continue;

        if(!!this.sounds[key] && this.sounds[key].isPlaying) {
            this.sounds[key].pause();
        }
    }
};

AudioController.prototype.StopAllSound = function(params) {
    for(var key in this.sounds) {
        if(!this.sounds.hasOwnProperty(key)) continue;

        if(!!this.sounds[key] && this.sounds[key].isPlaying) {
            this.sounds[key].fadeOut(params.fade || 500);
        }
    }
};

AudioController.prototype.UnpauseAllSound = function(params) {
    for(var key in this.sounds) {
        if(!this.sounds.hasOwnProperty(key)) continue;

        if(!!this.sounds[key] && this.sounds[key].paused) {
            this.sounds[key].resume();
        }
    }
};


AudioController.prototype.PlayMusic = function(params) {
    var musicSetting = GameData.GetSetting('music');
    
    if(!!params.name && !!this.music[params.name] && !this.music[params.name].isPlaying) {
        if(params.fade) {
            this.music[params.name].play(null, 0, 0);
            this.music[params.name].fadeTo(params.fade, this.music[params.name].initialVolume * (musicSetting / 8));
        } else {         
            this.music[params.name].play(null, 0, this.music[params.name].initialVolume  * (musicSetting / 8));
        }
    }
};

AudioController.prototype.StopMusic = function(params) {
    if(!!params.name && !!this.music[params.name]) {
        if(params.fade) {
            this.music[params.name].fadeOut(params.fade);
        } else {
            this.music[params.name].stop();
        }
    }
};

AudioController.prototype.StopAllMusic = function(params) {
    for(var key in this.music) {
        if(!this.music.hasOwnProperty(key)) continue;

        if(!!this.music[key] && this.music[key].isPlaying) {
            this.music[key].fadeOut(params.fade || 1000);
        }
        else if(!!this.music[key] && this.music[key].paused) {
            this.music[key].stop();
            this.music[key].paused = false;
            this.music[key].willBePaused = false;
        }
    }
};

AudioController.prototype.PauseAllMusic = function(params) {
    for(var key in this.music) {
        if(!this.music.hasOwnProperty(key)) continue;

        if(!!this.music[key] && this.music[key].isPlaying) {
            this.music[key].fadeToPause(params.fade || 1000);
        }
    }
};

AudioController.prototype.UnpauseAllMusic = function(params) {
    var musicSetting = GameData.GetSetting('music');
    
    for(var key in this.music) {
        if(!this.music.hasOwnProperty(key)) continue;

        if(!!this.music[key] && (this.music[key].paused || this.music[key].willBePaused)) {
            this.music[key].fadeToResume(params.duration || 1000, this.music[key].initialVolume  * (musicSetting / 8));
        }
    }
};

AudioController.prototype.PlayAmbient = function(params) {
    if(!!params.name && !!this.ambient[params.name] && !this.ambient[params.name].isPlaying) {
        this.StopAllAmbient(params.name);
        this.ambient[params.name].play(null, 0, 0);
        this.ambient[params.name].fadeTo(500, this.ambient[params.name].initialVolume);
    }
};

AudioController.prototype.StopAmbient = function(params) {
    if(!!params.name && !!this.ambient[params.name] && !!this.ambient[params.name].stop) {
        this.ambient[params.name].pause();
    }
};

AudioController.prototype.StopAllAmbient = function() {
    for(var key in this.ambient) {
        if(!this.ambient.hasOwnProperty(key)) continue;

        if(!!this.ambient[key] && this.ambient[key].isPlaying) {
            this.ambient[key].fadeTo(500, 0);
        }
    }
};
