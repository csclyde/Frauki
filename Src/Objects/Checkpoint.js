Checkpoint = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x + 8, y - 8, 'Misc');
    this.spriteType = 'checkpoint';

    this.animations.add('active', ['Checkpoint0000', 'Checkpoint0001', 'Checkpoint0002', 'Checkpoint0003', 'Checkpoint0004'], 10, true, false);
    this.animations.add('inactive', ['Checkpoint0005'], 10, true, false);

    this.anchor.setTo(0.5);

    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.moves = false;
    this.body.setSize(30, 30, 0, 0);

    this.active = false;
    this.alpha = 1;

    if(!Frogland.checkpoints) Frogland.checkpoints = [];
    Frogland.checkpoints.push(this);
};

Checkpoint.prototype = Object.create(Phaser.Sprite.prototype);
Checkpoint.prototype.constructor = Checkpoint;
Checkpoint.prototype.types = {};

Checkpoint.prototype.update = function() {

    this.active = GameData.IsCheckpointActive(this.id);

    if(this.active) {
        this.animations.play('active');
    } else {
        this.animations.play('inactive');
    }
};

Checkpoint.prototype.Activate = function(o) {

    if(!GameData.IsCheckpointActive(this.id)) {
        effectsController.ScreenFlash();
        events.publish('play_sound', {name: 'crystal_door'}); 
        
        if(this.id === '0') {
            ScriptRunner.run('demo_Checkpoint');
        }
    }

    GameData.AddActiveCheckpoint(this.id);

    var nextId = GameData.GetNextActiveCheckpoint(this.id);
    var nextCp = Frogland.checkpoints.find(function(c) { return c.id === nextId; });

    if(nextCp && nextCp.id !== this.id) {
        frauki.x = nextCp.x;
        frauki.y = nextCp.y + 120; 
    }

};

Checkpoint.prototype.collideWithPlayer = function(f) {
    return false;
};