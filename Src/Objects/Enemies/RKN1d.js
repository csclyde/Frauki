Enemy.prototype.types['RKN1d'] =  function() {

    this.body.setSize(40, 45, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['RKN1d/Idle0000', 'RKN1d/Idle0001', 'RKN1d/Idle0002', 'RKN1d/Idle0003'], 10, true, false);
    this.animations.add('pre_jump', ['RKN1d/Jump0000', 'RKN1d/Jump0001', 'RKN1d/Jump0002'], 16, false, false);
    this.animations.add('jump', ['RKN1d/Jump0003', 'RKN1d/Jump0004', 'RKN1d/Jump0005'], 12, false, false);
    this.animations.add('attack', ['RKN1d/Bite0001', 'RKN1d/Bite0002', 'RKN1d/Bite0003', 'RKN1d/Bite0004', 'RKN1d/Bite0005'], 16, false, false);
    this.animations.add('flip_up', ['RKN1d/FlipUp0001', 'RKN1d/FlipUp0002', 'RKN1d/FlipUp0003', 'RKN1d/FlipUp0004'], 28, false, false);

    this.damage = 1;
    this.energy = 2;

    //this.body.maxVelocity.y = 500;

    this.robotic = true;
    this.clingDir = 'none';

    this.SetAttackTimer(0);

    this.collideWithPlayer = function() {
        return this.state !== this.Escaping;
    };

    this.updateFunction = function() {
        if(this.clingDir === 'none') {
            this.body.moves = true;
        }
        else {
            this.body.moves = false;
        }

        if(this.clingDir === 'up') {
            this.angle = 180;
        } else if(this.clingDir === 'left') {
            this.angle = 90;
            this.scale.x = 1;
        } else if(this.clingDir === 'right') {
            this.angle = -90;
            this.scale.x = 1;
        } else {
            this.angle = 0;
        }

        if(this.body.onFloor()) {
            this.body.drag.setTo(800);
        }
        else {
            this.body.drag.setTo(0);
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {
            
            //if the player is too close or being dangerous
            if(EnemyBehavior.Player.IsNear(this, 50) && !EnemyBehavior.Player.IsDangerous(this) && this.CanAttack()) {
                this.Bite();
            }
            else if(EnemyBehavior.Player.IsDangerous(this) || (EnemyBehavior.Player.IsNear(this, 200) && EnemyBehavior.Player.MovingTowards(this))) {
                if(this.timers.TimerUp('escape_wait')) {
                    this.Escape();
                } else {
                    this.state = this.Idling;
                }
            
            } else if(EnemyBehavior.Player.IsInVulnerableFrame(this) && this.timers.TimerUp('hop_wait')) {
                this.Hop();
            
            } else {
                this.state = this.Idling;
            }

        } else {
            this.state = this.Idling;
        }
    };

    this.LandHit = function() {
    };

    this.OnHit = function() {
        this.DropOff();
    }

    this.DropOff = function() {
        this.clingDir = 'none';
    }

    this.IsGrounded = function() {
        return (this.body.onFloor() || this.clingDir === 'up' || this.clingDir === 'left' || this.clingDir === 'right');
    }

    this.Vulnerable = function() {
        return this.state !== this.Escaping && this.state !== this.PreEscaping;
    }

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {
        this.timers.SetTimer('attack', 100);
        this.timers.SetTimer('hop_wait', game.rnd.between(3000, 5000));
        this.state = this.PreHopping;
    };

    this.Bite = function() {
        this.DropOff();
        EnemyBehavior.FacePlayer(this);

        this.state = this.Biting;
    };

    this.Escape = function() {
        this.state = this.PreEscaping;
        this.timers.SetTimer('escape', 100);
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.PreEscaping = function() {
        this.PlayAnim('pre_jump');

        if(this.timers.TimerUp('escape')) {
            if(this.body.onFloor()) {
                if(frauki.body.onFloor()) {
                    this.body.velocity.set(game.rnd.between(-0.7, 0.7), -1);
                }
                else if(EnemyBehavior.Player.IsAbove(this)) {
                    var dir = EnemyBehavior.RollDice(2, 1);

                    if(dir) {
                        this.body.velocity.set(-1, -0.5);
                    } else {
                        this.body.velocity.set(1, -0.5);
                    }
                }
                else {
                    this.body.velocity.set(frauki.body.velocity.x * -1, -1);
                }
            }
            else if(this.clingDir === 'up') {
                if(EnemyBehavior.Player.IsBelow(this)) {
                    
                    var dir = EnemyBehavior.RollDice(2, 1);
                    
                    if(dir) {
                        this.body.velocity.set(-1, game.rnd.between(0, 0.5));
                    } else {
                        this.body.velocity.set(1, game.rnd.between(0, 0.5));
                    }
                } else {
                    this.body.velocity.set(frauki.body.velocity.x * -1, game.rnd.between(0, 0.3));
                }
            }
            else if(this.clingDir === 'left') {
                if(frauki.body.onFloor()) {
                    this.body.velocity.set(1, -0.5);
                }
                else {
                    this.body.velocity.set(1, game.rnd.between(-0.7, 0.7));
                }
            }
            else if(this.clingDir === 'right') {
                if(frauki.body.onFloor()) {
                    this.body.velocity.set(-1, -0.5);
                } else {
                    this.body.velocity.set(-1, game.rnd.between(-0.7, 0.7));
                }
            }
            else {
                this.body.velocity.set(frauki.body.velocity.x * -1, -1);
            }

            this.body.velocity.setMagnitude(600);
            events.publish('play_sound', {name: 'enemy_jump', restart: true});
            this.clingDir = 'none';
            this.state = this.Escaping;
        }

        return false;
    }

    this.Escaping = function() {
        this.PlayAnim('jump');

        
        if(this.body.onFloor()) {
            this.clingDir = 'none';
            this.body.velocity.y = 0;
        }
        else if(this.body.blocked.up) {
            this.clingDir = 'up';
        }
        else if(this.body.blocked.left) {
            this.clingDir = 'left';
        }
        else if(this.body.blocked.right) {
            this.clingDir = 'right';
        }
        else {
            this.clingDir = 'none';
        }

        // if(this.body.onWall()) {
        //     this.body.gravity.y = -700;
        //     this.body.velocity.setTo(0);

        //     var targetAngle = 0;

        //     if(this.body.blocked.left) {
        //         targetAngle = -90;
        //         this.scale.x = 1;
        //     } else if(this.body.blocked.right) {
        //         targetAngle = 90;
        //         this.scale.x = 1;
        //     }

        //     game.add.tween(this).to({ angle: targetAngle }, 75, Phaser.Easing.Linear.None, true);
        
        // } else if(this.body.blocked.up) {

        //     this.body.gravity.y = -700;
        //     this.body.velocity.setTo(0);

        // }

        if(this.body.onFloor() || this.clingDir !== 'none') {
            this.timers.SetTimer('escape_wait', 800);
            return true;
        } else {
            return false;
        }
    }

    this.PreHopping = function() {
        this.PlayAnim('pre_jump');

        if(this.timers.TimerUp('attack')) {
            this.DropOff();
            this.state = this.Hopping;

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.ChargeAtPlayer(this, 400); 
            
            this.body.velocity.x += frauki.body.velocity.x;
        }

        return false;
    };

    this.Hopping = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('jump');
        }

        return true;
    };

    this.Biting = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished) {
            this.SetAttackTimer(1000);

            this.Escape();
        }

        return false;
    };

    this.Hurting = function() {
        this.PlayAnim('die');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

    this.attackFrames = {

        'RKN1d/Bite0003': {
            x: 20, y: 20, w: 55, h: 35,
            damage: 2,
            knockback: 0,
            priority: 1,
            juggle: 0
        }

    };

};
