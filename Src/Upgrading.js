var Upgrading = new Phaser.State();

Upgrading.preload = function() {

};

Upgrading.create = function() {
    console.log('Creating upgrading state')

    events.subscribe('enter_upgrades', function() {
        game.state.start('Upgrading', false);
    });

    events.subscribe('exit_upgrades', function() {
        game.state.start('Main', false);
    });
    
};

Upgrading.update = function() {

    inputController.Update();
};

