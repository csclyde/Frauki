
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

			var placementTween = game.add.tween(shard).to({x: 122 * 16 + 1, y: 179 * 16 + 14}, 2000, Phaser.Easing.Exponential.InOut, true);
			placementTween.onComplete.add(function() {
				GameData.SaveShardPositions();
			});
			//Frogland.effectsGroup.addChild(shard);
		}
	},

	stay: function(params) {
	},

	exit: function(params) {
	}
}