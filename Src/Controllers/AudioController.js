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

    this.XMMusicPlayer = new Modplayer();
    this.XMMusicPlayer.autostart = true;

    game.onPause.add(function() {
        this.XMMusicPlayer.pause();
    }, this);

    game.onResume.add(function() {
        this.XMMusicPlayer.pause();
    }, this);

    this.musicVolume = 1;
    this.musicVolumeTween = null;

    //load audio
    FileMap.Audio.forEach(function(audio) {
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
        that.sounds[audio.Name].initialVolume = audio.Volume;
    });

    // FileMap.Music.forEach(function(music) {

    //     that.music[music.Name] = game.add.audio(music.Name, music.Volume, music.Loop);
    //     var musicAudio = that.music[music.Name];

    //     musicAudio.initialVolume = music.Volume;
    //     musicAudio.initialName = music.Name;
    //     musicAudio.initialLoop = music.Loop;
        
    // });

    FileMap.Ambient.forEach(function(ambient) {
        that.ambient[ambient.Name] = game.add.audio(ambient.Name, ambient.Volume, ambient.Loop);
        that.ambient[ambient.Name].initialVolume = ambient.Volume;
    });

    this.sounds['baton_throw_0'].onStop.add(function() {
        if(frauki.states.throwing) audioController.sounds['baton_spin_0'].play();
    });

    this.sounds['baton_throw_1'].onStop.add(function() {
        if(frauki.states.throwing) audioController.sounds['baton_spin_1'].play();
    });

    this.sounds['baton_throw_2'].onStop.add(function() {
        if(frauki.states.throwing) audioController.sounds['baton_spin_2'].play();
    });

    this.sounds['baton_throw_3'].onStop.add(function() {
        if(frauki.states.throwing) audioController.sounds['baton_spin_3'].play();
    });

    this.sounds['baton_throw_4'].onStop.add(function() {
        if(frauki.states.throwing) audioController.sounds['baton_spin_4'].play();
    });
};

AudioController.prototype.Update = function() {

    //if the section ends and the thing does not loop, advance the section index
    //and play the next section

    if(this.XMMusicPlayer.context) this.XMMusicPlayer.setVolume(this.musicVolume); 

    if(this.musicVolume === 0 && this.XMMusicPlayer.playing) {
        this.XMMusicPlayer.stop();
        this.currentMusic = null;
    } 
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

    //they either want to just stop the song, play a new one, or they are trying to play the same song
    if(!params.name) {
        this.FadeMusic({volume: 0, fadeDuration: 3000});

    } else if(!!params.name && params.name !== this.currentMusic) {
        this.XMMusicPlayer.stop();
        if(this.musicVolumeTween) this.musicVolumeTween.stop();
        this.musicVolume = 1;
        this.XMMusicPlayer.player.clearsong();
        this.XMMusicPlayer.player.initialize();
        //this.XMMusicPlayer.loadFromBuffer(game.cache.getBinary(params.name));
        this.currentMusic = params.name;

    } else if(!!params.name && params.name === this.currentMusic) {
        this.FadeMusic({volume: 1});
    }

    



    // //if the specified song is undefined 
    // if(!!this.currentMusic && !params.name) {
    //     //then just kill the current song
    //     this.currentMusic.fadeTo(500, 0);
    // }
    // //if the song is not the currently playing song
    // else if(!!this.currentMusic && this.currentMusic.initialName !== params.name) {
    //     //fade out the current song
    //     this.currentMusic.fadeTo(500, 0);

    //     //then fade in the new song
    //     this.currentMusic = this.music[params.name];
    //     this.currentMusic.fadeTo(500, this.currentMusic.initialVolume);
    // }
    // //otherwise, just fade the song in
    // else if(!!params.name) {
    // console.log(this.currentMusic, params);

    //     //fade it back in from whatever it was at
    //     this.currentMusic = this.music[params.name];
    //     this.currentMusic.volume = this.currentMusic.initialVolume;
    //     this.currentMusic.play();
    // }

    /*
    if(!!params.name && !!this.music[params.name] && !!this.music[params.name].play) {


        //if the current song is the one to play
        if(this.currentMusic === this.music[params.name] && !this.timers.TimerUp('music_reset')) {
            if(!!this.currentMusic.fadeTween) this.currentMusic.fadeTween.stop();

            this.currentMusic.fadeTo(500, this.currentMusic.initialVolume);
        }
        //otherwise, stop the other song
        else {
            if(!!this.currentMusic) this.currentMusic.stop();

            //set the new song as the current music.
            this.currentMusic = this.music[params.name];
            this.currentMusic.play('intro', 0, this.currentMusic.initialVolume, false);
        }

    }
    */
};

AudioController.prototype.StopMusic = function(params) {
    this.XMMusicPlayer.stop();
};

AudioController.prototype.StopAllMusic = function(params) {
    this.XMMusicPlayer.stop();

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


//NOTES
//Each element of the sounds object could be either a clip or an array. If
//it is an array, it will choose one at random to play
