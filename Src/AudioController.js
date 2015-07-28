AudioController = function() {
    var that = this;

    events.subscribe('play_sound', this.PlaySound, this);
    events.subscribe('stop_sound', this.StopSound, this);
    events.subscribe('play_music', this.PlayMusic, this);
    events.subscribe('stop_music', this.StopMusic, this);
    events.subscribe('stop_all_music', this.StopAllMusic, this);

    this.sounds = {};
    this.music = {};

    //load audio
    FileMap.Audio.forEach(function(audio) {
        //game.load.audio(audio.Name, audio.File);
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
    });

    FileMap.Music.forEach(function(music) {
        that.music[music.Name] = {};

        var xhr = new XMLHttpRequest();
        xhr.open('GET', music.File, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            if(this.status == 200){
                var uInt8Array = new Uint8Array(this.response);
                that.music[music.Name] = window.neoart.F2Player(null);
                that.music[music.Name].load(this.response);
                that.music[music.Name].loopSong = music.Loop ? 1 : 0;
                that.music[music.Name].volume = music.Volume;

                if(music.Name === 'Surface') {
                    that.music[music.Name].play();
                }
            } 
        };
        xhr.send();
    });
};

AudioController.prototype.Update = function() {
    
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
    }
};

AudioController.prototype.StopSound = function(params) {
    if(!!params.name && !!this.sounds[params.name]) {
        this.sounds[params.name].stop();
    }
}

AudioController.prototype.PlayMusic = function(params) {
    if(!!params.name && !!this.music[params.name] && !!this.music[params.name].play) {
            this.music[params.name].play();
    }
};

AudioController.prototype.StopMusic = function(params) {
    if(!!params.name && !!this.music[params.name] && !!this.music[params.name].stop) {
        this.music[params.name].stop();
        this.music[params.name].isPlaying = false;

    }
};

AudioController.prototype.StopAllMusic = function(params) {
    for(var key in this.music) {
        if(!this.music.hasOwnProperty(key)) continue;

        if(!!this.music[key] && !!this.music[key].stop) this.music[key].stop();
    }
}

//NOTES
//Each element of the sounds object could be either a clip or an array. If
//it is an array, it will choose one at random to play
