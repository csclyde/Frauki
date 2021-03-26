var GameData = {};

var currentVer = 0.5;

var defaultData = {
    version: currentVer,
    dirty: true,
    new: true,

    activeCheckpoints: [],
    upgrades: [],
    doors: [],
    shards: [],
    health: 3,
    shield: 0,
    flags: {},
    vals: {
        goddess_message_queue: []
    },
    debug_pos: { x: 0, y: 0 },

    settings: {
        sound: 0,
        music_option: 0,
        sfx_option: 0,
    }
};

//When game data is requested, it is pulled from the data structure in memory. When
//it is saved, it is put into the data structure, and then put into local storage.
//So the only interaction with local storage is when the game loads, and when you
//save something to it. It doesn't constantly read out of local storage
GameData.data = Object.assign({}, defaultData);

GameData.nuggetCount = 0;

GameData.LoadDataFromStorage = function() {
    var save_string = localStorage.getItem('save_data');

    if(!save_string || save_string === '') return;

    var save_data = JSON.parse(save_string);

    if(!!save_data && save_data.version !== currentVer) {
        save_data = null;
        localStorage.setItem('save_data', '');
    }
    if(save_data) {
        this.data = save_data;
    }
};

GameData.SaveDataExists = function() {
    return !this.data.new;
};

GameData.SaveDataToStorage = function() {
    this.data.new = false;
    this.data.dirty = false;
    localStorage.setItem('save_data', JSON.stringify(this.data));
};

GameData.GetSoundSetting = function() {
    return GameData.data.settings.sound;
};

GameData.SetSoundSetting = function(option) {
    GameData.data.settings.sound = option;
    this.SaveDataToStorage();    
};

GameData.ResetData = function() {
    var newData = Object.assign({}, defaultData);
    newData.settings = this.data.settings;
    this.data = newData;
    
    this.SaveDataToStorage();
};

GameData.GetDebugPos = function() {
    if(GameData.data.debug_pos.x !== 0 || GameData.data.debug_pos.y !== 0) {
        return GameData.data.debug_pos;
    } else {
        return null;
    }
};

GameData.SetDebugPos = function(x, y) {
    x = x || 0;
    y = y || 0;

    GameData.data.debug_pos.x = x;
    GameData.data.debug_pos.y = y;
    this.SaveDataToStorage();

}

GameData.SetFlag = function(name, val) {
    GameData.data.flags[name] = !!val;
    this.SaveDataToStorage();
};

GameData.GetFlag = function(name) {
    return !!GameData.data.flags[name];
};

GameData.SetVal = function(name, val) {
    GameData.data.vals[name] = val;
    this.SaveDataToStorage();
};

GameData.GetVal = function(name) {
    return GameData.data.vals[name];
}

//meant for one-time flags. If the flag hasnt been set, it returns true and sets the flag.
//If the flag has been set, it returns false and doesnt go through
GameData.GetSetFlag = function(name) {
    if(!GameData.data.flags[name]) {
        GameData.data.flags[name] = true;
        return true;
    } else {
        return false;
    }
};

GameData.AddActiveCheckpoint = function(c) {
    if(!this.data.activeCheckpoints.includes(c)) {
        this.data.activeCheckpoints.push(c);
        this.SaveDataToStorage();
    }
};

GameData.IsCheckpointActive = function(c) {
    return this.data.activeCheckpoints.includes(c);
}

GameData.GetNextActiveCheckpoint = function(curr) {
    if(this.data.activeCheckpoints.length <= 0) {
        return null;
    }

    var currIndex = this.data.activeCheckpoints.indexOf(curr);

    if(currIndex < 0) {
        return this.data.activeCheckpoints[0];
    }
    else if(currIndex === this.data.activeCheckpoints.length - 1) {
        return this.data.activeCheckpoints[0];
    }
    else {
        return this.data.activeCheckpoints[currIndex + 1];
    }
};

GameData.GetMaxHealth = function() {
    return this.data.health;
};

GameData.GetMaxShield = function() {
    return this.data.shield;
};

GameData.HasUpgrade = function(name) {
    return (this.data.upgrades.indexOf(name) > -1);
};

GameData.AddUpgrade = function(name) {
    
    if(name.indexOf('Health') >= 0) {
        this.data.health++;
        energyController.AddHealth(1);
        this.data.upgrades.push(name);
        this.SaveDataToStorage();
    } else if(name.indexOf('Shield') >= 0) {
        this.data.shield++;
        energyController.shield++;
        this.data.upgrades.push(name);
        this.SaveDataToStorage();

    } else if(this.data.upgrades.indexOf(name) < 0) {
        this.data.upgrades.push(name);
        this.SaveDataToStorage();
        weaponController.RefactorWeaponList();
    }
};

GameData.HasAnyUpgrades = function() {
    for(var i = 0; i < this.data.upgrades.length; i++) {
        if(this.data.upgrades[i].indexOf('Health') < 0) {
            return true;
        }
    }

    return false;
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

GameData.AddShard = function(name) {
    if(GameData.data.shards.indexOf(name) < 0) {
        GameData.data.shards.push(name);
        this.SaveDataToStorage();

    }
};

GameData.HasShard = function(name) {
    return GameData.data.shards.indexOf(name) >= 0;
};
