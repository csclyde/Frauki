TechnoRune = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, 'Misc');
    this.spriteType = 'TechnoRune';

    console.log(x, y);

    console.log(this.x, this.y);
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 32, 0, 0);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;

    console.log(this.body.x, this.body.y);


    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Idle;

    this.body.allowGravity = false;

    this.runeName = name;

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

function EatTechnoRune(f, r) {

    effectsController.EnergySplash(r.body, 100, 'positive');
    
    if(r.runeName === 'Stab') {
        frauki.upgrades.attackStab = true;
        frauki.StabSlash();
    } else if(r.runeName === 'Dive') {
        frauki.upgrades.attackDive = true;
    } else if(r.runeName === 'Overhead') {
        frauki.upgrades.attackOverhead = true;
    }

    r.kill();

};

TechnoRune.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

TechnoRune.prototype.Idle = function() {
    this.PlayAnim('idle');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 15;
};
