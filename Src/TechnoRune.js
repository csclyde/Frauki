TechnoRune = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'TechnoRune';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 32, 0, 0);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;


    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Idle;

    this.body.allowGravity = false;

    this.animations.add('idle', ['Runes0000'], 20, true, false);
    this.animations.add('eaten', ['Runes0000'], 10, false, false);

};

TechnoRune.prototype = Object.create(Phaser.Sprite.prototype);
TechnoRune.prototype.constructor = TechnoRune;

TechnoRune.prototype.create = function() {

};

TechnoRune.prototype.update = function() {
    if(!this.body.enable)
        return;

    if(!!this.state)
        this.state();
};

function EatTechnoRune(f, a) {

    a.kill();

};

TechnoRune.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

TechnoRune.prototype.Idle = function() {
    this.PlayAnim('idle');

    this.body.velocity.y = Math.sin((game.time.now / 150) + this.rando) * 15;
};
