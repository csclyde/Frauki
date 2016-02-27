var GameData = {};

//When game data is requested, it is pulled from the data structure in memory. When
//it is saved, it is put into the data structure, and then put into local storage.
//So the only interaction with local storage is when the game loads, and when you
//save something to it. It doesn't constantly read out of local storage
GameData.data = {
    version: '0.1',
    dirty: true,

    checkpoint: '0',
    upgrades: [],
    doors: [],
    shards: {},
    nuggets: 0,
    bignugg: null
};

GameData.LoadDataFromStorage = function() {
    var save_data = localStorage.getItem('save_data');

    if(save_data) {
        this.data = JSON.parse(save_data);
        console.log('LOADING DATA', JSON.stringify(this.data));
    }
};

GameData.SaveDataToStorage = function() {
    localStorage.setItem('save_data', JSON.stringify(this.data));
};

GameData.GetCheckpoint = function() {
    return this.data.checkpoint;
};

GameData.SetCheckpoint = function(c) {
    if(this.data.checkpoint !== c) {
        this.data.checkpoint = c;
        this.SaveDataToStorage();
    }
};

GameData.HasUpgrade = function(name) {
    return (this.data.upgrades.indexOf(name) > -1);
};

GameData.SetUpgrade = function(name) {
    this.data.upgrades = [name];
    this.SaveDataToStorage();
};

GameData.GetOpenDoors = function() {
    return this.data.doors;
};

GameData.IsDoorOpen = function(id) {
    return (this.data.doors.indexOf(id) > -1);
};

GameData.AddOpenDoor = function(id) {
    if(this.data.doors.indexOf(id) === -1) {
        this.data.doors.push(id);
        this.SaveDataToStorage();
    }
};

GameData.GetMaxApples = function() {
    return 1;
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

    this.data.shards = shardSave;
    this.SaveDataToStorage();
};

GameData.GetShardPosition = function(name) {
    if(!this.data.shards[name]) return null;

    return this.data.shards[name];
};

GameData.GetNuggCount = function() {
    return this.data.nuggets;
};

GameData.AddNugg = function() {
    this.data.nuggets++;
    this.SaveDataToStorage();

    //save every 10th nugget
    // if(this.data.nuggets % 10 === 0) {
    //     this.SaveDataToStorage();
    // }
};

GameData.ResetNuggCount = function() {
    this.data.nuggets = 0;
    this.SaveDataToStorage();
};

GameData.UpdateBigNugg = function(x, y, count, layer) {
    this.data.bignugg = { 
        x: x,
        y: y,
        count: count,
        layer: layer
    };

    this.SaveDataToStorage();
};

GameData.GetBigNugg = function() {
    return this.data.bignugg;
};