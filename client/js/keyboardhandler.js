class KeyBoardHandler {
    constructor(game) {
        this.keys = {
            w: 0,
            a: 0,
            s: 0,
            d: 0
        };

        this.weapons = null;

        this.keyCallbacks = {
            'Comma': () => this.previousWeapon(),
            'Period': () => this.nextWeapon()
        };
        this.game = game;
        this.interval = false;

        console.log("Created keyboard handler");

        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        window.addEventListener('blur', this.handleBlur.bind(this));
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = 1;
            if (!this.interval) {
                this.handleMovement(); // Execute one instantly so there's no interval delay
                this.interval = setInterval(this.handleMovement.bind(this), 25);
            }
        }

        if(this.keyCallbacks.hasOwnProperty(event.code)) {
            this.keyCallbacks[event.code]();
        }
    }

    handleKeyUp(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = 0;
            if (this.interval && Object.values(this.keys).every((v) => v === 0)) {
                clearInterval(this.interval);
                this.interval = false;
            }
        }
    }

    handleMovement() {
        if (this.game.player.path != null || $('#chatbox').hasClass("active")) {
            return;
        }
        var x = this.game.player.gridX;
        var y = this.game.player.gridY;
        this.game.click({ x: x + this.keys.d - this.keys.a, 
                          y: y + this.keys.s - this.keys.w, 
                          keyboard: true});
    }

    handleBlur() {
        for (let k in this.keys) {
            if(this.keys.hasOwnProperty(k)) {
                this.keys[k] = 0;
            }
        }
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = false;
        }
    }

    previousWeapon() {
        if(!this.game.player.hasWeapon()) {
            return
        }

        if(!this.game.started || this.inputHasFocus() || this.hasOpenPanel()) {
            return;
        }

        let self = this;
        this.getWeapons((weapons) => {
            self.equipWeapon(self.getNextWeapon(weapons));
        });
    }

    nextWeapon() {
        if(!this.game.player.hasWeapon()) {
            return
        }

        if(!this.game.started || this.inputHasFocus() || this.hasOpenPanel()) {
            return;
        }

        let self = this;
        this.getWeapons((weapons) => {
            self.equipWeapon(self.getPreviousWeapon(weapons));
        });
    }

    inputHasFocus() {
        const elem = document.activeElement;
        return elem && (elem.tagName.toLowerCase() === "input" || elem.tagName.toLowerCase() === "textarea");

    }

    hasOpenPanel() {
        return $('body').hasClass('settings') ||
            $('body').hasClass('about') ||
            $('body').hasClass('credits') ||
            $('#chatbox').hasClass("active");
    }

    equipWeapon(weapon) {
        let weaponId = Types.Entities[weapon];
        let nftId = weapon.replace("NFT_", "0x");
        this.game.client.sendEquipInventory(weaponId, nftId);
        this.game.player.switchWeapon(weapon,1);
    }

    getWeapons(callback) {
        if(this.weapons == null) {
            var inventoryQuery = "/session/" + this.game.sessionId + "/inventory";
            let self = this;
            axios.get(inventoryQuery).then(function(response) {
                self.weapons = [];
                var inventory = response.data.map(function(item) {
                    return item.replace("0x", "NFT_");
                });

                inventory.forEach(function(item) {
                    if (Types.isWeapon(Types.Entities[item])) {
                        self.weapons.push(item);
                    }
                });
                callback(self.weapons);
            });
        } else {
            callback(this.weapons);
        }
    }

    getPreviousWeapon(weapons) {
        var currentWeapon = this.game.player.getWeaponName();
        var currentWeaponIndex = weapons.indexOf(currentWeapon);
        var prevWeaponIndex = (currentWeaponIndex + 1) % weapons.length;

        return weapons[prevWeaponIndex];
    }

    getNextWeapon(weapons) {
        var currentWeapon = this.game.player.getWeaponName();
        var currentWeaponIndex = weapons.indexOf(currentWeapon);
        var nextWeaponIndex;
        if(currentWeaponIndex === 0) {
            nextWeaponIndex = weapons.length -1;
        } else {
            nextWeaponIndex = (currentWeaponIndex - 1) % weapons.length;
        }

        return weapons[nextWeaponIndex];
    }
}