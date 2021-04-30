var Effects = {};

Effects.Emitters = [
	{
		Name: 'positiveBits',
		Count: 15,
		Frames: ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005'],
		Gravity: -700
	},

	{
		Name: 'negativeBits',
		Count: 15,
		Frames: ['EnergyBitNeg0000', 'EnergyBitNeg0001', 'EnergyBitNeg0002', 'EnergyBitNeg0003', 'EnergyBitNeg0004', 'EnergyBitNeg0005'],
		Gravity: -150
	},

	{
		Name: 'neutralBits',
		Count: 15,
		Frames: ['EnergyBitNeutral0000', 'EnergyBitNeutral0001', 'EnergyBitNeutral0002', 'EnergyBitNeutral0003', 'EnergyBitNeutral0004', 'EnergyBitNeutral0005'],
		Gravity: -700
	},

    {
		Name: 'stars',
		Count: 30,
		Frames: ['Stars0000', 'Stars0001', 'Stars0002', 'Stars0003'],
		Gravity: -700,
		Drag: 1000,
		MinSpeedX: -400,
		MaxSpeedX: 400,
		MinSpeedY: -400,
		MaxSpeedY: 400,
		Alpha: 0.8
	},

	{
		Name: 'posSpark',
		Count: 50,
		Frames: ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004', 'Sparks0005'],
		Gravity: -400,
		Drag: 100
	},

	{
		Name: 'negSpark',
		Count: 50,
		Frames: ['Sparks0006', 'Sparks0007', 'Sparks0008', 'Sparks0009', 'Sparks0010', 'Sparks0011'],
		Gravity: -400,
		Drag: 100
	},

	{
		Name: 'neutralSpark',
		Count: 50,
		Frames: ['Sparks0012', 'Sparks0013', 'Sparks0014', 'Sparks0015', 'Sparks0016'],
		Gravity: -400,
		Drag: 100
	},

	{
		Name: 'splashRight',
		Count: 10,
		Frames: ['Splash0000', 'Splash0001'],
		Gravity: 300,
	},

	{
		Name: 'splashLeft',
		Count: 10,
		Frames: ['Splash0002', 'Splash0003'],
		Gravity: 300,
	},

	{
		Name: 'splashDirtyRight',
		Count: 10,
		Frames: ['SplashDirty0000', 'SplashDirty0001'],
		Gravity: 300,
		Alpha: 0.8
	},

	{
		Name: 'splashDirtyLeft',
		Count: 10,
		Frames: ['SplashDirty0002', 'SplashDirty0003'],
		Gravity: 300,
		Alpha: 0.8
	},

	{
		Name: 'sprockets',
		Count: 30,
		Frames: ['Sprockets0000', 'Sprockets0001', 'Sprockets0002', 'Sprockets0003', 'Sprockets0004'],
		Gravity: -200,
		MinRot: -500,
		MaxRot: 500,
		Drag: 100,
		MinSpeedX: -200,
		MaxSpeedX: 200,
		MinSpeedY: -200,
		MaxSpeedY: 0
	},

	{
		Name: 'energyStreak',
		Count: 50,
		Frames: ['Sparks0000', 'Sparks0001', 'Sparks0002', 'Sparks0003', 'Sparks0004'],
		Gravity: -580,
		Drag: 100,
		MinSpeedX: -80,
		MaxSpeedX: 80,
		MinSpeedY: -80,
		MaxSpeedY: 80
	},

	{
		Name: 'nuggDropper',
		Count: 50,
		Frames: ['EnergyBitNeutral0000', 'EnergyBitNeutral0001', 'EnergyBitNeutral0002', 'EnergyBitNeutral0003', 'EnergyBitNeutral0004', 'EnergyBitNeutral0005'],
		Gravity: -300,
		MinSpeedX: -200,
		MaxSpeedX: 200,
		MinSpeedY: -200,
		MaxSpeedY: 200
	},

	{
		Name: 'nuggDepositer',
		Count: 15,
		Frames: ['EnergyBitNeutral0000', 'EnergyBitNeutral0001', 'EnergyBitNeutral0002', 'EnergyBitNeutral0003', 'EnergyBitNeutral0004', 'EnergyBitNeutral0005'],
		Gravity: -700
	}
];

/*
Name: 'positiveBits',
Count: 15,
Frames: ['EnergyBitPos0000', 'EnergyBitPos0001', 'EnergyBitPos0002', 'EnergyBitPos0003', 'EnergyBitPos0004', 'EnergyBitPos0005'],
Gravity: -700,
MinScale: 1,
MaxScale: 1,
MinRot: 0,
MaxRot: 0,
Drag: 0,
MinSpeedX: 0,
MaxSpeedX: 0,
MinSpeedY: 0,
MaxSpeedY: 0,
Alpha: 1.0
*/
