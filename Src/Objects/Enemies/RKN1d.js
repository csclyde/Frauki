Enemy.prototype.types['RKN1d'] =  function() {

    this.body.setSize(40, 45, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['RKN1d/Idle0000', 'RKN1d/Idle0001', 'RKN1d/Idle0002', 'RKN1d/Idle0003'], 10, true, false);
    this.animations.add('pre_jump', ['RKN1d/Jump0000', 'RKN1d/Jump0001', 'RKN1d/Jump0002'], 12, false, false);
    this.animations.add('jump', ['RKN1d/Jump0003', 'RKN1d/Jump0004', 'RKN1d/Jump0005'], 12, false, false);
    this.animations.add('attack', ['RKN1d/Bite0001', 'RKN1d/Bite0002', 'RKN1d/Bite0003', 'RKN1d/Bite0004', 'RKN1d/Bite0005'], 12, false, false);

    this.damage = 1;
    this.energy = 2;

    this.body.maxVelocity.y = 500;

    this.robotic = true;

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(this.state === this.Hopping && !this.body.onFloor()) {
            this.body.drag.x = 50;
        } else {
            this.body.drag.x = 600;
        }

        if(this.animations.currentAnim.name === 'spin') {
            if(this.direction === 'left') {
                this.angle -= 20;
            } else {
                this.angle += 20;
            }
        } else {
            this.angle = 0;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            //if theyre stunned, seize the opportunity
            if(EnemyBehavior.Player.IsStunned(this)) {
                this.Hop();

            } else if(this.body.onFloor()) {

                if(EnemyBehavior.Player.IsNear(this, 50) && this.timers.TimerUp('bite_wait')) {
                    this.Bite();

                } else if(this.timers.TimerUp('attack_wait') && EnemyBehavior.Player.IsVulnerable(this)) {
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

        this.timers.SetTimer('attack', 400);
        this.state = this.PreHopping;
    };

    this.Bite = function() {
        EnemyBehavior.FacePlayer(this);

        this.state = this.Biting;
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

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.PreHopping = function() {
        this.PlayAnim('pre_jump');

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
            this.PlayAnim('jump');
        }

        if(this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.Biting = function() {
        this.PlayAnim('attack');

        if(this.animations.currentAnim.isFinished) {
            this.timers.SetTimer('bite_wait', 1000);

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
            this.timers.SetTimer('attack_wait', game.rnd.between(500, 800));
            return true;
        }

        return false;
    };

    this.Diving = function() {
        this.PlayAnim('spin');
        
        if(this.body.onFloor()) {
            this.timers.SetTimer('attack_wait', game.rnd.between(500, 800));
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
        this.PlayAnim('die');

        if(this.timers.TimerUp('hit')) {
            return true;
        }

        return false;
    };

};
