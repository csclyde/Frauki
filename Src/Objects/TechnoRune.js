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

    this.runeName = name;

    if(this.runeName === 'Overhead') {
        this.runeFrame = 'Runes0000';
    } else if(this.runeName === 'Stab') {
        this.runeFrame = 'Runes0001';
    } else if(this.runeName === 'Dive') {
        this.runeFrame = 'Runes0002';
    }

    this.animations.add('idle', [this.runeFrame], 20, true, false);
    this.animations.add('eaten', [this.runeFrame], 10, false, false);

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

    if(frauki.upgradeSaves.indexOf(r.runeName) === -1) {
        frauki.upgradeSaves.push(r.runeName);
        localStorage.setItem('fraukiUpgrades', JSON.stringify(frauki.upgradeSaves));
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
