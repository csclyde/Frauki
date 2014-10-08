var fraukiDamageFrames = {
	
	//slash across in front of yourself
	'Attack Front0002': {
		damageFrame: true,
		x: 0, 
		y: 10,
		w: 65,
		h: 34,

		damage: 1.5,
		knockback: 0.5,
		penetration: 0
	},
	
	//followthrough of the front slash, is behind you
	'Attack Front0003': {
		damageFrame: true,
		x: -35, 
		y: 0,
		w: 35,
		h: 15,

		damage: 0.5,
		knockback: 0.1,
		penetration: 0
	},

	//slash across in front of yourself return
	'Attack Front0004': {
		damageFrame: true,
		x: 40, 
		y: 10,
		w: 35,
		h: 35,

		damage: 0.5,
		knockback: 0.5,
		penetration: 0
	},

	//return to the followthrough, smaller and weaker
	'Attack Front0005': {
		damageFrame: true,
		x: -30, 
		y: 0,
		w: 25,
		h: 15,

		damage: 0.5,
		knockback: 0.1,
		penetration: 0
	},
	
	//overhead swing
	'Attack Overhead0004': {
		damageFrame: true,
		x: -15, 
		y: 15,
		w: 25,
		h: 30,

		damage: 0.5,
		knockback: 0,
		penetration: 0
	},

	//overhead swing
	'Attack Overhead0005': {
		damageFrame: true,
		x: 15, 
		y: 10,
		w: 15,
		h: 15,

		damage: 0.5,
		knockback: 0,
		penetration: 0
	},

	//overhead swing
	'Attack Overhead0006': {
		damageFrame: true,
		x: -30, 
		y: -15,
		w: 45,
		h: 30,

		damage: 1.5,
		knockback: 0,
		penetration: 0
	},

	//overhead swing
	'Attack Overhead0007': {
		damageFrame: true,
		x: -30, 
		y: -32,
		w: 75,
		h: 60,

		damage: 1.5,
		knockback: 0,
		penetration: 0
	},

	//overhead swing
	'Slash Standing0007': {
		damageFrame: true,
		x: -10, 
		y: -25,
		w: 45,
		h: 50,

		damage: 1,
		knockback: 0,
		penetration: 0
	},
	
	//follow through on the overhead swing, in front of you and low
	'Slash Standing0008': {
		damageFrame: true,
		x: 10, 
		y: 25,
		w: 28,
		h: 20,

		damage: 1,
		knockback: 0,
		penetration: 0
	},
	
	//stab, big short initial shape
	'Attack Stab0006': {
		damageFrame: true,
		x: -25, 
		y: 0,
		w: 50,
		h: 40,

		damage: 2,
		knockback: 1.4,
		penetration: 0
	},

	//stab, long followthrough
	'Attack Stab0007': {
		damageFrame: true,
		x: 0, 
		y: 15,
		w: 83,
		h: 10,

		damage: 1,
		knockback: 0.8,
		penetration: 0
	},
	
	//stab, long followthrough
	'Attack Stab0008': {
		damageFrame: true,
		x: 0, 
		y: 15,
		w: 83,
		h: 12,

		damage: 1,
		knockback: 0.8,
		penetration: 0
	},

	//stab, long followthrough
	'Attack Stab0009': {
		damageFrame: true,
		x: 0, 
		y: 15,
		w: 83,
		h: 12,

		damage: 1,
		knockback: 0.8,
		penetration: 0
	},

	'Kick0000': {
		damageFrame: true,
		x: 0, 
		y: 25,
		w: 25,
		h: 20,

		damage: 0,
		knockback: 3.0,
		penetration: 0
	}
};
