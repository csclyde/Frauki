Enemy.prototype.types['Insectoid'] =  function() {

    this.body.setSize(50, 25, 0, 10);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Insectoid/Hop0000'], 10, true, false);
    this.animations.add('hop', ['Insectoid/Hop0000', 'Insectoid/Hop0001', 'Insectoid/Hop0002'], 10, false, false);
    this.animations.add('die', ['Insectoid/Die0000', 'Insectoid/Die0001', 'Insectoid/Die0002', 'Insectoid/Die0003'], 10, false, false);

    this.attackTimer = 0;
    this.damage = 2;
    this.energy = 4;

    this.body.maxVelocity.y = 500;

    this.updateFunction = function() {
        if(this.state === this.Hurting)
            return;

        if(this.state !== this.Diving && this.angle !== 0)
            this.angle = 0;

        if(this.state === this.Hopping && !this.body.onFloor()) {
            this.body.drag.x = 200;
        } else {
            this.body.drag.x = 600;
        }
    };

    this.Act = function() {

        if(EnemyBehavior.Player.IsVisible(this)) {

            if(this.body.onFloor()) {

                if(EnemyBehavior.Player.IsDangerous(this) || EnemyBehavior.Player.IsNear(this, 20)) {
                    this.Dodge();
                }
                else if(EnemyBehavior.Player.IsNear(this, 50)) {
                    this.Dodge();
                } 
                else if(!frauki.body.onFloor()) {
                    this.Hop();
                } 
                else {
                    if(EnemyBehavior.RollDice(2, 1)) {
                        this.Scuttle();
                    } else {
                        this.Hop();
                    }
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
    };

    this.LandHit = function() {
        this.Dodge();
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Hop = function() {

        EnemyBehavior.FacePlayer(this);

        this.timers.SetTimer('attack', 500);
        this.state = this.PreHopping;
    };

    this.Scuttle = function() {

        EnemyBehavior.FacePlayer(this);      

        this.timers.SetTimer('attack', 600);
        this.state = this.PreScuttling;   
    };

    this.Dodge = function() {

        EnemyBehavior.FacePlayer(this);
        
        this.timers.SetTimer('attack', 500);

        this.state = this.Dodging;

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

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');

        return true;
    };

    this.PreHopping = function() {
        this.PlayAnim('idle');

        if(this.timers.TimerUp('attack')) {
            this.state = this.Hopping;

            this.timers.SetTimer('attack', game.rnd.between(1500, 2000));

            EnemyBehavior.FacePlayer(this);
            EnemyBehavior.JumpToPoint(this, frauki.body.center.x, frauki.body.center.y); 
        }

        return false;
    };

    this.Hopping = function() {

        if(!this.body.onFloor()) {
            this.PlayAnim('hop');
        } else {
            this.PlayAnim('idle');
        }

        if(this.body.onFloor() && this.timers.TimerUp('attack')) {
            return true;
        }

        return false;
    };

    this.PreScuttling = function() {
        this.PlayAnim('idle');      

        if(this.timers.TimerUp('attack')) {
            this.timers.SetTimer('attack', 1200);
            this.state = this.Scuttling;
            this.scale.x = EnemyBehavior.GetDirMod(this);  
        }

        return false;
    };

    this.Scuttling = function() {
        this.PlayAnim('idle');

        if(EnemyBehavior.Player.IsDangerous(this)) {
            this.Dodge();
        }

        if(this.direction === 'left') {
            this.body.velocity.x = -425;
        } else {
            this.body.velocity.x = 425;
        } 

        if(this.timers.TimerUp('attack') || this.body.onWall()) {
            return true;
        }

        return false;
    };

    this.Diving = function() {
        if(frauki.body.center.x < this.body.center.x)
            this.body.velocity.x = -20;
        else if(frauki.body.center.x > this.body.center.x)
            this.body.velocity.x = +20;
        
        if(this.body.onFloor() || this.body.velocity.y <= 0) {
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

        if(this.timers.TimerUp('attack')) {
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
