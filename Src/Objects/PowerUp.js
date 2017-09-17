PowerUp = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'powerup';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 0);
    this.anchor.setTo(0);
    this.body.bounce.y = 0.5;
    this.body.drag.setTo(100);
    this.body.gravity.y = -300
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Waiting;

    this.timers = new TimerUtil();

    //this.body.allowGravity = false;

    this.shakeMagnitudeX = 0;

    this.animations.add('waiting', ['Heart0000', 'Heart0001'], 4, true, false);
    var used = this.animations.add('used', ['Heart0001'], 10, false, false);
    used.killOnComplete = true;

};

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.create = function() {

};

PowerUp.prototype.Deactivate = function() {

    this.pendingDestroy = true;
}

PowerUp.prototype.update = function() {
    var that = this;
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();

    if(this.body.onFloor()) {
        this.body.velocity.y = game.rnd.between(-50, -75);
    }

    var timeLeft = this.timers.TimeLeft('lifespan');
    var flickerSpeed = timeLeft / 10;

    if(flickerSpeed < 20) {
        flickerSpeed = 20;
    }

    if(timeLeft < 3000 && this.timers.TimerUp('flicker')) {
        this.alpha = 0.3;
        game.time.events.add(100, function() { that.timers.SetTimer('flicker', flickerSpeed); });
    } else {
        this.alpha = 1;
    }

    if(this.timers.TimerUp('lifespan')) {
        this.state = this.Used;
    }
};

function UsePowerUp(f, p) {
    if(p.state === p.Used)
        return;
    
    if(p.timers.TimeLeft('lifetime') > 5000) {
        return;
    }
    
    p.state = p.Used;

    energyController.AddHealth(1);

};

PowerUp.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

PowerUp.prototype.Waiting = function() {
    this.PlayAnim('waiting');
};

PowerUp.prototype.Used = function() {
    this.PlayAnim('used');

};

function SpawnPowerUp(e) {

    var roll = game.rnd.between(0, 100);

    if(roll <= 85) {
        return;
    } else {
        var powerup = new PowerUp(game, e.body.center.x, e.body.center.y, 'Misc');
        game.add.existing(powerup);
    
        powerup.timers.SetTimer('lifespan', 6000);
    
        powerup.body.velocity.x = -200;
        powerup.body.velocity.y = -300;
    
        objectController.AddObject(powerup);
    }

};
