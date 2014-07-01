//  Here is a custom game object
Player = function (game, x, y, name) {

    Phaser.Sprite.call(this, game, x, y, name);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.anchor.setTo(.5, 1);

    //this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    this.body.setSize(10, 50, 5, 16);

    this.animations.add('stand', ['Stand0000.png'], 10, true, false);
    this.animations.add('run', ['Run0000.png', 'Run0001.png', 'Run0002.png', 'Run0003.png', 'Run0004.png', 'Run0005.png', 'Run0006.png', 'Run0007.png'], 10, true, false);
    this.animations.add('jump', ['Standing Jump0001.png'], 10, true, false);
    this.animations.add('peak', ['Standing Jump0002.png', 'Standing Jump0003.png', 'Standing Jump0004.png'], 10, false, false);
    this.animations.add('fall', ['Standing Jump0005.png'], 10, true, false);
    this.animations.add('land', ['Standing Jump0006.png', 'Standing Jump0007.png', 'Standing Jump0008.png'], 10, false, false);

    game.camera.follow(this);

    this.state = this.Standing;
    this.direction = 'right';
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function() {

}

Player.prototype.update = function() {

    //Phaser.Utils.Debug.text("test", 0, 0);
    this.state();

};

Player.prototype.SetDirection = function(dir) {
    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

Player.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Player.prototype.Standing = function() {
    this.PlayAnim('stand');

    if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 0) {
        this.state = this.Falling;
    } else if(this.body.velocity.x !== 0) {
        this.state = this.Running;
    }
};

Player.prototype.Running = function() {
    this.PlayAnim('run');

    if(this.body.velocity.x === 0 && this.body.onFloor()) {
        this.state = this.Standing;
    } else if(this.body.velocity.y < 0) {
        this.state = this.Jumping;
    } else if(this.body.velocity.y > 0) {
        this.state = this.Falling;
    }
};

Player.prototype.Jumping = function() {
    this.PlayAnim('jump');

    if(this.body.velocity.y > -50) {
        this.state = this.Peaking;
    }

};

Player.prototype.Peaking = function() {
    this.PlayAnim('peak');

    if(this.animations.currentAnim.isFinished) {
        this.state = this.Falling;
    }
}

Player.prototype.Falling = function() {
    this.PlayAnim('fall');
    
    if(this.body.onFloor()) {
        this.state = this.Landing;
    }

};

Player.prototype.Landing = function() {
    this.PlayAnim('land');

    if(this.animations.currentAnim.isFinished) {
        if(this.body.velocity.x === 0) {
            this.state = this.Standing;
        } else {
            this.state = this.Running;
        }
    }
};
