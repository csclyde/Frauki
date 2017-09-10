var GameData = {};

//When game data is requested, it is pulled from the data structure in memory. When
//it is saved, it is put into the data structure, and then put into local storage.
//So the only interaction with local storage is when the game loads, and when you
//save something to it. It doesn't constantly read out of local storage
GameData.data = {
    version: 0.2,
    dirty: true,

    checkpoint: '0',
    upgrades: ['Dive', 'Stab'],
    doors: [],
    shards: [],
    nugg_bank: 0,
    flash_copy: null,
    health: 3,
    flags: {},
    vals: {
        goddess_message_queue: []
    },
    debug_pos: { x: 0, y: 0 }
};

GameData.nuggetCount = 0;

GameData.LoadDataFromStorage = function() {
    var save_string = localStorage.getItem('save_data');

    if(!save_string || save_string === '') return;

    var save_data = JSON.parse(save_string);

    if(!!save_data && save_data.version !== 0.2) {
        save_data = null;
        localStorage.setItem('save_data', '');
    }
    if(save_data) {
        this.data = save_data;
        console.log('LOADING DATA', JSON.stringify(this.data));
    }
};

GameData.SaveDataToStorage = function() {
    localStorage.setItem('save_data', JSON.stringify(this.data));
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

GameData.GetCheckpoint = function() {
    return this.data.checkpoint;
};

GameData.SetCheckpoint = function(c) {
    if(this.data.checkpoint !== c) {
        this.data.checkpoint = c;
        this.SaveDataToStorage();
    }
};

GameData.GetMaxHealth = function() {
    return this.data.health;
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
