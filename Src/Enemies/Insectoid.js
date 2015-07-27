Enemy.prototype.types['Insectoid'] =  function() {

    this.body.setSize(55, 30, 0, 0);
    this.anchor.setTo(.5, 1);

    this.animations.add('idle', ['Insectoid/Hop0000'], 10, true, false);
    this.animations.add('hop', ['Insectoid/Hop0001', 'Insectoid/Hop0002'], 10, false, false);
    this.animations.add('land', ['Insectoid/Hop0003', 'Insectoid/Hop0004'], 10, false, false);
    this.animations.add('die', ['Insectoid/Die0000', 'Insectoid/Die0001', 'Insectoid/Die0002', 'Insectoid/Die0003'], 10, false, false);

    this.attackTimer = 0;
    this.weight = 0.6;
    this.damage = 5;
    this.energy = 6;

    this.squashTween = null;

    this.preHopPos = {};

    this.body.maxVelocity.y = 500;

    //this.body.bounce.set(0.5);

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(game.physics.arcade.distanceBetween(this, frauki) < 100 && this.state !== this.Hopping && frauki.state === frauki.Hurting) {
            game.physics.arcade.overlap(this, frauki, function() {
                this.Dodge(true);
            }, null, this);
        }

        if(!!this.squashTween && !this.squashTween.isRunning) {
            this.scale.y = 1;
        }

        if(this.state !== this.Diving && this.angle !== 0)
            this.angle = 0;

        if(this.state !== this.Diving && this.body.width !== 55)
            this.body.setSize(55, 35, 0, 0);
    };

    this.CanChangeDirection = function() {
        if(this.state === this.PreScuttling || this.state === this.Scuttling) {
            return false;
        } else {
            return true;
        }
    }

    this.TakeHit = function() {
    }

    this.CanCauseDamage = function() {
        if(this.state === this.Hopping || this.state === this.Scuttling || this.state === this.Diving || this.state === this.Landing) {
            return true;
        } else {
            return false;
        }
    }

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        if(game.time.now < this.attackTimer || this.state === this.PreHopping || this.state === this.Hopping || this.state === this.Landing)
            return;

        this.attackTimer = game.time.now + 500;
        this.state = this.PreHopping;
        this.squashTween = game.add.tween(this.scale).to({y: 0.7}, 500, Phaser.Easing.Exponential.Out, true);
        //this.scale.y = 0.7;

        this.preHopPos.x = this.body.center.x;
        this.preHopPos.y = this.body.center.y;

    };

    this.Scuttle = function() {
        if(game.time.now < this.attackTimer)
            return;

        if(frauki.body.center.x < this.body.center.x) {
            this.SetDirection('left');
        } else {
            this.SetDirection('right');
        }       

        this.attackTimer = game.time.now + 600;
        this.squashTween = game.add.tween(this.scale).to({x: this.GetDirMod() * 0.7}, 600, Phaser.Easing.Exponential.Out, true);
        this.state = this.PreScuttling;

        
    };

    this.Dodge = function(overrideFloorCondition) {
        if(game.time.now < game.attackTimer && (!this.body.onFloor() || !!overrideFloorCondition))
            return;

        this.attackTimer = game.time.now + 800;

        this.state = this.Hopping;

        this.body.velocity.y = -200;

        if(frauki.body.center.x < this.body.center.x) {
            this.body.velocity.x = 200;
        } else {
            this.body.velocity.x = -200;
        }   
    };

    this.Dive = function() {

        if(!this.timers.TimerUp('dive')) {
            return;
        }

        this.state = this.Diving;
        this.body.velocity.y = 300;
        this.body.velocity.x = 0;
        this.body.setSize(35, 55, 0, 0);
        this.scale.x = 1;
        game.add.tween(this).to({angle: 90}, 100, Phaser.Easing.Exponential.Out, true);
        //this.angle = 90;  

        this.timers.SetTimer('dive', 1000);
    };

    this.Flee = function() {
        this.state = this.Fleeing;

        if(this.PlayerDirection() === 'left') {
            this.body.velocity.x = 500;
        } else if(this.PlayerDirection() === 'right') {
            this.body.velocity.x = -500;
        } else {
            this.Dodge();
        }
    }

    this.TakeHit = function(power) {

        this.scale.y = 1;
        this.attackTimer = 0;
        
        //if(this.RollDice(10, 3))
            //this.Dodge();
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        if(this.PlayerIsNear(50)) {
            this.Scuttle();
        } else if(this.body.center.y < frauki.body.y && this.body.center.x > frauki.body.center.x - 20 && 
                  this.body.center.x < frauki.body.center.x + 20 && 
                  !this.body.onFloor()) {

            this.Dive();

        } else if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && 
                  Math.abs(this.body.center.x - frauki.body.center.y) < 400 && 
                  (this.body.onFloor() || this.body.velocity.y <= 0)) {

            this.Scuttle();

        } else if(Math.abs(this.body.center.x - frauki.body.center.x) > 50 && 
                  Math.abs(this.body.center.x - frauki.body.center.x) < 450 &&
                  this.body.onFloor()) {

            this.Hop();

        } else {

        }
    };

    this.PreHopping = function() {
        this.PlayAnim('idle');

        if(frauki.body.center.x < this.body.center.x) {
            this.SetDirection('left');
        } else {
            this.SetDirection('right');
        }

        if(game.time.now > this.attackTimer) {
            this.attackTimer = game.time.now + 1000;
            this.state = this.Hopping;
            this.scale.y = 1;

            this.xHitVel = 0;

            //parabolic arc
            //the duration of the hop is a function of how far apart the bug and
            //frauki are. The max time should be approx 1 second.
            var duration = this.PlayerDistance() / 500;
            this.body.velocity.x = (frauki.body.center.x - this.body.center.x) / duration;
            this.body.velocity.y = (frauki.body.center.y + -0.5 * game.physics.arcade.gravity.y * duration * duration - this.body.center.y) / duration;

        }
    };

    this.Hopping = function() {
        this.PlayAnim('hop');

        if(this.body.velocity.y >= 0 || this.body.onFloor()) {

            if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.y) < 400) {
                this.Scuttle();
            } else if(this.body.onFloor()) {
                this.state = this.Idling;
            } else {
                this.state = this.Landing;
            }

        }
    };

    this.Landing = function() {
        this.PlayAnim('land');

        if(this.body.onFloor() || this.body.velocity.y <= 0) {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.PreScuttling = function() {
        this.PlayAnim('idle');      

        if(game.time.now > this.attackTimer) {
            this.attackTimer = game.time.now + 800;
            this.state = this.Scuttling;
            this.scale.x = this.GetDirMod();

            if(this.direction === 'left') {
                this.body.velocity.x = -450;
            } else {
                this.body.velocity.x = 450;
            }   
        }
    };

    this.Scuttling = function() {
        this.PlayAnim('idle');

        if(game.physics.arcade.intersects(this.body, frauki.body) || game.time.now > this.attackTimer) {
            this.state = this.Idling;
            game.add.tween(this.body.velocity).to({x: 0}, 100, Phaser.Easing.Sinusoidal.Out, true);
        }
    };

    this.Diving = function() {
        if(frauki.body.center.x < this.body.center.x)
            this.body.center.x--;
        else if(frauki.body.center.x > this.body.center.x)
            this.body.center.x++;
        
        if(this.body.onFloor() || this.body.velocity.y <= 0) {
            this.state = this.Idling;
        }
    };

    this.Fleeing = function() {

        if(this.PlayerDistance() > 400 || this.body.touching.left || this.body.touching.right) {
            if(Math.abs(this.body.center.y - frauki.body.center.y) < 40) {
                this.Scuttle();
            } else {
                this.state = this.Idling;
            }
        }
    };

    this.Hurting = function() {
        this.PlayAnim('die');

        if(this.timers.TimerUp('hit')) {

            var move = Math.random() * 3;

            if(move < 1) {
                this.Dodge(true);
            } else if(move < 2) {
                this.Hop();
            } else {
                this.state = this.Idling;
            }

            // if(Math.abs(this.body.center.y - frauki.body.center.y) < 40 && Math.abs(this.body.center.x - frauki.body.center.x) < 300 && this.RollDice(20, 12)) {
            //     this.Scuttle();
            //     this.attackTimer = game.time.now;
            // }
            // else if(Math.abs(this.body.center.x - frauki.body.center.x) > 100 && Math.abs(this.body.center.x - frauki.body.center.x) < 450 && this.RollDice(20, 10)) {
            //     this.Hop();
            //     this.attackTimer = game.time.now;
            // }
            // else {
            //     this.state = this.Idling;
            // }
        }
    };

};
