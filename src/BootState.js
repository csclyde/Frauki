var BootState = new Phaser.State();

BootState.preload = function() {
    //load images
    game.load.image('clyde_games_logo', 'Data/Sprites/CLYDEgames.png');
    game.renderer.renderSession.roundPixels = false;
    game.tweens.frameBased = true;
};

BootState.create = function() {
    game.state.start('LoadingState', false, false);
};
