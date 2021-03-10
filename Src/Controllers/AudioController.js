AudioController = function() {
    var that = this;

    this.timers = new TimerUtil();

    events.subscribe('play_sound', this.PlaySound, this);
    events.subscribe('stop_sound', this.StopSound, this);
    events.subscribe('play_music', this.PlayMusic, this);
    events.subscribe('stop_music', this.StopMusic, this);
    events.subscribe('play_ambient', this.PlayAmbient, this);
    events.subscribe('stop_ambient', this.StopAmbient, this);
    events.subscribe('stop_all_music', this.StopAllMusic, this);
    events.subscribe('stop_all_ambient', this.StopAllAmbient, this);
    events.subscribe('fade_music', this.FadeMusic, this);

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

    this.currentMusic = null;

   

    game.onPause.add(function() {
        
    }, this);

    game.onResume.add(function() {
        
    }, this);

    this.musicVolume = 1;
    this.musicVolumeTween = null;

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

    // this.sounds['baton_throw_0'].onStop.add(function() {
    //     if(frauki.states.throwing) audioController.sounds['baton_spin_0'].play();
    // });

    // this.sounds['baton_throw_1'].onStop.add(function() {
    //     if(frauki.states.throwing) audioController.sounds['baton_spin_1'].play();
    // });

    // this.sounds['baton_throw_2'].onStop.add(function() {
    //     if(frauki.states.throwing) audioController.sounds['baton_spin_2'].play();
    // });

    // this.sounds['baton_throw_3'].onStop.add(function() {
    //     if(frauki.states.throwing) audioController.sounds['baton_spin_3'].play();
    // });

    // this.sounds['baton_throw_4'].onStop.add(function() {
    //     if(frauki.states.throwing) audioController.sounds['baton_spin_4'].play();
    // });
};

AudioController.prototype.Update = function() {

    //if the section ends and the thing does not loop, advance the section index
    //and play the next section

};

AudioController.prototype.PlaySound = function(params) {
    var that = this;

    if(!!params.name && !!this.sounds[params.name]) {

        //if the sound is already playing and they dont want to start it over
        if(this.sounds[params.name].isPlaying && params.restart !== true) return;
        
        //if this is the damage sound, or an attack sound, stop all attack sounds
        if((params.name.indexOf('ouch') > -1 || params.name.indexOf('attack') > -1) && params.name !== 'attack_connect') {
            that.sounds['attack_slash'].stop();
            that.sounds['attack_stab'].stop();
            that.sounds['attack_dive_charge'].stop();
            that.sounds['attack_dive_fall'].stop();
            that.sounds['attack_dive_land'].stop();
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

AudioController.prototype.PlayMusic = function(params) {

    if(!!params.name && !!this.music[params.name]) {
        this.music[params.name].play(null, 0, this.music[params.name].initialVolume);
        //this.music[params.name].fadeTo(500, this.music[params.name].initialVolume);
    }
};

AudioController.prototype.StopMusic = function(params) {
    if(!!params.name && !!this.music[params.name]) {
        if(params.duration) {
            this.music[params.name].fadeOut(params.duration);
        } else {
            this.music[params.name].pause();
        }
    }
};

AudioController.prototype.StopAllMusic = function(params) {
   

    // if(!!this.currentMusic) {
    //     if(!!this.currentMusic.fadeTween) this.currentMusic.fadeTween.stop();

    //     this.currentMusic.fadeOut(params.fadeOut || 500);
    //     this.timers.SetTimer('music_reset', (params.fadeOut || 500) + 10000);
    // }
    // for(var key in this.music) {
    //     if(!this.music.hasOwnProperty(key)) continue;

    //     if(!!this.music[key] && this.music[key].isPlaying) {

    //         if(!!this.music[key].fadeTween && this.music[key].fadeTween.isRunning) {
    //             this.music[key].fadeTween.stop();
    //         }

    //         this.music[key].fadeOut(params.fadeOut || 500);
    //         this.music[key].quietTimestamp = game.time.now + (params.fadeOut || 500);
    //     }
    // }
};

AudioController.prototype.FadeMusic = function(params) {
    var that = this;

    //volume, duration

    if(!this.currentMusic) return;

    //this.currentMusic.fadeTo(params.fadeDuration || 500, params.volume || 0);
    if(this.musicVolumeTween) this.musicVolumeTween.stop();
    this.musicVolumeTween = game.add.tween(this).to({ musicVolume: params.volume }, params.fadeDuration || 500, Phaser.Easing.Linear.None, true);

    
    if(params.duration) {
        game.time.events.add(params.duration, function() {
            that.FadeMusic({volume: 1});
        }); 
    }
};

AudioController.prototype.PlayAmbient = function(params) {
    if(!!params.name && !!this.ambient[params.name] && !!this.ambient[params.name].play) {

        this.ambient[params.name].play(null, 0, 0);

        this.ambient[params.name].fadeTo(500, this.ambient[params.name].initialVolume);
    }
};

AudioController.prototype.StopAmbient = function(params) {
    if(!!params.name && !!this.ambient[params.name] && !!this.ambient[params.name].stop) {
        this.ambient[params.name].pause();
    }
};

AudioController.prototype.StopAllAmbient = function(params) {
    for(var key in this.ambient) {
        if(!this.ambient.hasOwnProperty(key)) continue;

        if(!!this.ambient[key] && this.ambient[key].isPlaying) {

            this.ambient[key].fadeTo(500, 0);
        }
    }
};
