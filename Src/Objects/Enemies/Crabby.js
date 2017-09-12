Enemy.prototype.types['Crabby'] =  function() {

    this.body.setSize(37, 29, 0, 0);
    this.anchor.setTo(0.5, 0.5);

    this.animations.add('idle', ['Misc/Crabby0000'], 10, true, false);
    this.animations.add('walk', ['Misc/Crabby0000', 'Misc/Crabby0001', 'Misc/Crabby0002', 'Misc/Crabby0003'], 10, true, false);
    

    this.damage = 1;
    this.energy = 1;

    this.body.maxVelocity.y = 500;
    this.body.allowGravity = false;

    this.state = this.Idling;


    this.updateFunction = function() {
        if(this.properties.wall_side === 'left') {
            this.body.velocity.x = -500;
        } else {
            this.body.velocity.x = 500;
        }

        if(this.body.blocked.left) {
            this.SetDirection('right');
        } else {
            this.SetDirection('left');
        }

    };

    this.Act = function() {
        
    };

    this.CanCauseDamage = function() {
        if(!this.body.onFloor()) {
            return true;
        } else {
            return false;
        }
    };

    this.LandHit = function() {
        
    };

    ///////////////////////////////ACTIONS////////////////////////////////////
    this.Walk = function() {
        this.state = this.Walking;
        this.timers.SetTimer('walking', game.rnd.between(500, 1500));

        if(game.rnd.between(1, 2) === 1) {
            this.body.velocity.y = -50;
        } else {
            this.body.velocity.y = 50;
        }
       
    };

    this.Idle = function() {
        this.state = this.Idling;
        this.timers.SetTimer('idling', game.rnd.between(1000, 1500));

        this.body.velocity.y = 0;

    };

    ////////////////////////////////STATES////////////////////////////////////
    this.Idling = function() {
        this.PlayAnim('idle');
        
        if(this.timers.TimerUp('idling')) {
            this.Walk();
        }

        return false;
    };

    this.Walking = function() {
        this.PlayAnim('walk');

        if(this.timers.TimerUp('walking')) {
            this.Idle();
        }

        var xLoc = this.body.x;
        xLoc += (this.direction === 'left' ? this.body.width + 3 : -3);

        var bottomTile = Frogland.map.getTileWorldXY(xLoc, this.body.y + this.body.height + 10, 16, 16, Frogland.GetCurrentCollisionLayer());
        var topTile = Frogland.map.getTileWorldXY(xLoc, this.body.y - 10, 16, 16, Frogland.GetCurrentCollisionLayer());

        if(this.body.velocity.y < 0 && topTile === null) {
            this.body.velocity.y *= -1;
        } else if(this.body.velocity.y > 0 && bottomTile === null) {
            this.body.velocity.y *= -1;
        } else if(this.body.blocked.down) {
            this.body.velocity.y *= -1;
        } else if(this.body.blocked.up) {
            this.body.velocity.y *= -1;
        }

        return false;
    };

};
