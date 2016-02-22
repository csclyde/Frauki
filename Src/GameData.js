var GameData = {};

GameData.GetCheckpoint = function() {
    return localStorage.getItem('fraukiCheckpoint');
};

GameData.SetCheckpoint = function(c) {
    localStorage.setItem('fraukiCheckpoint', c);
};

GameData.HasUpgrade = function(name) {
    var upgradeSaves = JSON.parse(localStorage.getItem('fraukiUpgrades')) || [];
    return (upgradeSaves.indexOf(name) > -1);
};

GameData.SetUpgrade = function(name) {
    localStorage.setItem('fraukiUpgrades', JSON.stringify([name]));
};

GameData.GetOpenDoors = function() {
    JSON.parse(localStorage.getItem('fraukiDoors')) || [];
};

GameData.IsDoorOpen = function(id) {
    var openDoors = JSON.parse(localStorage.getItem('fraukiDoors')) || [];
    return (openDoors.indexOf(id) > -1)
};

GameData.AddOpenDoor = function(id) {
    var openDoors = JSON.parse(localStorage.getItem('fraukiDoors')) || [];

    if(openDoors.indexOf(id) === -1) {
        openDoors.push(id);
        localStorage.setItem('fraukiDoors', JSON.stringify(openDoors));
    }
};

GameData.GetMaxApples = function() {
    return 2;
};

GameData.SaveShardPositions = function() {
    var shardSave = {};

    Frogland.shardGroup.forEach(function(s) {
        shardSave[s.shardFrame] = {
            x: Math.floor(s.x),
            y: Math.floor(s.y),
            layer: s.currentLayer,
            dropped: (!s.returnedToChurch && s.pickedUp)
        };
    });

    localStorage.setItem('fraukiShards', JSON.stringify(shardSave));
};

GameData.GetShardPosition = function(name) {
    var shardSave = localStorage.getItem('fraukiShards');

    if(!shardSave) return null;

    shardSave = JSON.parse(shardSave);

    if(!shardSave[name]) return null;

    return shardSave[name];
};