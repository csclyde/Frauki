ExpToken = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x + 8, y, name);
    this.spriteType = 'expToken';
    this.objectName = 'ExpToken';
    this.name = 'expToken';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(30, 30, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0.5;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.animations.add('floating', ['ExplorationToken0000', 'ExplorationToken0001', 'ExplorationToken0002', 'ExplorationToken0003', 'ExplorationToken0004', 'ExplorationToken0005'], 5, true, false);
    this.animations.add('eaten', ['ExplorationToken0000'], 10, false, false);

    this.floatPhase = game.rnd.between(1, 200);

};

ExpToken.prototype = Object.create(Phaser.Sprite.prototype);
ExpToken.prototype.constructor = ExpToken;

ExpToken.prototype.create = function() {

};

ExpToken.prototype.update = function() {
    if(GameData.HasExpToken(this.properties.name)) {
        this.pendingDestroy = true;
    }

    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();
};

ExpToken.prototype.collideWithPlayer = function(f) {
    return false;
};

function SmashExpToken(f, o) {
    effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
    effectsController.Dust(o.body.center.x, o.body.center.y);
    effectsController.ScreenFlash();
    effectsController.DiceObject('ExplorationToken', o.body.center.x, o.body.center.y, o.body.velocity.x, o.body.velocity.y);
    events.publish('play_sound', {name: 'door_break'});
    o.destroy();

    GameData.AddExpToken(o.properties.name);
    events.publish('display_region_text', { text: 'EXPLORER TOKEN DISCOVERED'});
};

ExpToken.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

ExpToken.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin((GameState.gameTime / 300) + this.floatPhase) * 30;
};