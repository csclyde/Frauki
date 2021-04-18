AudioController = function() {
    var that = this;

    this.timers = new TimerUtil();

    events.subscribe('update_sound_settings', this.UpdateVolumeSettings, this);

    events.subscribe('play_sound', this.PlaySound, this);
    events.subscribe('stop_sound', this.StopSound, this);
    events.subscribe('stop_all_sound', this.StopAllSound, this);
    events.subscribe('pause_all_sound', this.PauseAllSound, this);
    events.subscribe('unpause_all_sound', this.UnpauseAllSound, this);

    events.subscribe('play_ambient', this.PlayAmbient, this);
    events.subscribe('stop_ambient', this.StopAmbient, this);
    events.subscribe('stop_all_ambient', this.StopAllAmbient, this);

    events.subscribe('play_music', this.PlayMusic, this);
    events.subscribe('stop_music', this.StopMusic, this);
    events.subscribe('stop_all_music', this.StopAllMusic, this);

    events.subscribe('play_interlude', this.PlayInterlude, this);
    events.subscribe('stop_interlude', this.StopInterlude, this);

    events.subscribe('stop_attack_sounds', function() {
        for(var key in this.sounds) {
            if(key.indexOf('attack') > -1 && key !== 'attack_connect') {
                this.sounds[key].stop();
            }
        }
    }, this);

    this.sounds = {};
    this.ambient = {};
    this.music = {};

    this.currentMusic = null;
    this.currentInterlude = null;

    //load audio
    FileMap.Audio.forEach(function(audio) {
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
        that.sounds[audio.Name].initialVolume = audio.Volume;
    });

    FileMap.Ambient.forEach(function(ambient) {
        that.ambient[ambient.Name] = game.add.audio(ambient.Name, ambient.Volume, ambient.Loop);
        that.ambient[ambient.Name].initialVolume = ambient.Volume;
    });

    FileMap.Music.forEach(function(music) {
        that.music[music.Name] = game.add.audio(music.Name, music.Volume, music.Loop);
        var musicAudio = that.music[music.Name];

        musicAudio.initialVolume = music.Volume;
        musicAudio.initialName = music.Name;
        musicAudio.initialLoop = music.Loop;
        
    });
};

AudioController.prototype.Update = function() {
};

AudioController.prototype.Reset = function() {
};

AudioController.prototype.UpdateVolumeSettings = function() {
    var soundSetting = GameData.GetSetting('sound');
    var musicSetting = GameData.GetSetting('music');
    var sfxSetting = GameData.GetSetting('sfx');

    game.sound.volume = Math.pow(soundSetting / 8, 2);

    // if(musicSetting) {
    //     this.UnpauseAllMusic({ fade: 0 });
    // } else {
    //     this.PauseAllMusic({ fade: 0 });
    // }
};

//SFX//////
AudioController.prototype.PlaySound = function(params) {
    var sfxSetting = GameData.GetSetting('sfx');

    if(sfxSetting && !!params.name && !!this.sounds[params.name] && !this.sounds[params.name].paused) {

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
        this.sounds[params.name].volume = this.sounds[params.name].initialVolume;
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
            this.sounds[key].stop();
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

//AMBIENT//////
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

//MUSIC//////
AudioController.prototype.PlayMusic = function(params) {
    var musicSetting = GameData.GetSetting('music');

    var newMusic = this.music[params.name];

    if(!!newMusic && musicSetting) {
        //if there is other music playing, fade it out
        if(this.currentMusic && this.currentMusic !== newMusic) {
            this.currentMusic.fadeToStop(params.fade || 1);
        }

        if(params.fade) {
            newMusic.play(null, 0, 0);
            newMusic.fadeToResume(params.fade, newMusic.initialVolume);
        } else {
            newMusic.play(null, 0, newMusic.initialVolume);
        }

        this.currentMusic = newMusic;
    }
};

AudioController.prototype.StopMusic = function(params) {
    if(this.currentMusic) {
        this.currentMusic.fadeToStop(params.fade || 1);
        this.currentMusic = null;
    }
};

AudioController.prototype.PlayInterlude = function(params) {
    var musicSetting = GameData.GetSetting('music');
    
    var newInterlude = this.music[params.name];

    if(!!newInterlude && musicSetting) {
    
        //if there is other music playing, fade it out
        if(this.currentMusic) {
            this.currentMusic.fadeToPause(params.fade || 1);
        }

        if(!!this.currentInterlude) {
            this.currentInterlude.fadeToStop(params.fade || 1);
        }

        if(params.fade) {
            newInterlude.stop();
            newInterlude.play(null, 0, 0.01);
            newInterlude.fadeToResume(params.fade, newInterlude.initialVolume);
        } else {
            newInterlude.play(null, 0, newInterlude.initialVolume);
        }

        this.currentInterlude = newInterlude;
    }
};

AudioController.prototype.StopInterlude = function(params) {
    if(this.currentInterlude) {
        this.currentInterlude.fadeToStop(params.fade || 1);
        this.currentInterlude = null;
    }

    if(this.currentMusic) {
        this.currentMusic.fadeToResume(params.fade || 1, this.currentMusic.initialVolume);
    }
};
