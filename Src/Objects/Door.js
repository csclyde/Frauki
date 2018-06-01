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
    this.canRollUnder = false;
};

Door.prototype = Object.create(Phaser.Sprite.prototype);
Door.prototype.constructor = Door;

Door.prototype.create = function() {
    switch(this.type) {

        case 'stone_seal':
            if(this.facing === 'left') {
                this.animations.add('closed', ['DoorSeal0000', 'DoorSeal0001', 'DoorSeal0002', 'DoorSeal0003', 'DoorSeal0004'], 10, true, false);
                this.animations.add('open', ['DoorSeal0010'], 10, true, false);
            } else {
                this.animations.add('closed', ['DoorSeal0005', 'DoorSeal0006', 'DoorSeal0007', 'DoorSeal0008', 'DoorSeal0009'], 10, true, false);
                this.animations.add('open', ['DoorSeal0011'], 10, true, false);
            }
        break;


        case 'metal_seal':
            if(this.facing === 'left') {
                this.animations.add('closed', ['DoorMetal0000', 'DoorMetal0001', 'DoorMetal0002', 'DoorMetal0003', 'DoorMetal0004'], 10, true, false);
                this.animations.add('open', ['DoorMetal0010'], 10, true, false);
            } else {
                this.animations.add('closed', ['DoorMetal0005', 'DoorMetal0006', 'DoorMetal0007', 'DoorMetal0008', 'DoorMetal0009'], 10, true, false);
                this.animations.add('open', ['DoorMetal0011'], 10, true, false);
            }
        break;


        case 'shard':
            if(this.prism === 'Wit') {
                this.animations.add('closed', ['DoorPrism0000'], 10, true, false);
                this.animations.add('open', ['DoorPrism0004'], 10, true, false);
            } else if(this.prism === 'Will') {
                this.animations.add('closed', ['DoorPrism0001'], 10, true, false);
                this.animations.add('open', ['DoorPrism0005'], 10, true, false);
            } else if(this.prism === 'Luck') {
                this.animations.add('closed', ['DoorPrism0002'], 10, true, false);
                this.animations.add('open', ['DoorPrism0006'], 10, true, false);
            } else if(this.prism === 'Power') {
                this.animations.add('closed', ['DoorPrism0003'], 10, true, false);
                this.animations.add('open', ['DoorPrism0007'], 10, true, false);
            }
        break;


        case 'enemy':
            this.animations.add('closed', ['DoorEnemy0000'], 10, true, false);
            this.animations.add('open', ['DoorEnemy0001'], 10, true, false);
        break;


        case 'mystery':
            this.animations.add('closed', ['DoorMystery0000'], 10, true, false);
            this.animations.add('open', ['DoorMystery0000'], 10, true, false);
        break;


        case 'heal':
            this.animations.add('closed', ['DoorApple0000'], 10, true, false);
            this.animations.add('open', ['DoorApple0000'], 10, true, false);
        break;


        case 'orb':
            if(this.thresholdAttempts == 1) {
                this.animations.add('closed', ['DoorOrb0000'], 10, true, false);
                this.animations.add('open', ['DoorOrb0001'], 10, true, false);
            } else if(this.thresholdAttempts == 2) {
                this.animations.add('closed', ['DoorOrb0002'], 10, true, false);
                this.animations.add('attempt_1', ['DoorOrb0003'], 10, true, false);
                this.animations.add('open', ['DoorOrb0004'], 10, true, false);
            } else if(this.thresholdAttempts == 3) {
                this.animations.add('closed', ['DoorOrb0005'], 10, true, false);
                this.animations.add('attempt_1', ['DoorOrb0006'], 10, true, false);
                this.animations.add('attempt_2', ['DoorOrb0007'], 10, true, false);
                this.animations.add('open', ['DoorOrb0008'], 10, true, false);
            }
        break;


        default:
            this.animations.add('closed', ['DoorMystery0000'], 10, true, false);
            this.animations.add('open', ['DoorMystery0000'], 10, true, false);
        break;
    }

};

Door.prototype.update = function() {

    var padding = 50;

    if((this.state === this.Closed || this.state == this.ReadyToOpen) && this.owningLayer === Frogland.currentLayer && GameData.IsDoorOpen(this.id)) {
        if(this.body.x + this.body.width > game.camera.x + padding && this.body.y + this.body.height > game.camera.y + padding && this.body.x < game.camera.x + game.camera.width - padding && this.body.y < game.camera.y + game.camera.height - padding) {
            PerformOpen(this, false, true);
        } else if(this.body.x + this.body.width > game.camera.x && this.body.y + this.body.height > game.camera.y && this.body.x < game.camera.x + game.camera.width && this.body.y < game.camera.y + game.camera.height) {
            this.state = this.ReadyToOpen;
        } 
    }

    if(!!this.state)
        this.state();
};

Door.prototype.collideWithPlayer = function(f) {
    this.OpenDoor(f);

    return (frauki.state === frauki.Rolling && this.canRollUnder === true);
};

Door.prototype.OpenDoor = function(f) {
    if(this.state !== this.Closed) return;

    //if they attack the back side of the door
    if(frauki.Attacking() && frauki.GetCurrentDamage() > 0) {
        if((this.facing === 'left' && f.body.center.x > this.body.center.x) || (this.facing === 'right' && f.body.center.x < this.body.center.x)) {
            PerformOpen(this, true);

            effectsController.ExplodeDoorSeal(this);
            effectsController.ScreenFlash();

            if(!!this.script) {
                ScriptRunner.run(this.script);
            }
        }
    }
    

    //or if its a shard door and they are holding the right shard
    if(GameData.HasShard(this.prism) && !this.waitingToOpen) {

        this.waitingToOpen = true;

        //get the prism for this door
        var prism = null;

        objectController.shardList.forEach(function(s) {
            if(s.name === this.prism) {
                prism = s;
            }
        })

        prism.beingUsed = true;
        prism.body.x = game.camera.x;
        prism.body.y = game.camera.y + game.camera.height;

        prism.opacity = 0;

        //tween its position to the center of the door
        var shardTween = game.add.tween(prism.body).to({x: this.body.x + 0, y: this.body.y + 24}, 2000, Phaser.Easing.Exponential.Out, true);
        shardTween.onComplete.add(function() {
            //when the tween is done, perform the door opening
            effectsController.ScreenFlash();
            PerformOpen(d, true);
            prism.ReturnToUI();
        });
    }  
};

function OpenDoorById(id) {

    var door = null;

    objectController.doorList.forEach(function(d) {
        if(d.spriteType === 'door' && d.id === id) {
            door = d;
            return false;
        }
    });

    if(!!door) {
        PerformOpen(door, false);
    } else {
        console.log('Cant find door with id: ' + id);
    }
};

function ForceOpenDoor(d) {
    if(!!d.open_direction && d.open_direction === 'down') {
        d.y += 80;
    } else {
        d.y -= 64;
    }

    d.state = d.Open;
}

function PerformOpen(d, save, silent) {
    if(d.state === d.Open || !d.body) return;

    //check that the door has received enough attempts to actually open
    if(++d.openAttempts < d.thresholdAttempts) {
        console.log('Door open failed, attempt ' + d.openAttempts + ' / ' + d.thresholdAttempts);
        return;
    }

    var movementTarget = d.body.y - 64;

    if(!!d.open_direction && d.open_direction === 'down') {
        movementTarget = d.body.y + 80;
    }

    d.state = d.Open;

    var openDuration = 2500;

    //play a sound if one is specified
    if(!silent) {
        switch(d.type) {

            case 'stone_seal':
                events.publish('play_sound', {name: 'door_break', restart: true });
            break;

            case 'metal_seal':
                events.publish('play_sound', {name: 'door_break', restart: true });
            break;

            case 'shard':
                events.publish('play_sound', {name: 'crystal_door', restart: true });
            break;

            case 'enemy':
                events.publish('play_sound', {name: 'skull_door', restart: true });
            break;

            case 'mystery':
            break;

            case 'heal':
            break;

            case 'orb':
                events.publish('play_sound', {name: 'fanfare_short', restart: true });
            break;
        }    

        openDuration = 2500;
        events.publish('camera_shake', {magnitudeX: 0.4, magnitudeY: 0, duration: openDuration });

        events.publish('fade_music', { volume: 0.1, duration: openDuration });
    }

    events.publish('play_sound', {name: 'door_rumble', restart: true });

    events.publish('door_open_start', { id: d.id} );
    
    this.openTween = game.add.tween(d.body).to({y: movementTarget}, openDuration, Phaser.Easing.Quintic.InOut, true);

    game.time.events.add(openDuration - (openDuration / 5), function() {
        if(!d || !d.body) return;
        
        effectsController.DoorDust({x: d.body.center.x, y: d.body.y + d.body.height - 20, owningLayer: d.owningLayer });
        events.publish('play_sound', {name: 'door_slam', restart: true });
        events.publish('stop_sound', {name: 'door_rumble', restart: true });
        events.publish('door_open_finish', { id: d.id } );
        d.canRollUnder = false;

    });

    //note when the door is ready to roll through
    game.time.events.add(openDuration / 2.5, function() {
        this.canRollUnder = true;
    }, d);

    if(save) {
        GameData.AddOpenDoor(d.id);
    }
};

Door.prototype.PlayAnim = function(name) {
    this.animations.play(name);
};

Door.prototype.Closed = function() {
    //if the door takes a few events to open, and they have completed at least one
    if(this.thresholdAttempts > 1 && this.openAttempts > 0) {
        this.PlayAnim('attempt_' + this.openAttempts);
    } else {
        this.PlayAnim('closed');
    }
};

Door.prototype.ReadyToOpen = function() {

    this.PlayAnim('open');
};

Door.prototype.Open = function() {

    this.PlayAnim('open');
};
