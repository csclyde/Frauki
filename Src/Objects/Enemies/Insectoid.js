Enemy.prototype.types['Insectoid'] =  function() {

    this.body.setSize(55, 30, 0, 10);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Insectoid/Hop0000'], 10, true, false);
    this.animations.add('hop', ['Insectoid/Hop0001', 'Insectoid/Hop0002', 'Insectoid/Hop0003', 'Insectoid/Hop0004'], 10, false, false);
    this.animations.add('die', ['Insectoid/Die0000', 'Insectoid/Die0001', 'Insectoid/Die0002', 'Insectoid/Die0003'], 10, false, false);

    this.attackTimer = 0;
    this.damage = 2;
    this.energy = 30;

    this.squashTween = null;

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

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            if(this.body.onFloor()) {

                if(EnemyBehavior.Player.IsDangerous(this)) {
                    this.Dodge();
                } 
                else if(EnemyBehavior.Player.IsNear(this, 50)) {
                    
                    if(EnemyBehavior.RollDice(2, 1)) {
                        this.Scuttle();
                    } else {
                        this.Hop();
                    }
                } 
                else if(!frauki.body.onFloor()) {

                    
                    this.Hop();
                } else {
                    this.Hop();
                }

            } else {
                if(EnemyBehavior.Player.IsBelow(this)) {
                    this.Dive();
                }
            }

            
            
            

        } else {
            this.state = this.Idling;
        }
    };

    this.CanCauseDamage = function() {
        if(this.state === this.Hopping || this.state === this.Scuttling || this.state === this.Diving) {
            return true;
        } else {
            return false;
        }
    }

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        if(game.time.now < this.attackTimer)
            return;

        EnemyBehavior.FacePlayer(this);

        this.attackTimer = game.time.now + 500;
        this.state = this.PreHopping;
        //this.squashTween = game.add.tween(this.scale).to({y: 0.7}, 500, Phaser.Easing.Exponential.Out, true);
        //this.scale.y = 0.7;
    };

    this.Scuttle = function() {
        if(game.time.now < this.attackTimer)
            return;

        EnemyBehavior.FacePlayer(this);      

        this.attackTimer = game.time.now + 600;
        //this.squashTween = game.add.tween(this.scale).to({x: EnemyBehavior.GetDirMod(this) * 0.7}, 600, Phaser.Easing.Exponential.Out, true);
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
    };

    this.TakeHit = function(power) {

        this.scale.y = 1;
        this.attackTimer = 0;
        
        //if(this.RollDice(10, 3))
            //this.Dodge();
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        if(game.time.now > this.attackTimer) {
            return true;
        } else {
            return false;
        }
    };

    this.PreHopping = function() {
        this.PlayAnim('idle');

        if(game.time.now > this.attackTimer) {
            this.state = this.Hopping;
            this.scale.y = 1;

            this.attackTimer = game.time.now + 1200;

            if(EnemyBehavior.RollDice(5, 3)) {
                EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y); 
            } else {
                EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y - 15);
            }

        }
    };

    this.Hopping = function() {
        this.PlayAnim('hop');

        if(EnemyBehavior.Player.IsBelow(this)) {
            this.Dive();
        }

        if(this.body.velocity.y >= 0 || this.body.onFloor()) {
            this.state = this.Idling;
        }
    };

    this.PreScuttling = function() {
        this.PlayAnim('idle');      

        if(game.time.now > this.attackTimer) {
            this.attackTimer = game.time.now + 800;
            this.state = this.Scuttling;
            this.scale.x = EnemyBehavior.GetDirMod(this);

            if(this.direction === 'left') {
                this.body.velocity.x = -550;
            } else {
                this.body.velocity.x = 550;
            }   
        }
    };

    this.Scuttling = function() {
        this.PlayAnim('idle');

        if(game.physics.arcade.intersects(this.body, frauki.body) || game.time.now > this.attackTimer) {
            return true;
        }
    };

    this.Diving = function() {
        if(frauki.body.center.x < this.body.center.x)
            this.body.center.x--;
        else if(frauki.body.center.x > this.body.center.x)
            this.body.center.x++;
        
        if(this.body.onFloor() || this.body.velocity.y <= 0) {
            return true;
        }
    };

    this.Fleeing = function() {

        if(EnemyBehavior.Player.Distance(this) > 400 || this.body.onWall()) {
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
                return true;
            }

        }
    };

};
