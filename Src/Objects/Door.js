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

    this.state = this.Closed;

    this.body.allowGravity = false;
    this.body.immovable = true;
    this.visible = false;
    this.thresholdAttempts = 1;
    this.openAttempts = 0;

    this.animations.add('left', ['DoorSeal0000', 'DoorSeal0001', 'DoorSeal0002', 'DoorSeal0003', 'DoorSeal0004'], 10, true, false); 
    this.animations.add('right', ['DoorSeal0005', 'DoorSeal0006', 'DoorSeal0007', 'DoorSeal0008', 'DoorSeal0009'], 10, true, false); 
    this.animations.add('left_dead', ['DoorSeal0010'], 10, true, false); 
    this.animations.add('right_dead', ['DoorSeal0011'], 10, true, false); 

    this.animations.add('wit', ['DoorPrism0000'], 10, true, false); 
    this.animations.add('will', ['DoorPrism0001'], 10, true, false); 
    this.animations.add('luck', ['DoorPrism0002'], 10, true, false); 
    this.animations.add('power', ['DoorPrism0003'], 10, true, false);

    this.animations.add('wit_open', ['DoorPrism0004'], 10, true, false); 
    this.animations.add('will_open', ['DoorPrism0005'], 10, true, false); 
    this.animations.add('luck_open', ['DoorPrism0006'], 10, true, false); 
    this.animations.add('power_open', ['DoorPrism0007'], 10, true, false); 

    this.animations.add('skull', ['DoorEnemy0000'], 10, true, false);
    this.animations.add('skull_open', ['DoorEnemy0001'], 10, true, false);

    this.animations.add('mystery', ['DoorMystery0000'], 10, true, false);
    this.animations.add('apple', ['DoorApple0000'], 10, true, false);


    this.animations.add('orb_1_0', ['DoorOrb0000'], 10, true, false);
    this.animations.add('orb_1_1', ['DoorOrb0001'], 10, true, false);
    this.animations.add('orb_2_0', ['DoorOrb0002'], 10, true, false);
    this.animations.add('orb_2_1', ['DoorOrb0003'], 10, true, false);
    this.animations.add('orb_2_2', ['DoorOrb0004'], 10, true, false);
    this.animations.add('orb_3_0', ['DoorOrb0005'], 10, true, false);
    this.animations.add('orb_3_1', ['DoorOrb0006'], 10, true, false);
    this.animations.add('orb_3_2', ['DoorOrb0007'], 10, true, false);
    this.animations.add('orb_3_3', ['DoorOrb0008'], 10, true, false);

};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.create = function() {

};

Door.prototype.update = function() {

    if(this.state === this.Closed && this.owningLayer === Frogland.currentLayer && GameData.IsDoorOpen(this.id)) {
        if(this.body.x > game.camera.x && this.body.y > game.camera.y && this.body.x < game.camera.x + game.camera.width && this.body.y < game.camera.y + game.camera.height) {
            PerformOpen(this, false, true);
        } 
    }

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
    if(d.state !== d.Closed) return;

    //if they attack the back side of the door
    if(frauki.Attacking() && frauki.GetCurrentDamage() > 0) {
        if((d.facing === 'left' && f.body.center.x > d.body.center.x) || (d.facing === 'right' && f.body.center.x < d.body.center.x) || !!override) {
            PerformOpen(d, true);
            console.log('Opening door with attack:' + d.id);

            effectsController.ExplodeDoorSeal(d);
            effectsController.ScreenFlash();
            
        }
    }
    

    //or if its a shard door and they are holding the right shard
    if(d.prism === GetCurrentShardType() && !d.waitingToOpen) {

        d.waitingToOpen = true;

        //get the prism frauki is carrying
        var prism = frauki.carriedShard;

        prism.openingDoor = true;

        //tween its position to the center of the door
        var shardTween = game.add.tween(prism.body).to({x: d.body.x + 0, y: d.body.y + 24}, 1000, Phaser.Easing.Exponential.Out, true);
        shardTween.onComplete.add(function() {
            //when the tween is done, perform the door opening
            effectsController.ScreenFlash();
            PerformOpen(d, true);
            prism.openingDoor = false;
        });

        console.log('Opening door with prism shard:' + d.id);
    }
    
};

function OpenDoorById(id) {

    var door = null;

    //find the door
    Frogland.objectGroup_2.forEach(function(d) {
        if(d.spriteType === 'door' && d.id === id) {
            door = d;
            return false;
        }
    });

    Frogland.objectGroup_3.forEach(function(d) {
        if(d.spriteType === 'door' && d.id === id) {
            door = d;
            return false;
        }
    });

    Frogland.objectGroup_4.forEach(function(d) {
        if(d.spriteType === 'door' && d.id === id) {
            door = d;
            return false;
        }
    });

    if(!!door) {
        PerformOpen(door, false);
        console.log('Opening door by id: ' + id);
    } else {
        console.log('Cant find door with id: ' + id);
    }
};

function PerformOpen(d, save, silent) {
    if(d.state !== d.Closed) return;

    //check that the door has received enough attempts to actually open
    if(++d.openAttempts < d.thresholdAttempts) {
        console.log('Door open failed, attempt ' + d.openAttempts + ' / ' + d.thresholdAttempts);
        return;
    }

    var movementTarget = d.body.y - 64;

    if(!!d.open_direction && d.open_direction === 'down') {
        movementTarget = d.body.y + 64;
    }

    d.state = d.Opening;

    var openDuration = 3000;

    //play a sound if one is specified
    if(!silent) {
        if(!!d.open_sound) {
            events.publish('play_sound', {name: d.open_sound, restart: true });
        } else if(!!d.facing) {
            events.publish('play_sound', {name: 'door_break', restart: true });
        }

        openDuration = 5000;
        events.publish('camera_shake', {magnitudeX: 0.4, magnitudeY: 0, duration: 5000 });

        events.publish('play_sound', {name: 'door_rumble', restart: true });
        events.publish('fade_music', { volume: 0.1, duration: 5000 });
        setTimeout(function() {
            //play sound
        }, 2000);
    }

    var openTween = game.add.tween(d.body).to({y: movementTarget}, openDuration, Phaser.Easing.Quintic.InOut, true);

    if(save) {
        GameData.AddOpenDoor(d.id);
    }
};

Door.prototype.PlayAnim = function(name) {
    if(this.animations.currentAnim.name !== name)
        this.animations.play(name);
};

Door.prototype.Closed = function() {

    this.PlayAnim(this.GetGraphicName());
};

Door.prototype.Opening = function() {
    
    this.PlayAnim(this.GetGraphicName());

    this.state = this.Open;
};

Door.prototype.Open = function() {
};

Door.prototype.GetGraphicName = function() {

    if(this.closed_graphic === 'orb') {
        return 'orb_' + this.thresholdAttempts + '_' + this.openAttempts;
    }

    if(this.state === this.Open || this.state === this.Opening) {
        if(!!this.open_graphic) {
            return this.open_graphic;
        } else if(!!this.closed_graphic) {
            return this.closed_graphic;
        } else if(this.facing === 'left') {
            return 'left_dead';
        } else if(this.facing === 'right') { 
            return 'right_dead';
        } else if(this.prism === 'Wit') {
            return 'wit_open';
        } else if(this.prism === 'Will') {
            return 'will_open';
        } else if(this.prism === 'Luck') {
            return 'luck_open';
        } else if(this.prism === 'Power') {
            return 'power_open';
        }
        
    } else {

        if(!!this.closed_graphic) {
            return this.closed_graphic;
        } else if(this.facing === 'left') {
            return 'left';
        } else if(this.facing === 'right') { 
            return 'right';
        } else if(this.prism === 'Wit') {
            return 'wit';
        } else if(this.prism === 'Will') {
            return 'will';
        } else if(this.prism === 'Luck') {
            return 'luck';
        } else if(this.prism === 'Power') {
            return 'power';
        }
    }
};