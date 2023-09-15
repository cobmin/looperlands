
var Types = require("../../shared/js/gametypes");

var Properties = {
    rat: {
        level: 1,
        drops: {
            flask: 40,
            burger: 10,
            firepotion: 5
        },
        respawnDelay: 10000,
    },
    
    skeleton: {
        level: 4,
        drops: {
            flask: 40,
            axe: 20,
            firepotion: 5
        },
        weaponMod: 1.5, //bgger mod cause attack rate is 50% slower
        respawnDelay: 45000,
    },
    
    goblin: {
        level: 3,
        drops: {
            flask: 50,
            axe: 10,
            firepotion: 5
        }
    },
    
    ogre: {
        level: 6,
        drops: {
            burger: 10,
            flask: 50,
            bluesword: 5,
            firepotion: 5
        }
    },
    
    spectre: {
        level: 9,
        drops: {
            flask: 30,
            redsword: 30,
            firepotion: 5
        },
        weaponMod: 1.25,
        hpMod: 0.8
    },
    
    deathknight: {
        level: 12,
        drops: {
            burger: 50,
            firepotion: 5
        },
        weaponMod: 0.9,
        hpMod: 1.2
    },
    
    crab: {
        level: 2,
        drops: {
            flask: 50,
            axe: 20,
            firepotion: 5
        }
    },
    
    snake: {
        level: 5,
        drops: {
            flask: 50,
            morningstar: 10,
            firepotion: 5
        },
        weaponMod: 1.2,
        armorMod: 0.5
    },
    
    skeleton2: {
        level: 20,
        drops: {
            burger: 30,
            firepotion: 10
        },
        weaponMod: 1.5, //bgger mod cause attack rate is 50% slower
        respawnDelay: 30000
    },
    
    eye: {
        level: 8,
        drops: {
            flask: 50,
            redsword: 10,
            firepotion: 5
        }
    },
    
    bat: {
        level: 3,
        drops: {
            flask: 50,
            axe: 10,
            firepotion: 5
        }
    },
    
    wizard: {
        level: 4,
        drops: {
            flask: 50,
            firepotion: 5
        }
    },
    
    boss: {
        level: 13,
        drops: {
            goldensword: 10,
            flask: 50
        },
        hpMod: 15,
        armorMod: 1.5,
        weaponMod: 2.5,
        redpacket: true,
        respawnDelay: 120000,
        xp: 7500  
    },

    slime: {
        level: 1,
        drops: {
            potion: 50,
            SLIMEBALL: 50,
        },
    },
    boar: {
        level: 1,
        drops: {
            BOARHIDE: 95,
        },
    },

    gnashling: {
        level: 3,
        drops: {
            potion: 80,
        },
    },

    loomleaf: {
        level: 10,
        drops: {
            potion: 100,
            
        },
        armorMod: 1.25,
        weaponMod: 2,
        hpMod: 3,
        xp: 3000,  
        respawnDelay: 30000
        
    },

    crystolith: {
        level: 12,
        drops: {
            ICESSENCE: 80,
        },
    },

    stoneguard: {
        level: 9,
        drops: {
            potion: 80,
        },
    },

    shiverrock: {
        level: 16,
        drops: {
            ICEKEY1: 100,
        },
    },
    shiverrockii: {
        level: 16,
        drops: {
            ICEKEY2: 100,
        },
    },
    shiverrockiii: {
        level: 16,
        drops: {
            ICEKEY3: 100,
        },
    },

    gloomforged: {
        drops: {
            FORGEDSWORD: 40,
        },
        level: 20,
        armorMod: 1.25,
        weaponMod: 1.1
    },

    thudlord: {
        level: 6,
        drops: {
            THUDKEY: 100,
        },
        weaponMod: 1.2,
        hpMod: 4,
        armorMod: 1.25


    },

    grizzlefang: {
        level: 6,
        drops: {
            ORB: 100,
        },
    },
    barrel: {
        level: 1,
        xp: 0,
        drops: {
            WILDBLADE: 40,
        },
    },
    
    kingslime: {
        level: 3,
        drops: {
            potion: 100,
        messages: ['Bow to the gelatinous crown', 'Flowing, shifting, unstoppable', 'Dissolve within my embrace', 'I am boundless, ever-spreading', 'Your struggles make the kingdom grow'],
        armorMod: 0.75,
        hpMod: 3,
        },
    },

    silkshade: {
        level: 7,
        drops: {
            potion: 50,
        },
        messages: ['Darkness shall embrance you!', 'Your doom is woven', 'Fear binds you', 'Your end is spun', 'The old world beckons you'],   
        armorMod: 1,
        hpMod: 3,
        weaponMod: 0.8,
        respawnDelay: 30000,
        xp: 1000
        
        
    },

    glacialord: {
        level: 20,
        drops: {
            potion: 50,
        },
        messages: ['Frost consumes you!', 'Ice seals your fate!', 'I am eternal Cold!', 'Cold as death', 'Shatter!'],   
        armorMod: 1,
        hpMod: 5,
        weaponMod: 0.8,
        respawnDelay: 30000,
        xp: 3000
        
        
    },

    nightharrow: {
        level: 25,
        drops: {
            potion: 50,
        },
        aoe: {
            damage: 100,
            range: 2
        },
        messages: ['Endings begin with me.', 'Kneel!', 'Dawn shall never rise.', 'Face the endless night!', 'Embrace the final dusk.!'],   
        armorMod: 1.8,
        hpMod: 30,
        weaponMod: 2.2,
        respawnDelay: 1800000,
        xp: 9000
        
        
        
    },


    wildgrin: {
        level: 7,
        drops: {
            potion: 100,
        },
    },      
    

    redslime: {
        level: 2,
        drops: {
            potion: 50,
            REDOOZE: 50,
        },
    },     

    spider: {
        level: 4,
        drops: {
            potion: 65,
        },
    },  

    fangwing: {
        level: 4,
        drops: {
            potion: 40,
            BATWING: 65,
        },
    },  

    arachweave: {
        level: 5,
        drops: {
            KEY_ARACHWEAVE: 100,
        },
    },  
    
    minimag: {
        level: 16,
        drops: {
            flask: 50
        },
        aoe: {
            damage: 60,
            onDeath: true
        },
        armorMod: 2,
        weaponMod: 0.8
    },

    megamag: {
        level: 20,
        drops: {
            burger: 100
        },
        armorMod: 2.5,
        weaponMod: 2.5,
        hpMod: 20,
        aoe: {
            damage: 100,
            range: 2
        },
        redpacket: true,
        xp: 50000,  
        expMultiplier: {
            duration: 1200
        },
        messages: ['Perish!', 'Be gone!', 'Burn!', 'Wither!', 'Suffer!'],
        respawnDelay: 1800000
    },

    cobchicken: {
        level: 1,
        friendly: true
    },

    cobcow: {
        level: 1,
        friendly: true
    },
    
    cobpig: {
        level: 1,
        friendly: true
    },
    
    cobgoat: {
        level: 1,
        friendly: true
    },

    ghostie: {
        level: 10,
        drops: {
            cobapple: 50,
            cobcorn: 10
        },
        armorMod: 0.75,
        hpMod: 0.75
    },

    cobslimered: {
        level: 6,
        drops: {
            cobapple: 20,
            cobcorn: 10,
            redsword: 5
        }
    },

    cobslimeyellow: {
        level: 4,
        drops: {
            cobapple: 30,
            morningstar: 5
        }
    },

    cobslimeblue: {
        level: 2,
        drops: {
            cobapple: 20,
            axe: 5
        }
    },

    cobslimeking: {
        level: 8,
        drops: {
            cobclover: 100
        },
        armorMod: 1.25,
        weaponMod: 2,
        hpMod: 10,
        xp: 2500,  
        respawnDelay: 300000
    },

    alaric: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },

    fvillager1: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },    

    villager1: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager2: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager3: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager4: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager5: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager6: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager7: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager8: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager9: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager10: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager11: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager12: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager13: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager14: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager15: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager16: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager17: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager18: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager19: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager20: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager21: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager22: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager23: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager24: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager25: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager26: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager27: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager28: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    villager29: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager1: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager2: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager3: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager4: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager5: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager6: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager7: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager8: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager9: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager10: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager11: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager12: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager13: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager14: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager15: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager16: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager17: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager18: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager19: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager20: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager21: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager22: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager23: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager24: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager25: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager26: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager27: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager28: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager29: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager30: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    fvillager31: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    
    jayce: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },
    orlan: {
        hp: 10,
        armor: 1,
        weapon: 1,
        friendly: true
    },

    cobcat: {
        level: 1,
        friendly: true
    },

    cobyorkie: {
        level: 1,
        friendly: true
    },

    //Field effects
    magcrack: {
        aoe: {
            damage: 100,
            range: 1
        }
    },

    //Items
    coblog: {
        respawnDelay: 60000
    }
};

Properties.getArmorLevel = function(kind, levelOffset) {
    try {
        if(Types.isMob(kind)) {
            let level = Properties.getLevel(kind);
            if (Properties[Types.getKindAsString(kind)].armor !== undefined) {
                return Math.round(Properties[Types.getKindAsString(kind)].armor * (level + levelOffset) / level);
            } else {
                return Math.round((0.5 * (level + levelOffset)) * Properties.getArmorMod(kind));
            }
        } else {
            return 1;
        }
    } catch(e) {
        console.error("No level found for armor: "+Types.getKindAsString(kind));
    }
    return 1;
};

Properties.getWeaponLevel = function(kind, levelOffset) {
    try {
        if(Types.isMob(kind)) {
            let level = Properties.getLevel(kind);
            if (Properties[Types.getKindAsString(kind)].weapon !== undefined) {
                return Math.round(Properties[Types.getKindAsString(kind)].weapon * (level + levelOffset) / level);
            } else {
                return Math.round((0.4 * (level + levelOffset) + (level + levelOffset - 1) * 0.5) * Properties.getWeaponMod(kind));
            }
        } else {
            return Types.getWeaponRank(kind);
        }
    } catch(e) {
        console.error("No level found for weapon: "+Types.getKindAsString(kind));
    }
};

Properties.getHitPoints = function(kind, levelOffset) {
    let level = Properties.getLevel(kind);

    if (Properties[Types.getKindAsString(kind)].hp !== undefined) {
        return Math.round(Properties[Types.getKindAsString(kind)].hp * (level + levelOffset) / level);
    } else {
        return Math.round((level + levelOffset) * 25 * Properties.getHpMod(kind));
    }
};

Properties.getLevel = function(kind) {
    retLevel = Properties[Types.getKindAsString(kind)].level;
    return retLevel !== undefined ? retLevel : 1;
};

Properties.getHpMod = function(kind) {
    retMod = Properties[Types.getKindAsString(kind)].hpMod;
    return retMod !== undefined ? retMod : 1;
};

Properties.getArmorMod = function(kind) {
    retMod = Properties[Types.getKindAsString(kind)].armorMod;
    return retMod !== undefined ? retMod : 1;
};

Properties.getWeaponMod = function(kind) {
    retMod = Properties[Types.getKindAsString(kind)].weaponMod;
    return retMod !== undefined ? retMod : 1;
};

module.exports = Properties;