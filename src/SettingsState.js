var SettingsState = new Phaser.State();

SettingsState.preload = function() {
    //load images
};

SettingsState.create = function() {
    this.logo = game.add.image(0, 0, 'clyde_games_logo');
    
    //game.state.start('LoadingState', false, false);

    events.subscribe('control_up', function() {
        console.log('yaa')
    })
};

SettingsState.update = function() {

};

SettingsState.render = function() {
    
};
