AltarBank = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'AltarBank';
    this.objectName = 'AltarBank';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(32, 64, 0, 0);
    this.anchor.setTo(0.5);
    this.body.bounce.y = 0;
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Active;

    this.timers = new TimerUtil();

    this.body.allowGravity = false;

    this.animations.add('active', ['AltarBank0000', 'AltarBank0001', 'AltarBank0002', 'AltarBank0003', 'AltarBank0004', 'AltarBank0005'], 10, true, false);
    this.animations.add('eaten', ['AltarBank0000'], 10, false, false);

    this.counterBox = game.add.sprite(0, 0, 'UI');
    this.counterBox.animations.add('blink', ['BankCounter0000', 'BankCounter0001'], 18, true, false);
    this.counterBox.animations.play('blink');
    this.counterBox.alpha = 0.8;
    this.counterBox.anchor.setTo(0.5);
    this.counterBox.visible = false;

    this.font = game.add.retroFont('font', 9, 13, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890?,.!#\' ', 13);
    this.font.align = this.font.ALIGN_CENTER;
    this.fixedWidth = 44;

    this.text = game.add.image(0, 0, this.font);
    this.text.visible = false;


};

AltarBank.prototype = Object.create(Phaser.Sprite.prototype);
AltarBank.prototype.constructor = AltarBank;

AltarBank.prototype.create = function() {

};

AltarBank.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();

    var dist = new Phaser.Point(this.body.center.x - frauki.body.center.x, this.body.center.y - frauki.body.center.y);

    if(this.owningLayer === Frogland.currentLayer && dist.getMagnitude() < 100) {
        this.counterBox.visible = true;
        this.counterBox.x = this.x + 7;
        this.counterBox.y = this.y - 47  + (Math.sin(game.time.now / 300) * 2);

        this.text.visible = true;
        this.text.x = this.counterBox.x - this.counterBox.width / 2;
        this.text.y = this.counterBox.y - 10;
        this.font.text = GameData.GetNuggBankCount() + '';

    } else {
        this.counterBox.visible = false;
        this.text.visible = false;
    }
};

function HitAltarBank(f, o) {
    if(o.timers.TimerUp('hit')) {
        effectsController.ClashStreak(o.body.center.x, o.body.center.y, game.rnd.between(1, 2));
        events.publish('play_sound', {name: 'crystal_door'});
        events.publish('play_sound', {name: 'attack_connect'});
        o.timers.SetTimer('hit', 1000);
        GameData.SaveNuggsToBank();
    }

};

AltarBank.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

AltarBank.prototype.Active = function() {
    this.PlayAnim('active');
};

/*
need a general case for multiple events triggering one event. kill multiple enemies, and
one door opens. Or smash multiple AltarBanks, one door opens. or whatever. Each object needs to be
somehow denoted as part of a group. they can have the group name as one of the message.

The event router could somehow handle group messages. or, for doors specifically there needs
to be code at the end of the open door event that checks if the thing is part of a group.

On the open door by id function, there is an optional second paramtere, the group name. if the
group name is specified, then then entire group needs to be accounted for before the door will
open. How is the threshold specified? 
*/