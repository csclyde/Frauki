BigNugg = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'BigNugg';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 32, 0, 0);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;

    this.state = this.Idle;

    this.body.allowGravity = false;

    this.nuggCount = 0;

    this.animations.add('idle', ['BigNugg0000', 'BigNugg0001', 'BigNugg0002', 'BigNugg0003', 'BigNugg0004', 'BigNugg0005'], 18, true, false);
    this.animations.add('eaten', ['BigNugg0001'], 10, false, false);

};

BigNugg.prototype = Object.create(Phaser.Sprite.prototype);
BigNugg.prototype.constructor = BigNugg;

BigNugg.prototype.create = function() {

};

BigNugg.prototype.update = function() {
    if(!this.body.enable)
        return;

    if(!!this.state)
        this.state();
};

function EatBigNugg(f, a) {
    
    effectsController.SpawnEnergyNuggets(a.body, frauki.body, 'positive', this.nuggCount);

    a.destroy();
};

BigNugg.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

BigNugg.prototype.Idle = function() {
    this.PlayAnim('idle');

    this.body.velocity.y = Math.sin((game.time.now / 100) + this.rando) * 15;
};
