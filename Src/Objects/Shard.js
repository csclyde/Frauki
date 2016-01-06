Shard = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'shard';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    this.body.drag.setTo(300);
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.animations.add('floating', ['Shard0000'], 10, false, false);
    this.animations.add('carried', ['Shard0000'], 10, false, false);

};

Shard.prototype = Object.create(Phaser.Sprite.prototype);
Shard.prototype.constructor = Shard;

Shard.prototype.create = function() {

};

Shard.prototype.update = function() {
    if(!this.body.enable)
        return;
    
    if(!!this.state)
        this.state();
};

function PickUpShard(f, a) {
    if(a.state === a.Carried)
        return;
    
    a.state = a.Carried;

    // a.body.allowGravity = true;

    // a.body.velocity.y = -250;

    // if(frauki.body.center.x < a.body.center.x)
    //     a.body.velocity.x = 75;
    // else
    //     a.body.velocity.x = -75;

    // a.body.angularVelocity = 1000;

    // a.spinTween = game.add.tween(a.body).to({angularVelocity: 0}, 3000, Phaser.Easing.Exponential.In, true);

    // a.spinTween.onComplete.add(function() { 
    //     game.time.events.add(1000, function(){ a.destroy(); } );
    // }, a);

    // energyController.AddPower(5);
};

Shard.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Shard.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 30;
};

Shard.prototype.Carried = function() {
    this.PlayAnim('carried');

    var xDist = this.body.center.x - frauki.body.center.x;
    var yDist = this.body.center.y - frauki.body.center.y;

    var angle = Math.atan2(yDist, xDist); 
    this.body.acceleration.x = Math.cos(angle) * -500;// - (xDist * 5);    
    this.body.acceleration.y = Math.sin(angle) * -500;// - (yDist * 5);

    if((frauki.body.center.x < this.body.center.x && this.body.velocity.x > 0) || (frauki.body.center.x > this.body.center.x && this.body.velocity.x < 0))
        this.body.acceleration.x *= 1.5;

    if((frauki.body.center.y < this.body.center.y && this.body.velocity.y > 0) || (frauki.body.center.y > this.body.center.y && this.body.velocity.y < 0))
        this.body.acceleration.y *= 1.5;


    if (this.body.velocity.getMagnitude() > 400) {
        this.body.velocity.setMagnitude(400);
    }

    if (this.body.velocity.getMagnitude() < 100) {
        this.body.velocity.setMagnitude(100);
    }

    if(xDist > 300 || yDist > 300) {
        this.x = frauki.body.center.x;
        this.y = frauki.body.center.y;
    }

};
