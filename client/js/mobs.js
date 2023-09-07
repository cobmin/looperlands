
define(['mob', 'timer'], function(Mob, Timer) {

    var Mobs = {
        Rat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.RAT);
                this.moveSpeed = 350;
                this.idleSpeed = 700;
                this.shadowOffsetY = -2;
                this.isAggressive = false;
                this.aggroRange = 1;
                this.deathAnimated = true;
            }
        }),

        Skeleton: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKELETON);
                this.moveSpeed = 350;
                this.atkSpeed = 100;
                this.idleSpeed = 800;
                this.shadowOffsetY = 1;
                this.setAttackRate(1200);
            }
        }),

        Skeleton2: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SKELETON2);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 800;
                this.walkSpeed = 200;
                this.shadowOffsetY = 1;
                this.aggroRange = 3;
                this.setAttackRate(1200);
            }
        }),

        Spectre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPECTRE);
                this.moveSpeed = 150;
                this.atkSpeed = 50;
                this.idleSpeed = 200;
                this.walkSpeed = 200;
                this.shadowOffsetY = 1;
                this.setAttackRate(900);
            }
        }),
        
        Deathknight: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.DEATHKNIGHT);
                this.atkSpeed = 50;
        		this.moveSpeed = 220;
        		this.walkSpeed = 100;
        		this.idleSpeed = 450;
        		this.setAttackRate(800);
        		this.aggroRange = 3;
            },
            
            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Goblin: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GOBLIN);
                this.moveSpeed = 150;
                this.atkSpeed = 60;
                this.idleSpeed = 600;
                this.setAttackRate(700);
                this.aggroRange = 2;
            }
        }),

        Ogre: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.OGRE);
                this.moveSpeed = 300;
                this.atkSpeed = 100;
                this.idleSpeed = 600;
                this.aggroRange = 5;
            }
        }),

        Crab: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.CRAB);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 500;
            }
        }),

        Snake: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNAKE);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 250;
                this.walkSpeed = 100;
                this.shadowOffsetY = -4;
                this.aggroRange = 5;
            }
        }),

        Eye: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.EYE);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 50;
            }
        }),

        Bat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BAT);
                this.moveSpeed = 120;
                this.atkSpeed = 90;
                this.idleSpeed = 90;
                this.walkSpeed = 85;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),

        Wizard: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WIZARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
            }
        }),

        Boss: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.BOSS);
                this.moveSpeed = 300;
                this.atkSpeed = 50;
                this.idleSpeed = 400;
                this.atkRate = 2000;
                this.attackCooldown = new Timer(this.atkRate);
        		this.aggroRange = 3;
                this.title = "BOSS";
            },
            
            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Slime: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SLIME);
                this.moveSpeed = 250;
                this.idleSpeed = 100;
                this.atkSpeed = 100;
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 1;
            }
        }),
        Gnashling: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GNASHLING);
                this.moveSpeed = 300;
                this.idleSpeed = 100;
                this.atkSpeed = 100;            
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),        

        Wildgrin: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.WILDGRIN);
                this.moveSpeed = 300;
                this.idleSpeed = 100;
                this.atkSpeed = 100;              
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),

        Thudlord: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.THUDLORD);
                this.moveSpeed = 300;
                this.idleSpeed = 100;
                this.atkSpeed = 100;              
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 3;
                this.deathAnimated = true;
            }
        }),

        Loomleaf: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.LOOMLEAF);
                this.moveSpeed = 300;
                this.idleSpeed = 100;
                this.atkSpeed = 50;                
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 3;
                this.deathAnimated = true;
            }
        }),        

        Redslime: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDSLIME);
                this.moveSpeed = 250;
                this.idleSpeed = 100;
                this.atkSpeed = 100;                
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.aggroRange = 1;
            }
        }),

        Alaric: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ALARIC);
                this.idleSpeed = 500;
                this.walkSpeed = 250;
                this.moveSpeed = 333;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Jayce: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.JAYCE);
                this.idleSpeed = 500;
                this.walkSpeed = 250;
                this.moveSpeed = 333;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Orlan: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ORLAN);
                this.idleSpeed = 500;
                this.walkSpeed = 250;
                this.moveSpeed = 333;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Kingslime: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.KINGSLIME);
                this.moveSpeed = 250;
                this.idleSpeed = 100;
                this.shadowOffsetY = -2;
                this.atkSpeed = 100;                
                this.isAggressive = true;
                this.aggroRange = 1;
                this.deathAnimated = true;
                this.title = "ELITE";
            }
        }),       
        
        Silkshade: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SILKSHADE);
                this.moveSpeed = 500;
                this.idleSpeed = 100;
                this.shadowOffsetY = -2;
                this.isAggressive = true;
                this.atkSpeed = 100;
                this.aggroRange = 3;
                this.deathAnimated = true;
                this.title = "FANGLORD";
            }
        }),         

        Spider: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPIDER);
                this.moveSpeed = 350;
                this.idleSpeed = 100;
                this.shadowOffsetY = -2;
                this.atkSpeed = 100;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),

        Fangwing: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.FANGWING);
                this.moveSpeed = 350;
                this.idleSpeed = 100;
                this.shadowOffsetY = -2;
                this.atkSpeed = 100;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),

        Arachweave: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.ARACHWEAVE);
                this.moveSpeed = 350;
                this.idleSpeed = 100;
                this.shadowOffsetY = -2;
                this.atkSpeed = 100;
                this.isAggressive = true;
                this.aggroRange = 3;
            }
        }),

        Minimag: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MINIMAG);
                this.idleSpeed = 1000;
                this.walkSpeed = 125;
                this.atkSpeed = 75;
                this.moveSpeed = 150;
                this.aggroRange = 3;
        		this.setAttackRate(1000);
                this.deathAnimated = true;
            }
        }),

        Megamag: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.MEGAMAG);
                this.idleSpeed = 1000;
                this.restoreDefaultMovement();
                this.aggroRange = 4;
                this.atkSpeed = 100;
        		this.setAttackRate(2000);
                this.deathAnimated = true;
                this.title = "BOSS";
            },

            restoreDefaultMovement: function () {
                this.moveSpeed = 250;
                this.walkSpeed = 150;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            },

            doSpecial: function() {
                let self=this;

                self.moveSpeed = 100; // Charge at the target
                self.walkSpeed = 75; 
                let rootTarget;

                if (self.hasTarget()){
                    rootTarget = self.target;
                    rootTarget.root();
                }
                
                function smashAoe(unrootTarget){
                    if (unrootTarget) {
                    unrootTarget.unroot();
                    }

                    self.root();
                    self.animationLock = true; // Prevent special animation from being cancelled by movement
                    self.animate("special", 150, 1, function () {
                        self.animationLock = false;
                        self.unroot();
                        self.restoreDefaultMovement();
                        self.idle();
                    });
                }

                setTimeout(function () {
                    smashAoe(rootTarget);
                }, 2000); // Change this duration also in server/worldserver.js      
            }
        }),
        
        Cobchicken: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBCHICKEN);
                this.idleSpeed = 500;
                this.walkSpeed = 250;
                this.moveSpeed = 333;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Cobcow: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBCOW);
                this.idleSpeed = 500;
                this.walkSpeed = 350;
                this.moveSpeed = 500;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Cobpig: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBPIG);
                this.idleSpeed = 500;
                this.walkSpeed = 300;
                this.moveSpeed = 400;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Cobgoat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBGOAT);
                this.idleSpeed = 500;
                this.walkSpeed = 250;
                this.moveSpeed = 333;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Ghostie: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.GHOSTIE);
                this.idleSpeed = 500;
                this.walkSpeed = 200;
                this.atkSpeed = 100;
                this.moveSpeed = 250;
                this.aggroRange = 3;
        		this.setAttackRate(1250);
                this.deathAnimated = true;
                this.isFriendly = true;
                this.setVisible(false);
                this.aggroMessage = "Boo!";
            },

            appear: function() {
                this.isFriendly = false;
                this.setVisible(true);
                this.fadeIn(new Date().getTime());
            },

            breakFriendly: function(player) {
                if (this.isFriendly && this.isNear(player, this.aggroRange - 1) && !this.exitingCombat) {
                    this.appear()
                    return true;
                }
                return false;
            },

            joinCombat: function() {
                this._super();
                if (this.inCombat && this.isFriendly) {
                    this.appear();
                }
            },

            exitCombat: function() {
                this._super();
                let self = this;
                this.isFriendly = true;
                
                this.exitingCombat = setTimeout(function() {
                    self.setVisible(false);
                    self.exitingCombat = null;
                }, 1500)  
            }
        }),

        Cobslimered: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBSLIMERED);
                this.moveSpeed = 250;
                this.atkSpeed = 100;
                this.idleSpeed = 750;
                this.setAttackRate(1000);
                this.deathAnimated = true;
                this.aggroRange = 3;
            }
        }),

        Cobslimeyellow: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBSLIMEYELLOW);
                this.moveSpeed = 300;
                this.atkSpeed = 100;
                this.idleSpeed = 750;
                this.setAttackRate(1000);
                this.deathAnimated = true;
                this.aggroRange = 2;
            }
        }),

        Cobslimeblue: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBSLIMEBLUE);
                this.moveSpeed = 350;
                this.atkSpeed = 100;
                this.idleSpeed = 750;
                this.setAttackRate(1000);
                this.deathAnimated = true;
                this.aggroRange = 1;
            }
        }),

        Cobslimeking: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBSLIMEKING);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 750;
                this.setAttackRate(1000);
                this.aggroRange = 4;
                this.deathAnimated = true;
                this.title = "BOSS";
            },

            doSpecial: function() {
                let self=this;

                self.animationLock = true; // Prevent special animation from being cancelled by movement
                self.animate("special", 150, 1, function () {
                        self.animationLock = false;
                        self.idle();
                    });
            },

            exitCombat: function() {
                this._super();
                let self = this;
                this.isFriendly = true;
                /* Currently when mob exits combat (eg. out of range from spawn) he can INSTANTLY aggro back, 
                which creates all sort of weird behaviours. For example you can kite a mob endlessly out of his area (25 tiles),
                as long, as you move away slowly and never exceed the aggro range. This will make the mob aggro you instantly after un-aggroing
                but at the same time reset his arrays, such as hatelist, dmgTakenArray, addsArray etc.
                In my opinion the code below should be a default behavior for every single mob (think mob evading in WoW), and should eventually
                be moved to _super. For now its here for "test purposes"*/    
                this.exitingCombat = setTimeout(function() {
                    self.isFriendly = false;
                    self.exitingCombat = null;
                }, 4000)  
            }
            
        }),

        Cobcat: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBCAT);
                this.idleSpeed = 333;
                this.walkSpeed = 250;
                this.moveSpeed = 300;
                this.isFriendly = true;
            },

            idle: function(orientation) {
                if(!this.hasTarget()) {
                    this._super(Types.Orientations.DOWN);
                } else {
                    this._super(orientation);
                }
            }
        }),

        Cobyorkie: Mob.extend({
            init: function(id) {
                this._super(id, Types.Entities.COBYORKIE);
                this.idleSpeed = 500;
                this.walkSpeed = 225;
                this.moveSpeed = 250;
                this.isFriendly = true;
            }
        }),
    };
    return Mobs;
});
