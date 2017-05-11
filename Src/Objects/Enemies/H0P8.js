Enemy.prototype.types['H0P8'] =  function() {

    this.body.setSize(40, 53, 0, -10);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['H0P8/Idle0000', 'H0P8/Idle0001', 'H0P8/Idle0002', 'H0P8/Idle0003'], 6, true, false);
    this.animations.add('pre_hop', ['H0P8/Attack0001'], 10, false, false);
    this.animations.add('hop', ['H0P8/Attack0002'], 10, false, false);
    this.animations.add('attack', ['H0P8/Attack0003', 'H0P8/Attack0004', 'H0P8/Attack0005'], 14, false, false);
    this.animations.add('hurt', ['H0P8/Hurt0001'], 10, false, false);

    this.energy = 4;
    this.baseStunDuration = 500;
    this.stunThreshold = 1;
    this.body.bounce.y = 0;

    this.robotic = true;

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(this.state === this.Hopping && !this.body.onFloor()) {
            this.body.drag.x = 50;
        } else {
            this.body.drag.x = 600;
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
                else if(this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this) && !EnemyBehavior.Player.IsNear(this, 50)) {
                    this.Hop();
                   
                } else {
                    this.state = this.Idling;
                }

            } else {
                this.state = this.Idling;

            }

        } else {
            this.state = this.Idling;
        }
    };

    this.LandHit = function() {
        this.Dodge();
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 300);
        this.state = this.PreHopping;
    };

    this.Dodge = function() {

        EnemyBehavior.FacePlayer(this);
        
        this.timers.SetTimer('attack', 500);

        this.state = this.Dodging;

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

    this.Slash = function() {
        this.state = this.Slashing;
    };


    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.PreHopping = function() {
        this.PlayAnim('pre_hop');

        if(this.timers.TimerUp('attack')) {
            this.state = this.Hopping;

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.y - 50); 

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
            this.Slash();
        }

        if(this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.Slashing = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished && this.timers.TimerUp('slash_hold')) {
            this.timers.SetTimer('attack_wait', 300);
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

        if(this.timers.TimerUp('attack') || this.body.velocity.y > 0 || this.body.onFloor()) {
            this.timers.SetTimer('dodge', 1000);
            this.timers.SetTimer('attack_wait', 0);
            return true;
        }

        return false;
    };

    this.Hurting = function() {
        this.PlayAnim('hurt');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

};
