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

    this.state = this.Active;

    this.body.allowGravity = false;

    this.runeName = name;

    if(this.runeName === 'Lob') {
        this.runeFrame = 'Runes0000';
        this.runeFrameInactive = 'Runes0003';
    } else if(this.runeName === 'Shield') {
        this.runeFrame = 'Runes0001';
        this.runeFrameInactive = 'Runes0004';
    } else if(this.runeName === 'Saw') {
        this.runeFrame = 'Runes0002';
        this.runeFrameInactive = 'Runes0005';
    }

    console.log(this.runeFrame, this.runeFrameInactive);

    this.animations.add('active', [this.runeFrame], 1, true, false);
    this.animations.add('inactive', [this.runeFrame], 1, true, false);

};

TechnoRune.prototype = Object.create(Phaser.Sprite.prototype);
TechnoRune.prototype.constructor = TechnoRune;

TechnoRune.prototype.create = function() {

    weaponController.runes.push(this);
};

TechnoRune.prototype.update = function() {
    if(!this.body.enable)
        return;

    if(!!this.state)
        this.state();
};

function EatTechnoRune(f, r) {

    effectsController.EnergySplash(r.body, 100, 'neutral');

    frauki.upgradeSaves = [];
    frauki.upgradeSaves.push(r.runeName);
    localStorage.setItem('fraukiUpgrades', JSON.stringify(frauki.upgradeSaves));

    weaponController.EquipNewWeapon(r.runeName);

    energyController.MaxCharge();

};

TechnoRune.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

TechnoRune.prototype.Active = function() {
    this.PlayAnim('inactive');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 15;
};

TechnoRune.prototype.Inactive = function() {
    this.PlayAnim('inactive');

};
