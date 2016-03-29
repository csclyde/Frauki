Enemy.prototype.types['R2BTU'] =  function() {

    this.body.setSize(25, 35, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['R2BTU/Stand0000'], 10, true, false);
    this.animations.add('float', ['R2BTU/Float0000', 'R2BTU/Float0001'], 14, true, false);
    this.animations.add('attack', ['R2BTU/Attack0000', 'R2BTU/Attack0001', 'R2BTU/Attack0002', 'R2BTU/Attack0003'], 16, true, false);

    this.energy = 3;
    this.baseStunDuration = 500;

    this.robotic = true;

    this.state = this.Idling;
    
    this.updateFunction = function() {
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            if(this.timers.TimerUp('dodge_wait') && EnemyBehavior.Player.IsNear(this, 60)) {
                this.Dodge();

            } else if(this.timers.TimerUp('dodge_wait') && frauki.state === frauki.AttackStab) {
                this.JumpOver();

            } else if(EnemyBehavior.Player.IsNear(this, 250)) {

                if(this.timers.TimerUp('attack_wait') && frauki.body.onFloor()) {
                    this.Attack();
                } else {
                    this.state = this.Idling;
                }
            
            } else {
                this.state = this.Idling;
            }
        } else {
            this.state = this.Idling;
            this.body.velocity.x = 0;
        }
    };

    this.LandHit = function() {
        this.timers.SetTimer('slash_hold', 0);
    }

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Attack = function() {
        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('slash_hold', game.rnd.between(1000, 2000));
        this.state = this.Slashing;

    };

    this.Dodge = function() {

        EnemyBehavior.FacePlayer(this);

        if(this.direction === 'left') {
            this.body.velocity.x = 500;
        } else {
            this.body.velocity.x = -500;
        }

        this.body.velocity.y = -250;

        this.state = this.Dodging;

        this.timers.SetTimer('dodge_hold', 600);

        return true;
    };

    this.JumpOver = function() {
        this.state = this.Dodging;

        EnemyBehavior.FacePlayer(this);

        if(this.direction === 'left') {
            this.body.velocity.x = -100;
        } else {
            this.body.velocity.x = 100;
        }
        this.body.velocity.y = -250;

        this.timers.SetTimer('dodge', game.rnd.between(2000, 4000));
        this.timers.SetTimer('attack_wait', 0);
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

    this.Slashing = function() {
        this.PlayAnim('attack');

        if(this.direction === 'left') {
            this.body.velocity.x = -200;
        } else {
            this.body.velocity.x = 200;
        }

        if(this.timers.TimerUp('slash_hold')) {
            this.timers.SetTimer('attack_wait', game.rnd.between(600, 1200));
            return true;
        }

        return false;
    };

    this.Dodging = function() {
        this.PlayAnim('float');

        if(this.timers.TimerUp('dodge_hold')) {
            this.timers.SetTimer('dodge_wait', 600);

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
        'R2BTU/Attack0000': {
            x: 12, y: -2, w: 30, h: 30,
            damage: 1,
            knockback: 0.2,
            priority: 2,
            juggle: 0
        }, 

        'R2BTU/Attack0001': {
            x: 12, y: -2, w: 30, h: 30,
            damage: 1,
            knockback: 0.2,
            priority: 2,
            juggle: 0
        }, 

        'R2BTU/Attack0002': {
            x: 12, y: -2, w: 30, h: 30,
            damage: 1,
            knockback: 0.2,
            priority: 2,
            juggle: 0
        }, 

        'R2BTU/Attack0003': {
            x: 12, y: -2, w: 30, h: 30,
            damage: 1,
            knockback: 0.2,
            priority: 2,
            juggle: 0
        }, 
    };

};
