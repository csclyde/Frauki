var GameData = {};

//When game data is requested, it is pulled from the data structure in memory. When
//it is saved, it is put into the data structure, and then put into local storage.
//So the only interaction with local storage is when the game loads, and when you
//save something to it. It doesn't constantly read out of local storage
GameData.data = {
    version: '0.1',
    dirty: true,

    checkpoint: '0',
    upgrades: ["Shield"],
    doors: [],
    shards: {},
    nugg_bank: 0,
    flash_copy: null
};

GameData.nuggetCount = 0;

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

    Frogland.placedShards.forEach(function(s) {
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
    return this.nuggetCount;
};

GameData.AddNugg = function() {
    this.nuggetCount++;
    //this.SaveDataToStorage();

    //save every 10th nugget
    // if(this.data.nuggets % 10 === 0) {
    //     this.SaveDataToStorage();
    // }
};

GameData.RemoveNuggs = function(amt) {
    amt = amt || 1;

    this.nuggetCount -= Math.floor(amt);

    if(this.nuggetCount < 0) this.nuggetCount = 0;
}

GameData.ResetNuggCount = function() {
    this.nuggetCount = 0;
    //this.SaveDataToStorage();
};

GameData.SaveNuggsToBank = function() {
    this.data.nugg_bank += this.nuggetCount;
    this.nuggetCount = 0;
    this.SaveDataToStorage();

};

GameData.GetNuggBankCount = function() {
    
    return this.data.nugg_bank;
};

GameData.DepositNugg = function() {
    if(this.nuggetCount > 0) {
        this.nuggetCount--;
        this.data.nugg_bank++;
        this.SaveDataToStorage();
    }
};

GameData.GetFlashCopy = function() {
    return this.data.flash_copy;
};

GameData.SetFlashCopy = function() {
    this.data.flash_copy = {};

    this.data.flash_copy.x = frauki.x;
    this.data.flash_copy.y = frauki.y;
    this.data.flash_copy.layer = Frogland.currentLayer;

    this.SaveDataToStorage();

};