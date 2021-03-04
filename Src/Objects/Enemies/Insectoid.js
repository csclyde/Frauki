Enemy.prototype.types['Insectoid'] =  function() {

    this.body.setSize(50, 25, 0, 10);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Insectoid/Hop0000'], 10, true, false);
    this.animations.add('spin', ['Insectoid/Spin0000'], 10, true, false);
    this.animations.add('hop', ['Insectoid/Hop0000', 'Insectoid/Hop0001', 'Insectoid/Hop0002'], 10, false, false);
    this.animations.add('die', ['Insectoid/Die0000'], 10, false, false);

    this.damage = 1;
    this.energy = 2;

    this.body.maxVelocity.y = 500;

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(this.state === this.Hopping && !this.body.onFloor()) {
            this.body.drag.x = 50;
        } else {
            this.body.drag.x = 600;
        }

        if(this.animations.currentAnim.name === 'spin') {
            events.publish('play_sound', {name: 'Insectoid_attack', restart: false});
            
            if(this.direction === 'left') {
                this.angle -= 20;
            } else {
                this.angle += 20;
            }
        } else {
            events.publish('stop_sound', {name: 'Insectoid_attack'});

            this.angle = 0;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            //if theyre stunned, seize the opportunity
            if(EnemyBehavior.Player.IsStunned(this)) {
                this.Hop();

            } else if(this.body.onFloor()) {
                if(this.timers.TimerUp('dodge') && EnemyBehavior.Player.IsDangerous(this)) {
                    this.Dodge();
                }
                else if(EnemyBehavior.Player.IsNear(this, 20)) {
                    this.Dodge();
                }
                else if(this.CanAttack() && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.IsNear(this, 50)) {
                    if(!frauki.body.onFloor()) {
                        this.Hop();
                    } 
                    else {
                        if(EnemyBehavior.RollDice(2, 1) || EnemyBehavior.Player.IsNear(this, 40)) {
                            this.Scuttle();
                        } else {
                            this.Hop();
                        }
                    }
                } else {
                    this.state = this.Idling;
                }

            } else {
                if(this.CanAttack() && EnemyBehavior.Player.IsBelow(this) && frauki.state !== frauki.Rolling) {
                    this.Dive();
                } else {
                    this.state = this.Idling;
                }
            }

        } else {
            if(this.timers.TimerUp('idle_hop_wait')) {
                this.IdleHop();
            } else {
                this.state = this.Idling;
            }
        }
    };

    this.CanCauseDamage = function() {
        if(this.state === this.Scuttling || this.state === this.Diving) {
            return true;
        } else {
            return false;
        }
    };

    this.LandHit = function() {
        if(this.state !== this.Diving) {
            this.Dodge();
        }
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 300);
        this.state = this.PreHopping;
    };

    this.Scuttle = function() {

        EnemyBehavior.FacePlayer(this);      

        this.timers.SetTimer('attack', 300);
        this.state = this.PreScuttling;   
    };

    this.Dodge = function() {

        EnemyBehavior.FacePlayer(this);
        
        this.timers.SetTimer('attack', 500);

        this.state = this.Dodging;

        events.publish('play_sound', {name: 'RKN1d_jump', restart: true});

        if(frauki.body.onFloor()) {
            this.body.velocity.y = -300;

            if(frauki.body.center.x < this.body.center.x) {
                this.body.velocity.x = 300;
            } else {
                this.body.velocity.x = -300;
            }   
        } else {
            if(frauki.body.center.x < this.body.center.x) {
                this.body.velocity.x = -500;
            } else {
                this.body.velocity.x = 500;
            }   
        }

    };

    this.ScuttleAway = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 500);

        this.state = this.ScuttlingAway;        
    }

    this.Dive = function() {

        this.state = this.Diving;
        this.body.velocity.y = 300;
        this.body.velocity.x = 0;
        //this.body.setSize(35, 55, 0, 0);
        this.scale.x = 1;
        //game.add.tween(this).to({angle: 270}, 800, Phaser.Easing.Exponential.Out, true);
        //this.angle = 90;  

    };

    this.IdleHop = function() {
        this.state = this.IdleHopping;
        this.body.velocity.y = game.rnd.between(-150, -300);
        this.body.velocity.x = game.rnd.between(250, 400);

        if(game.rnd.between(1, 2) === 1) {
            this.body.velocity.x *= -1;
        }
        
        EnemyBehavior.FaceForward(this);

        this.timers.SetTimer('idle_hop_wait', game.rnd.between(1000, 3000));
    }

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.IdleHopping = function() {
        this.PlayAnim('hop');

        if(this.body.onFloor()) {
            return true;
        }

        return false;

    };

    this.PreHopping = function() {
        this.PlayAnim('idle');

        if(this.timers.TimerUp('attack')) {
            this.state = this.Hopping;

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.y - 50); 
            events.publish('play_sound', {name: 'RKN1d_jump', restart: true});

            if(this.body.velocity.y < -400) {
                this.body.velocity.y = -400;
            }

        }

        return false;
    };

    this.Hopping = function() {
        if(this.body.onFloor()) {
            this.PlayAnim('idle');
        } else {
            this.PlayAnim('hop');
        }

        if(EnemyBehavior.Player.IsBelow(this)) {
            this.Dive();
        }

        if(this.body.onFloor()) {
            events.publish('play_sound', {name: 'GUBr_land', restart: true});
            return true;
        }

        return false;
    };

    this.PreScuttling = function() {
        this.PlayAnim('spin');    

        EnemyBehavior.FacePlayer(this);
          

        if(this.timers.TimerUp('attack')) {
            this.timers.SetTimer('attack', 1000);
            this.state = this.Scuttling;
            this.scale.x = EnemyBehavior.GetDirMod(this);  
        }

        return false;
    };

    this.Scuttling = function() {
        this.PlayAnim('spin');

        if(EnemyBehavior.Player.IsDangerous(this)) {
            this.Dodge();
        }

        if(this.direction === 'left') {
            this.body.velocity.x = -400;
        } else {
            this.body.velocity.x = 400;
        } 

        if(this.timers.TimerUp('attack') || this.body.onWall()) {
            this.SetAttackTimer(game.rnd.between(500, 800));
            return true;
        }

        return false;
    };

    this.Diving = function() {
        this.PlayAnim('spin');
        
        if(this.body.onFloor()) {
            this.SetAttackTimer(game.rnd.between(500, 800));
            return true;
        }

        return false;
    };

    this.Dodging = function() {

        if(!this.body.onFloor()) {
            this.PlayAnim('hop');
        } else {
            this.PlayAnim('idle');
        }

        if(EnemyBehavior.Player.IsBelow(this)) {
            this.Dive();
        }

        if(this.timers.TimerUp('attack') || this.body.velocity.y > 0 || this.body.onFloor()) {
            this.timers.SetTimer('dodge', 1000);
            this.SetAttackTimer(0);
            return true;
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

};
