Door = function(game, x, y, name) {
    //instantiate the sprite
    Phaser.Sprite.call(this, game, x, y, name);
    this.spriteType = 'door';
    
    //enable its physics body
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(16, 68, 0, -16);
    this.anchor.setTo(0.5, 0.5);

    this.x += 8;
    this.y += 8;
    
    //this.SetDirection('left');

    this.state = this.Closed;

    this.body.allowGravity = false;
    this.body.immovable = true;
    this.visible = false;

    this.animations.add('left', ['Door0000'], 10, true, false); 
    this.animations.add('right', ['Door0001'], 10, true, false); 
    this.animations.add('wit', ['Door0002'], 10, true, false); 
    this.animations.add('will', ['Door0003'], 10, true, false); 
    this.animations.add('luck', ['Door0004'], 10, true, false); 
    this.animations.add('power', ['Door0005'], 10, true, false); 
    this.animations.add('left_dead', ['Door0006'], 10, true, false); 
    this.animations.add('right_dead', ['Door0007'], 10, true, false); 

    this.animations.add('opening', ['Door0000'], 10, false, false);
};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.create = function() {

};

Door.prototype.update = function() {

    if(!!this.state)
        this.state();
};

Door.prototype.SetDirection = function(dir) {
    if(dir === 'left' && this.direction !== 'left') {
        this.direction = 'left';
        this.scale.x = -1;
    }
    else if(dir === 'right' && this.direction !== 'right') {
        this.direction = 'right';
        this.scale.x = 1;
    }
};

function OpenDoor(f, d, override) {
    if(d.state === d.Closed) {

        //if they attack the back side of the door
        if(frauki.Attacking()) {
            if((d.facing === 'left' && f.body.center.x > d.body.center.x) || (d.facing === 'right' && f.body.center.x < d.body.center.x) || !!override) {
                PerformOpen();
                console.log('Opening door with attack:' + d.id);

                effectsController.ExplodeDoorSeal(d);
            }
        }

        //or if its a shard door and they are holding the right shard
        if(d.prism === GetCurrentShardType()) {
            PerformOpen();
            console.log('Opening door with prism shard:' + d.id);
        }
    }

    function PerformOpen() {
        var openTween = game.add.tween(d.body).to({y: d.body.y + 70}, 2000, Phaser.Easing.Quintic.InOut, true);

        //disable the body after its opened
        openTween.onComplete.add(function() {
            this.body.enable = false;
        }, d);

        d.state = d.Opening;


        if(Frogland.openDoors.indexOf(d.id) === -1) {
            Frogland.openDoors.push(d.id);
            localStorage.setItem('fraukiDoors', JSON.stringify(Frogland.openDoors));
        }
    }
};

Door.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Door.prototype.Closed = function() {

    if(this.facing === 'left') {
        this.PlayAnim('left');
    } else if(this.facing === 'right') { 
        this.PlayAnim('right');
    } else if(this.prism === 'Wit') {
        this.PlayAnim('wit');
    } else if(this.prism === 'Will') {
        this.PlayAnim('will');
    } else if(this.prism === 'Luck') {
        this.PlayAnim('luck');
    } else if(this.prism === 'Power') {
        this.PlayAnim('power');
    }
};

Door.prototype.Opening = function() {
    if(this.facing === 'left') {
        this.PlayAnim('left_dead');
    } else if(this.facing === 'right') { 
        this.PlayAnim('right_dead');
    } else if(this.prism === 'Wit') {
        this.PlayAnim('wit');
    } else if(this.prism === 'Will') {
        this.PlayAnim('will');
    } else if(this.prism === 'Luck') {
        this.PlayAnim('luck');
    } else if(this.prism === 'Power') {
        this.PlayAnim('power');
    }

    this.state = this.Open;
};

Door.prototype.Open = function() {
    this.PlayAnim('closed');

};
