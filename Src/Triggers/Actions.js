
TriggerController.prototype.triggers['open_door'] = {
	enter: function(params) {

	},

	stay: function(params) {
		//if there are no enemies within the region
	},

	exit: function(params) {
	}
}

TriggerController.prototype.triggers['return_shard'] = {
	enter: function(params) {
		if(GetCurrentShardType() === 'Will') {
			var shard = frauki.carriedShard;

			shard.returnedToChurch = true;
			DropShard(shard);

			//122 179
			var slowTween = game.add.tween(shard.body.velocity).to({x: 0, y: 0}, 500, Phaser.Easing.Exponential.Out, true);

			slowTween.onComplete.add(function() {
				var placementTween = game.add.tween(shard).to({x: 122 * 16 + 1, y: 179 * 16 + 14}, 1500, Phaser.Easing.Exponential.InOut, true);
				placementTween.onComplete.add(function() {
					GameData.SaveShardPositions();
					events.publish('play_sound', { name: 'fanfare_long' } );
				});
			});

			

			//Frogland.effectsGroup.addChild(shard);


		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['soccer_goal'] = {
	enter: function(params) {
		events.publish('open_door', { door_name: 'soccer_goal' });
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};

TriggerController.prototype.triggers['heal_to_open_door'] = {
	load: function(trigger) {
		events.subscribe('energy_heal', function() {
			if(this.playerInside) {
				events.publish('open_door', { door_name: 'heal_trainer' });
			 	events.publish('open_door', { door_name: 'tutorial_goodie' });
			}
		}, trigger);
	},

	enter: function(params) {
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
};