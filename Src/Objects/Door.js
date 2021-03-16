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
    events.subscribe('open_door', function(params) {
        if(this.id === params.door_name) {
            this.PerformOpen(false);
        }
    }, this);

    events.subscribe('close_enemy_door', function(params) {
        if(this.id === params.door && this.type === 'enemy_start') {
            this.PerformClose(false);
        }
    }, this);

    events.subscribe('enemy_killed', function(params) {

    }, this);

    if(GameData.IsDoorOpen(this.id)) {
        if(this.stay_open) {
            this.ForceOpenDoor();
        } else {
            this.state = this.ReadyToOpen;
        }
    } else if(this.type == 'enemy_start') {
        this.ForceOpenDoor();        
    } else {
        this.state = this.Closed;
    }

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

        case 'dark_seal':
            if(this.facing === 'left') {
                this.animations.add('closed', ['DoorDark0000', 'DoorDark0001', 'DoorDark0002', 'DoorDark0003', 'DoorDark0004'], 10, true, false);
                this.animations.add('open', ['DoorDark0010'], 10, true, false);
            } else {
                this.animations.add('closed', ['DoorDark0005', 'DoorDark0006', 'DoorDark0007', 'DoorDark0008', 'DoorDark0009'], 10, true, false);
                this.animations.add('open', ['DoorDark0011'], 10, true, false);
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

        case 'tenements_seal':
            if(this.facing === 'left') {
                this.animations.add('closed', ['DoorTenements0000', 'DoorTenements0001', 'DoorTenements0002', 'DoorTenements0003', 'DoorTenements0004'], 10, true, false);
                this.animations.add('open', ['DoorTenements0010'], 10, true, false);
            } else {
                this.animations.add('closed', ['DoorTenements0005', 'DoorTenements0006', 'DoorTenements0007', 'DoorTenements0008', 'DoorTenements0009'], 10, true, false);
                this.animations.add('open', ['DoorTenements0011'], 10, true, false);
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
            this.animations.add('closed', ['DoorEnemy0001'], 10, true, false);
            this.animations.add('open', ['DoorEnemy0000'], 10, true, false);
        break;

        case 'enemy_start':
            this.animations.add('closed', ['DoorEnemy0001'], 10, true, false);
            this.animations.add('open', ['DoorEnemy0000'], 10, true, false);
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

    if(this.state === this.ReadyToOpen && cameraController.IsObjectOnScreen(this, 50)) {
        this.PerformOpen(false, true);
    }

    if(!!this.state)
        this.state();
};

Door.prototype.collideWithPlayer = function(f) {
    this.OpenDoor(f);

    return !(frauki.state === frauki.Rolling && this.canRollUnder === true);
};

Door.prototype.OpenDoor = function(f) {
    if(this.state !== this.Closed) return;

    //if they attack the back side of the door
    if(frauki.Attacking() && frauki.GetCurrentDamage() > 0) {
        if((this.facing === 'left' && f.body.center.x > this.body.center.x) || (this.facing === 'right' && f.body.center.x < this.body.center.x)) {
            this.PerformOpen(true);

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
        var prism = objectController.shardList.find(function(s) { return s.name === this.prism; }, this);

        prism.beingUsed = true;
        prism.x = this.body.x + 9;
        prism.y = this.body.y + 31;

        prism.scale.x = 0.1;
        prism.scale.y = 0.1;


        //tween its position to the center of the door
        var shardTween = game.add.tween(prism.scale).to({x: 1, y: 1}, 2000, Phaser.Easing.Exponential.Out, true);
        shardTween.onComplete.add(function() {
            //when the tween is done, perform the door opening
            effectsController.ScreenFlash();
            this.PerformOpen(true);
            prism.beingUsed = false;
        }, this);
    }  
};

Door.prototype.ForceOpenDoor = function() {
    if(!!this.open_direction && this.open_direction === 'down') {
        this.y += 80;
    } else {
        this.y -= 64;
    }

    this.state = this.Open;
}

Door.prototype.PerformOpen = function(save, silent) {
    if(this.state === this.Open || !this.body) return;

    //check that the door has received enough attempts to actually open
    if(++this.openAttempts < this.thresholdAttempts) {
        console.warn('Door open failed, attempt ' + this.openAttempts + ' / ' + this.thresholdAttempts);
        return;
    }
    //if an enemy door is being opened, the fight is over
    else if(this.type === 'enemy') {
        ScriptRunner.run('end_fight', { door: this.name, song: this.song });
    }

    var movementTarget = this.body.y - 64;

    if(!!this.open_direction && this.open_direction === 'down') {
        movementTarget = this.body.y + 80;
    }

    this.state = this.Open;

    var openDuration = 2500;

    //play a sound if one is specified
    if(!silent) {
        switch(this.type) {

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
                events.publish('play_sound', {name: 'crystal_door', restart: true });
                
            break;
        }    

        openDuration = 2500;
        events.publish('camera_shake', {magnitudeX: 0.4, magnitudeY: 0, duration: openDuration });

        //events.publish('fade_music', { volume: 0.1, duration: openDuration });
    }

    events.publish('play_sound', {name: 'door_rumble', restart: false });

    //events.publish('door_open_start', { id: this.id} );
    
    this.openTween = game.add.tween(this.body).to({y: movementTarget}, openDuration, Phaser.Easing.Quintic.InOut, true);

    game.time.events.add(openDuration - (openDuration / 5), function() {
        if(!this || !this.body) return;
        
        effectsController.DoorDust({x: this.body.center.x, y: this.body.y + this.body.height - 20 });
        events.publish('play_sound', {name: 'door_slam', restart: true });
        events.publish('stop_sound', {name: 'door_rumble', restart: true });
        //events.publish('door_open_finish', { id: this.id } );
        this.canRollUnder = false;

    }, this);

    //note when the door is ready to roll through
    game.time.events.add(openDuration / 2.5, function() {
        this.canRollUnder = true;
    }, this);

    if(save) {
        GameData.AddOpenDoor(this.id);
    }
};

Door.prototype.PerformClose = function() {
    if(this.state === this.Closed || !this.body) return;

    var movementTarget = this.body.y + 64;

    if(!!this.open_direction && this.open_direction === 'down') {
        movementTarget = this.body.y - 80;
    }

    this.state = this.Closed;

    var openDuration = 1000;
    events.publish('play_sound', {name: 'skull_door', restart: true });
    events.publish('camera_shake', {magnitudeX: 0.4, magnitudeY: 0, duration: openDuration });
    //events.publish('fade_music', { volume: 0.1, duration: openDuration });
    events.publish('play_sound', {name: 'door_rumble', restart: false });

    events.publish('door_open_start', { id: this.id} );
    
    this.closeTween = game.add.tween(this.body).to({y: movementTarget}, openDuration, Phaser.Easing.Quintic.In, true);

    game.time.events.add(openDuration, function() {
        if(!this || !this.body) return;
        
        effectsController.DoorDust({x: this.body.center.x, y: this.body.y + this.body.height - 20 });
        events.publish('play_sound', {name: 'door_slam', restart: true });
        events.publish('stop_sound', {name: 'door_rumble', restart: true });

    }, this);
};

Door.prototype.PlayAnim = function(name) {
    this.animations.play(name);
};

Door.prototype.ReadyToOpen = function() {
    this.PlayAnim('open');
};

Door.prototype.Open = function() {

    this.PlayAnim('open');
};

Door.prototype.Closed = function() {
    //if the door takes a few events to open, and they have completed at least one
    if(this.thresholdAttempts > 1 && this.openAttempts > 0) {
        this.PlayAnim('attempt_' + this.openAttempts);
    } else {
        this.PlayAnim('closed');
    }
};
