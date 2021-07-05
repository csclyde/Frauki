var BootState = new Phaser.State();

BootState.preload = function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //load images
    game.load.image('clyde_games_logo', 'Data/Sprites/CLYDEgames.png');
    game.renderer.renderSession.roundPixels = false;
    game.tweens.frameBased = true;
};

BootState.create = function() {
    game.state.start('LoadingState', false, false);
};
