var BootState = new Phaser.State();

BootState.preload = function() {
    //load images
    game.load.image('clyde_games_logo', 'Data/Sprites/CLYDEgames.png');
    FileMap.Images.forEach(function(img) {
    });

    game.renderer.renderSession.roundPixels = false;
};

BootState.create = function() {

    game.state.start('LoadingState', false, false);

};
