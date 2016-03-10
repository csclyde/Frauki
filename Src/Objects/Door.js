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


   
    
    // this.animations.add('orb_2_1', ['DoorOrb0003'], 10, true, false);
    
    
    // this.animations.add('orb_3_1', ['DoorOrb0006'], 10, true, false);
    // this.animations.add('orb_3_2', ['DoorOrb0007'], 10, true, false); 
};

Door.prototype.update = function() {

    if(this.state === this.Closed && this.owningLayer === Frogland.currentLayer && GameData.IsDoorOpen(this.id)) {
        if(this.body.x + this.body.width > game.camera.x && this.body.y + this.body.height > game.camera.y && this.body.x < game.camera.x + game.camera.width && this.body.y < game.camera.y + game.camera.height) {
            PerformOpen(this, false, true);
        } 
    }

    if(!!this.state)
        this.state();
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

    objectController.doorList.forEach(function(d) {
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
    if(d.state !== d.Closed || !d.body) return;

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
    }

    this.openTween = game.add.tween(d.body).to({y: movementTarget}, openDuration, Phaser.Easing.Quintic.InOut, true);

    game.time.events.add(openDuration - (openDuration / 5), function() {
        effectsController.DoorDust({x: d.body.center.x, y: d.body.y + d.body.height - 20 });
    });

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

Door.prototype.Opening = function() {
    this.PlayAnim('open');

    this.state = this.Open;
};

Door.prototype.Open = function() {

    this.PlayAnim('open');
};
