Enemy.prototype.types['Gnome'] =  function() {

	this.body.setSize(13, 20, 0, 4);
	this.anchor.setTo(0.5);

    this.animations.add('idle_boat', ['Gnome/boat0000', 'Gnome/boat0001', 'Gnome/boat0002', 'Gnome/boat0003', 'Gnome/boat0004', 'Gnome/boat0005'], 5, true, false);
	this.animations.add('idle_city', ['Gnome/cool0000'], 10, true, false);
    this.animations.add('idle_cooking', ['Gnome/cooking0000', 'Gnome/cooking0001', 'Gnome/cooking0002', 'Gnome/cooking0003', 'Gnome/cooking0004', 'Gnome/cooking0005', 'Gnome/cooking0006', 'Gnome/cooking0007', 'Gnome/cooking0008'], 3, true, false);
	this.animations.add('idle_cool', ['Gnome/cool0000'], 10, true, false);
	this.animations.add('idle_fishing', ['Gnome/fishing0000'], 10, true, false);
	this.animations.add('idle_garden', ['Gnome/garden0000', 'Gnome/garden0001', 'Gnome/garden0002', 'Gnome/garden0003', 'Gnome/garden0004', 'Gnome/garden0005', 'Gnome/garden0006', 'Gnome/garden0007', 'Gnome/garden0008', 'Gnome/garden0009', 'Gnome/garden0010', 'Gnome/garden0011'], 3, true, false);
	this.animations.add('idle_gossip', ['Gnome/gossip0000', 'Gnome/gossip0001'], 3, true, false);
	this.animations.add('idle_hopper_rider', ['Gnome/hopper_rider0000', 'Gnome/hopper_rider0001', 'Gnome/hopper_rider0002', 'Gnome/hopper_rider0003', 'Gnome/hopper_rider0004', 'Gnome/hopper_rider0005', 'Gnome/hopper_rider0006', 'Gnome/hopper_rider0007'], 4, true, false);
	this.animations.add('idle_love_gnomes', ['Gnome/love_gnomes0000', 'Gnome/love_gnomes0001', 'Gnome/love_gnomes0002', 'Gnome/love_gnomes0003', 'Gnome/love_gnomes0004', 'Gnome/love_gnomes0005', 'Gnome/love_gnomes0006', 'Gnome/love_gnomes0007'], 4, true, false);
	this.animations.add('idle_mushroom', ['Gnome/cool0000'], 10, true, false);
	this.animations.add('idle_pickaxe', ['Gnome/pickaxe0000', 'Gnome/pickaxe0001', 'Gnome/pickaxe0002', 'Gnome/pickaxe0003', 'Gnome/pickaxe0004', 'Gnome/pickaxe0005', 'Gnome/pickaxe0006', 'Gnome/pickaxe0007', 'Gnome/pickaxe0008', 'Gnome/pickaxe0009', 'Gnome/pickaxe0010', 'Gnome/pickaxe0011', 'Gnome/pickaxe0012', 'Gnome/pickaxe0013', 'Gnome/pickaxe0014', 'Gnome/pickaxe0015', 'Gnome/pickaxe00016', 'Gnome/pickaxe0017', 'Gnome/pickaxe0018'], 5, true, false);
	this.animations.add('idle_sleepy', ['Gnome/sleepy0000', 'Gnome/sleepy0001', 'Gnome/sleepy0002', 'Gnome/sleepy0003', 'Gnome/sleepy0004', 'Gnome/sleepy0005'], 1, true, false);
	this.animations.add('idle_windy', ['Gnome/windy0000', 'Gnome/windy0001', 'Gnome/windy0002', 'Gnome/windy0003', 'Gnome/windy0004', 'Gnome/windy0005', 'Gnome/windy0006'], 5, true, false);
	this.animations.add('idle_wut', ['Gnome/windy0000'], 10, true, false);
	


    this.energy = 1;
	this.baseStunDuration = 400;
	this.collideWithPlayer = function() {
		return false;
	};

	this.body.drag.x = 500;
	
	this.state = this.Idling;

	this.create = function() {
	};

	this.updateFunction = function() {

	};

	this.Act = function() {
        this.state = this.Idling;
        this.body.velocity.x = 0;
    };

    this.OnHit = function() {
    	
    };

    this.Reset = function() {
    	
	};
	
	////////////////////////////////STATES////////////////////////////////////
	this.Idling = function() {
		this.PlayAnim('idle_' + this.properties.name);

		this.SetDirection('right');

		if(this.properties.name === 'boat') {
			this.body.gravity.y = -700;
		}
		//EnemyBehavior.FacePlayer(this);

		return true;
	};

	this.Hurting = function() {
		this.PlayAnim('hit');

		if(this.timers.TimerUp('hit')) {
			this.state = this.Idling;
			return true;
		}

		return false;
	};

	this.attackFrames = {

	};
};
