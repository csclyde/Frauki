Shard = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'shard';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 16, 0, 2);
    this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0.5;
    this.body.bounce.x = 0.5;
    this.body.drag.setTo(3000);
    //this.body.gravity.y = game.physics.arcade.gravity.y * 2;

    this.state = this.Floating;

    this.body.allowGravity = false;

    this.timers = new TimerUtil();

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
    if(f === frauki && !a.timers.TimerUp('pickup_delay'))
        return;

    if(!!a.owner) a.owner.carriedShard = null;
    
    a.state = a.Carried;
    a.owner = f;
    f.carriedShard = a;

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

function DropShard(shard) {

    if(!!shard && !!shard.owner) {
        shard.body.velocity.x = shard.owner.body.velocity.x * 1;
        shard.body.velocity.y = shard.owner.body.velocity.y * 1;

        shard.owner.carriedShard = null;
        shard.owner = null;
        shard.state = shard.Floating;

        shard.timers.SetTimer('pickup_delay', 1500);

        console.log('actually dropping shard');

    }
};

Shard.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Shard.prototype.Floating = function() {
    this.PlayAnim('floating');

    this.body.velocity.y = Math.sin(game.time.now / 150) * 30;
    this.body.velocity.x = 0;
    this.body.acceleration.y = 0;
    this.body.acceleration.x = 0;
};

Shard.prototype.Carried = function() {
    this.PlayAnim('carried');

    //if the owner dies
    if(!this.owner || !this.owner.body) {
        this.state = this.Floating;
        this.body.velocity.y = 0;
        this.body.velocity.x = 0;
        this.owner = null;
        return;
    }

    var xDist = this.body.center.x - this.owner.body.center.x;
    var yDist = this.body.center.y - this.owner.body.center.y;

    var angle = Math.atan2(yDist, xDist); 
    this.body.acceleration.x = Math.cos(angle) * -500;// - (xDist * 5);    
    this.body.acceleration.y = Math.sin(angle) * -500;// - (yDist * 5);

    if((this.owner.body.center.x < this.body.center.x && this.body.velocity.x > 0) || (this.owner.body.center.x > this.body.center.x && this.body.velocity.x < 0))
        this.body.acceleration.x *= 3;

    if((this.owner.body.center.y < this.body.center.y && this.body.velocity.y > 0) || (this.owner.body.center.y > this.body.center.y && this.body.velocity.y < 0))
        this.body.acceleration.y *= 3;


    if (this.body.velocity.getMagnitude() > 400) {
        this.body.velocity.setMagnitude(400);
    }

    if (this.body.velocity.getMagnitude() < 100) {
        this.body.velocity.setMagnitude(100);
    }

    if(xDist > 300 || yDist > 300) {
        this.x = this.owner.body.center.x;
        this.y = this.owner.body.center.y;
    }

};

function PrepareShardsForDeath() {
    Frogland.shardGroup.forEach(function(s) {
        if(!!s.owner && !!s.owner.body) {
            s.x = s.owner.body.center.x;
            s.y = s.owner.body.center.y;
        }

        DropShard(s);

    });
}