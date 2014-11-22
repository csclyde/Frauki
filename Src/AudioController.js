AudioController = function() {
	events.subscribe('play_sound', this.PlaySound, this);

    this.sounds = {};
    this.sounds['attack1'] = game.add.audio('attack_1', 0.5);
};

AudioController.prototype.Update = function() {
	
};

AudioController.prototype.PlaySound = function(params) {
    if(!!params.name && !!this.sounds[params.name]) {
        this.sounds[params.name].play();
    }
};

AudioController.prototype.PlayMusic = function(params) {

};

//NOTES
//Each element of the sounds object could be either a clip or an array. If
//it is an array, it will choose one at eandom to play