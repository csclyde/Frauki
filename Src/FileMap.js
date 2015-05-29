var FileMap = {};

FileMap.Images = [
	{ Name: 'FrogtownTiles', File: 'Data/World/FrogtownTiles.png' },
	{ Name: 'DepthsTiles', File: 'Data/World/DepthsTiles.png' },
	{ Name: 'TerraceTiles', File: 'Data/World/TerraceTiles.png' },
	{ Name: 'Doodads', File: 'Data/World/Doodads.png' },
	{ Name: 'Collision', File: 'Data/CollisionKey.png' },
	{ Name: 'Background', File: 'Data/World/Sky.png' },
	{ Name: 'parallax1', File: 'Data/World/Parallax1.png' },
	{ Name: 'parallax2', File: 'Data/World/Parallax2.png' },
	{ Name: 'mace', File: 'Data/Weapons/Mace.png' },
	{ Name: 'Spore', File: 'Data/Enemies/Sporoid/spore.png' }
];

FileMap.Atlas = [
	{ Name: 'Frauki', File: 'Data/Frauki/Frauki.json', Img: 'Data/Frauki/Frauki.png' },
	{ Name: 'EnemySprites', File: 'Data/Enemies/Enemies.json', Img: 'Data/Enemies/Enemies.png' },
	{ Name: 'Door', File: 'Data/Doors/Doors.json', Img: 'Data/Doors/Doors.png' },
	{ Name: 'Misc', File: 'Data/Misc/Misc.json', Img: 'Data/Misc/Misc.png' },
	{ Name: 'UI', File: 'Data/UI/UI.json', Img: 'Data/UI/UI.png' }
];

FileMap.Audio = [
	{ Name: 'attack_slash', File: 'Data/Sfx/attack_slash.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_stab', File: 'Data/Sfx/attack_stab.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_dive_charge', File: 'Data/Sfx/attack_dive_charge.wav', Volume: 0.3, Loop: false },
	{ Name: 'attack_dive_fall', File: 'Data/Sfx/attack_dive_fall.wav', Volume: 0.3, Loop: true },
	{ Name: 'attack_dive_land', File: 'Data/Sfx/attack_dive_land.wav', Volume: 0.5, Loop: false },
	{ Name: 'attack_connect', File: 'Data/Sfx/attack_connect.wav', Volume: 0.3, Loop: false },

	{ Name: 'jump', File: 'Data/Sfx/jump.wav', Volume: 0.3, Loop: false },
	{ Name: 'ouch', File: 'Data/Sfx/ouch.wav', Volume: 0.5, Loop: false },
	{ Name: 'running', File: 'Data/Sfx/run.wav', Volume: 0.3, Loop: true },
	{ Name: 'slide', File: 'Data/Sfx/slide.wav', Volume: 0.3, Loop: false },
	{ Name: 'airhike', File: 'Data/Sfx/airhike.wav', Volume: 0.3, Loop: false },

	{ Name: 'buzzar_hurt', File: 'Data/Sfx/buzzar_hurt.wav', Volume: 0.3, Loop: false },
	{ Name: 'buzzar_idle', File: 'Data/Sfx/buzzar_idle.wav', Volume: 0.3, Loop: false },
	{ Name: 'buzzar_sting', File: 'Data/Sfx/buzzar_sting.wav', Volume: 0.3, Loop: false },
	{ Name: 'insectoid_hurt', File: 'Data/Sfx/insectoid_hurt.wav', Volume: 0.3, Loop: false },
	{ Name: 'insectoid_jump', File: 'Data/Sfx/insectoid_jump.wav', Volume: 0.3, Loop: false },
	{ Name: 'insectoid_land', File: 'Data/Sfx/insectoid_land.wav', Volume: 0.3, Loop: false },
	{ Name: 'insectoid_slide', File: 'Data/Sfx/insectoid_slide.wav', Volume: 0.3, Loop: false }
];

FileMap.Music = [
	{ Name: 'Surface', File: 'Data/Music/Surface.xm', Volume: 0.5, Loop: true },
	{ Name: 'Ruins', File: 'Data/Music/Ruins.xm', Volume: 0.5, Loop: true },
	{ Name: 'Landfill', File: 'Data/Music/Landfill.xm', Volume: 0.5, Loop: true },
	{ Name: 'Gameover', File: 'Data/Music/Game Over (Dead Frauki).xm', Volume: 0.5, Loop: false },
];

FileMap.Enemies = [
	{ Name: 'Insectoid', Tile: 85 },
	{ Name: 'Buzzar', Tile: 86 },
	{ Name: 'Sporoid', Tile: 87 },
	{ Name: 'Madman', Tile: 88 },
	{ Name: 'CreeperThistle', Tile: 89 },
	{ Name: 'Incarnate', Tile: 90 },
	{ Name: 'Haystax', Tile: 91 },
	{ Name: 'Bizarro', Tile: 92 },
	{ Name: 'Lancer', Tile: 93 }
];
