AudioController = function() {
	var that = this;

	events.subscribe('play_sound', this.PlaySound, this);
	events.subscribe('stop_sound', this.StopSound, this);

    this.sounds = {};

    //load audio
    FileMap.Audio.forEach(function(audio) {
        //game.load.audio(audio.Name, audio.File);
        that.sounds[audio.Name] = game.add.audio(audio.Name, audio.Volume, audio.Loop);
    });
};

AudioController.prototype.Update = function() {
	
};

AudioController.prototype.PlaySound = function(params) {
	var that = this;

    if(!!params.name && !!this.sounds[params.name]) {

    	//if this is the damage sound, or an attack sound, stop all attack sounds
    	if(params.name.indexOf('ouch') > -1 || params.name.indexOf('attack') > -1) {
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

};

//NOTES
//Each element of the sounds object could be either a clip or an array. If
//it is an array, it will choose one at eandom to play