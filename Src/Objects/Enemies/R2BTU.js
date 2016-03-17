Enemy.prototype.types['R2BTU'] =  function() {

    this.body.setSize(35, 75, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['R2BTU/Stand0000'], 10, true, false);
    this.animations.add('float', ['R2BTU/Float0000'], 6, true, false);
    //this.animations.add('attack', ['R2BTU/Attack0000', 'R2BTU/Attack0001'], 18, true, false);

    this.energy = 3;
    this.baseStunDuration = 500;

    this.robotic = true;

    this.state = this.Idling;
    
    this.updateFunction = function() {
    };

    this.Act = function() {

        this.state = this.Idling;
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Attack = function() {
        if(!this.timers.TimerUp('attack')) {
            return;
        }

        this.timers.SetTimer('slash_hold', game.rnd.between(500, 800));
        this.state = this.Windup;

    };

    this.Dodge = function(duration, override) {
        if(!this.timers.TimerUp('dodge') && !override) {
            return false;
        }

        EnemyBehavior.FacePlayer(this);

        if(this.direction === 'left') {
            this.body.velocity.x = 0;
        } else {
            this.body.velocity.x = -0;
        }

        this.body.velocity.y = 0;

        this.state = this.Dodging;

        this.timers.SetTimer('dodge_hold', duration || 600);

        return true;
    };

    this.LandHit = function() {
        //this.Dodge(1200, true);
        this.hasHit = true;
    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.Windup = function() {
        this.PlayAnim('attack');

        if(this.timers.TimerUp('slash_hold')) {
            this.state = this.Attacking;
            this.timers.SetTimer('slash_hold', game.rnd.between(500, 800));
        }

        return false;
    };

    this.Attacking = function() {
        this.PlayAnim('attack');

        if(this.direction === 'left') {
            this.body.velocity.x = 0;
        } else {
            this.body.velocity.x = 0;
        }

        if(this.timers.TimerUp('slash_hold')) {
            return true;
        }

        return false;
    };

    this.Dodging = function() {
        this.PlayAnim('float');

        if(this.timers.TimerUp('dodge_hold')) {
            return true;
        }

        return false;
    }

    this.Hurting = function() {
        this.PlayAnim('idle');

        if(this.timers.TimerUp('hit') && this.body.onFloor()) {
            return true;
        }

        return false;
    };

    this.attackFrames = {
        
    };

};
