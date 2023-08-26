
define(['infomanager', 'bubble', 'renderer', 'map', 'animation', 'sprite', 'tile',
        'warrior', 'gameclient', 'audio', 'updater', 'transition', 'pathfinder',
        'item', 'mob', 'npc', 'player', 'character', 'chest', 'mobs', 'exceptions', 'config', '../../shared/js/gametypes'],
function(InfoManager, BubbleManager, Renderer, Mapx, Animation, Sprite, AnimatedTile,
         Warrior, GameClient, AudioManager, Updater, Transition, Pathfinder,
         Item, Mob, Npc, Player, Character, Chest, Mobs, Exceptions, config) {
    
    var Game = Class.extend({
        init: function(app) {
            this.app = app;
            this.app.config = config;
            this.ready = false;
            this.started = false;
            this.hasNeverStarted = true;
        
            this.renderer = null;
            this.updater = null;
            this.pathfinder = null;
            this.chatinput = null;
            this.bubbleManager = null;
            this.audioManager = null;
        
            // Player
            this.player = new Warrior("player", "");
    
            // Game state
            this.entities = {};
            this.deathpositions = {};
            this.entityGrid = null;
            this.pathingGrid = null;
            this.renderingGrid = null;
            this.itemGrid = null;
            this.currentCursor = null;
            this.mouse = { x: 0, y: 0 };
            this.zoningQueue = [];
            this.previousClickPosition = {};
    
            this.selectedX = 0;
            this.selectedY = 0;
            this.selectedCellVisible = false;
            this.targetColor = "rgba(255, 255, 255, 0.5)";
            this.targetCellVisible = true;
            this.hoveringTarget = false;
            this.hoveringMob = false;
            this.hoveringItem = false;
            this.hoveringCollidingTile = false;
            this.doorCheck = false;
        
            // combat
            this.infoManager = new InfoManager(this);
        
            // zoning
            this.currentZoning = null;
        
            this.cursors = {};

            this.sprites = {};
        
            // tile animation
            this.animatedTiles = null;
            this.highAnimatedTiles = null;
        
            // debug
            this.debugPathing = false;
        
            // sprites
            this.spriteNames = ["hand", "sword", "loot", "target", "talk", "sparks", "shadow16", "rat", "skeleton", "skeleton2", "spectre", "boss", "deathknight", 
                                "ogre", "crab", "snake", "eye", "bat", "goblin", "wizard", "guard", "king", "villagegirl", "villager", "coder", "agent", "rick", "scientist", "nyan", "priest", 
                                "king2", "goose", "tanashi", "slime","kingslime","silkshade","redslime","villagesign1","wildgrin","loomleaf","gnashling","spider", "minimag", "miner", "megamag", 
                                "cobchicken", "cobcow", "cobpig", "cobgoat", "ghostie",
                                "sorcerer", "octocat", "beachnpc", "forestnpc", "desertnpc", "lavanpc","thudlord", "clotharmor", "leatherarmor", "mailarmor",
                                "platearmor", "redarmor", "goldenarmor", "firefox", "death", "sword1","torin","elric", "axe", "chest",
                                "sword2", "redsword", "bluesword", "goldensword", "item-sword2", "item-axe", "item-redsword", "item-bluesword", "item-goldensword", "item-leatherarmor", "item-mailarmor", 
                                "item-platearmor", "item-redarmor", "item-goldenarmor", "item-flask", "item-potion","item-cake", "item-burger", "morningstar", "item-morningstar", "item-firepotion",
                                "item-KEY_ARACHWEAVE",
                                // @nextObjectLine@
                                "NFT_c762bf80c40453b66f5eb91a99a5a84731c3cc83e1bcadaa9c62e2e59e19e4f6",
                                "NFT_38278eacc7d1c86fdbc85d798dca146fbca59a2e5e567dc15898ce2edac21f5f",
                                "NFT_d2fb1ad9308803ea4df2ba6b1fe0930ad4d6443b3ac6468eaedbc9e2c214e57a",
                                "NFT_b03847a6a7c25e8f52016c0ffca8e7d608593f004c17f3519506b4d0a42d61bf",
                                "NFT_3c1fa300af2deef916ade14eb6ca68dd14913e4adc4a4d174ea98f1f878ef733",
                                "NFT_cfd9a7ae82698da0da065befb2b39f3bfe3eca509febdb9da865fafd4d98e543",
                                "NFT_b131df57290a3c656d6cf35b10e4d342e147345ca01c9cf34ad13205d0e43e50",
                                "NFT_9f051ae4b657a07bc82d8d1fac5a5263ca0cb33e3be717c29814d06fa4860487",
                                "NFT_01346618000000000000000002386f26fc10000000000000000000000000037b",
                                "NFT_82e68ef0bee270d142ae3ec162490c0fa2e88a273bb768687f2fee4f6930c741",
                                "NFT_17222e7f16e5fb69bbc410f8c093cf92904ab8d2e4681a6bc9dee01900d8e6b7",
                                "NFT_2bab6c4b9cbb8eddb94614bb05e2b4b67b229e6e94ea7b152d74d1a1e2e21360",
                                "NFT_b26214bac18f742d93b948c44ccd05c768f8344c7c89d6550a67e4f919ad7e6f",
                                "NFT_b26214bac18f742d93b948c44ccd05c768f8344c7c89d6550a67e4f919ad7e6f",
                                "NFT_2530bd882f78be80636b02467386e272f87bdb27d6762b41bd09dd71407bdcb1",
                                "NFT_5454cad3ebe151e92b53083d0ae6f8a03273fd86c4af33d1ef2991bbe8dae198",
                                "NFT_20fdfc6fa49d9001f154ef03129ba66a6bc606489631fbc181751bd17fb1d520",
                                "NFT_426754b71f8ac324122c64c541a99e1888602a06c2e7a203568d3a9fb0281263",
                                "NFT_691b67e4466879e4de582f765b85a5bbc1cacc087b9c0f410a86f00d32081ea7",
                                "NFT_ee40d44f7847999cb4d7d1e3fc7681e1390fc5acc5e835d1e8f0ed717d4dc200",
                                "NFT_d1570dc356007d297c8ee63716d38d264a621516f44e3305839fc29ca36e2ce2",
                                "NFT_b494d78bf1bfd47fc5041f6798393d9d1ce2583b83c7f417c48ba42898a4dfb9",
                                "NFT_890b68d8d9de6f5663ee1708f397dd3e8951a1aafeaa4f813f1c4dae1aa81b3e",
                                "NFT_bfdb6d8dcfd68eb606e0e4dd2b134862ab8904fb91b867a455ea7d25a0b97689",
                                "NFT_ec837cab68f84faae57d74b7901299f5b44776a7e90e85aae010db1408c4d5c3",
                                "NFT_27c27cc825e7791664c10d7012b9ba9a6e2b1ded166a4e1bd49158fecc7e14cf",
                                "NFT_eac17febcaf13e4f2a07aab923d7e527a8414712b9f6732465970e16853f0daa",
                                "NFT_119a557bf20a9105348c45deda0f96308bd6b20c1680dbcf7ac3c0439e96fc08",
                                "NFT_dd722e34afdc01212b4d839a0a33ab351322ddeff41f78cf1064c36c0f44977a",
                                "NFT_9c5a99f779cca31efcf5d6235b07c485f97f598838bbeb3c37f739f800af8fd5",
                                "NFT_5e0f26b192f798ca594fa48d6a0820a1f8fce40df49ddfed75d61020f952ee5f",
                                "NFT_fab0c923caef4d9666e41097512bb02ed1283afa0199e10031a0a24a00008daa",
                                "NFT_01348c02000000000000000002386f26fc1000000000000000000000000001d6",
                                "NFT_aa161f880bb5cbed5813fed087358be7a44f889692e2baea3cc86c978897f0b3",
                                "NFT_2ed54cfb0a51b0c5a66348f7efbe78b61776a4e0252901763121242888a3be44",
                                "NFT_2bc716999d2ebea388c39b26ed6e66066d98c76412318f7f5e1c92f27f1a434a",
                                "NFT_afcac9c2899f3c300a8e302057aa1740fda5544846a0bd026e041b75b8c50c77",
                                "NFT_602543f900cdec7536e01121bae04d98cf5f26dc04fdd2e65f45dcb80ccc7b52",
                                "NFT_8bf0ca782646556769462a2e111e63acbacba43bb50e4fff8cebd04ebfd012c4",
                                "NFT_72021bcc7f2688a31f25a0e409423c313f527a21fd06375147db912de5d25af9",
                                "NFT_bffd3956245711a307883001df9eccf361eb29577e4cfc9eb14044b32bdc0cc8",
                                "NFT_2b6563700e47217141759e87138a36b3c424860b599f4edee04476f1cf287d7d",
                                "NFT_4232658f50f5f154784e3a896aef114eb8c88f0446df68e1a0155249fccb84bf",
                                "NFT_968e6d77eb1f01c8f6f0963c15d22c51c5972e5e903dd58a52f307c670afabba",
                                "NFT_c3f9e6e0285aef34a3383f1e4e9dd81400f047f29ca101f7f3186676eba4090a",
                                "NFT_e306ddc52e528b7bca4a5a5ab111bc90f4184d6c78858e25de62070c9df275bc",
                                "NFT_604f23674ed95c65f8f71cf1fe70f19edbeaed55a0ec20906f42d10e2405f68c",
                                "NFT_894b121ef3fa401aced39ae51cb2fefd24afdb1c96d8de22f8a5c233d3f4b304",
                                "NFT_147aabee5edf37ae03e40c22553d7dd7fe1ec74201f304c74766658afb8ed6ec",
                                "NFT_f6e3fd53b09c5bb4794a934e8a77f0cb7dc85e3da702f14923cad0493b6c7fd6",
                                "NFT_7bda27fa0906a95f7159fa664719705d74932343ea29667fb7be4d648203eb29",
                                "NFT_36c33534840bfb6e9a5eb14c419f4def0a7869d48fe0877cce881a1440a03758",
                                "NFT_28873816c3d11391f97a5f70005a05acbad0c3a264026548a826b3bcb957820a",
                                "NFT_2b55be5f9f0c72236a8d7e4922719f6a783d368021bac81b815737fb3b65893e",
                                "NFT_59d24c70d2310fccf9d294bbd6c7e7368a0a098b05bb2dd981d2a97d8881aefe",
                                "NFT_22e07e494cf1802cd2d5593df40c22cd2a2d34716e0a82d370408d5cb0072f84",
                                "NFT_ea0b89688f49bd4e18a788e2bbfe2aaec34abe5a5c160bd98fb5389875a94fcb",
                                "NFT_48963675d6796a51d8c4d2ce1db7e29b9f068f1c335b3aa7be163593cf1d6fb7",
                                "NFT_e0da11e21877748f3821344cb15744a5572fa1cddefa665098db7ea6f44af747",
                                "NFT_cf005295ee67845a9e43a05e196269677f5b62dd82dcb5b67dd3a836faa1e06d",
                                "NFT_bfeb604f9c3b49e7e5962964f49200b25ca7463b1b0868509e37ae3a3f5497f0",
                                "NFT_153269d1418275b40a0f2019def17aeef133d3fc628db717d8643b09111ea287",
                                "NFT_9a1a0dab20f6b3b07f250edfd8ea0812bf6347cf4d4b1580a9be05b5cd895b55",
                                "NFT_7b2fb5b960273ac27a6335ef53e7bf64db642e71081dd2b7597fd0dd1821bdad",
                                "NFT_302ff52132d5729f608e6d5d0daf1c850f60237d2078c5aca17f43df507c830b",
                                "NFT_aa40bd2c34935969c370d5de419530fd63976a3cfa7919d2b30eadb0d32cd641",
                                "NFT_2684093e8291c34fc6eecf8ac635fb625d34729f71ca31810b475f1c8bc322ea",
                                "NFT_3a5a1e0305d3badb725085465b307366a4f15fd26eb81cfcb4574857db4d1460",
                                "NFT_ba676e35ebaeda5cdab7765ac1e4523973a1cf12e1cce416544d2c1be26c23c2",
                                "NFT_cee6596166b80f7a75813673dadc7508d4994c54e49b9740957233170c7d832a",
                                "NFT_e2c610a40bf59f9b5cb3bc646bc767e53200c25a26940d1f9c8f5e1dd159726c",
                                "NFT_ef3c4d2b065f9a59adde2424f0cb8a02f8bf77655986e2c936abbba4bac4ae78",
                                "NFT_47718ab5f343e019944a3ba0afe611a7fc43d4c4820830b0568083e199d384a9",
                                "NFT_214c5433256da27fd26f839588340d8cf965cfdcc1f7e9ca7e53c94718466b0e",
                                "NFT_efbc96ecaa696501324a0802fa1da688df1dff6c8ea8e3c91e8cd6fb6917e02b",
                                "NFT_fa754d960bad700b8924942d2bb2a955440a8a54f72971de162f081c30db7465",
                                "NFT_3e6fe4c9853bc8f3e55d9debde9f2a22952e349cae47d3df3110ff1e604b3c77",
                                "NFT_35f875a25ecbe801528e6819ef7e203434d209784c7b3bea544c4b9396a5b0e7",
                                "NFT_d404b2f3e2db47a28e2d43e77bd33d471589499c4ddd1770aacc32fa472bf8ad",
                                "NFT_0d5672a0b87858af764cc1169caee403e405692265e54eb90253e22e74132085",
                                "NFT_89343e3a4053cccdab06c300954167b2f916a257042bf64a0014099faecaa260",
                                "NFT_750b4661b3dddf0d39d5c32f95e1ef8fe030a37d695c069364a6f85cd8034e67",
                                "NFT_e2bcc3eeadb9eb414845b645446739583b5b9d18a6f014c36d3bccd0eec03bdf",
                                "NFT_aa8119ad254b4a6b205e65e7dc3d5b7f75d8755362d22908ae7197313daff633",
                                "NFT_cddc6c916c0939d98ed089cfcc4ba4f894aeffc1907f881d7dabbc999f2e13db",
                                "NFT_0351abda19f8eb0279bc255a58a3577f8a9a47f352b7345d6c9f5faf34c2740d",
                                "NFT_34d456b74f6be2c43ede9cfe3fa3a491eff4a295fab61bcaec3b173e496a3983",
                                "NFT_124e174b52fcd27b1efd81ab98b27855f54e3f427baa6bc1747fe7856e44fefd",
                                "NFT_8ba174b413a393aa5a592dd55a73479225e60fc7b92f206f1c988a3d0684aa86",
                                "NFT_9dfb26ba489f21a2475390d9e4d26a81963f37724b2e1136ebed14a0aeb7952b",
                                "NFT_896dcb352109b89f48d57021fe18d05cf7a9d7b205e95418dc01f61e06b7e191",
                                "NFT_fe3851231104c5ea2261dd91a3b82695fb54f68e2903b5de968a5c33d7e74620",
                                "NFT_d7efda019835092c1a11de7f43988a5a0ad18910be7bee604cd80d61fa4ffd87",
                                "NFT_f7a0759682ac4f177604ac4788696c4c320e417d514e5aed87d0ed0ba7fe69a0",
                                "NFT_631b5588073a40a7f8174266890e2e472e191c1371e76246e3191157c83098b5",
                                "NFT_a4a8f75b0af1a2af46d27c8f1cd33dc35ef2263c1a38f3484f3b8bcac1d79449",
                                "NFT_3cd1c3cf7ad46a9acfd0c44ae4bbe65c8617b83a078f35c6b0f3120937b87f5a",
                                "NFT_19de6eeb9d8f6db153994fd95015eba2d586c724b0fc9c40c44399624edcf800",
                                "NFT_19daf22f697e7159eb9020b88e75b090f1bf48bf5602d01572bb91259700cbc4",
                                "NFT_735b5160c52a00049a236af4ec2a48dd6ed92e0c3e6f75927f45e743f94e784f",
                                "NFT_b534b341c57a0aa38d5a70363711ae76a3aed747e02dbb31f900e9a08c98ebf5",
                                "NFT_09db2741679599882e178ef134690cf7434752461a93cf7af43d1da2a06f9354",
                                "NFT_9c0cca7ed83a1148a395131534923cec2b5b998e81c9c858ab70d28492d07b41",
                                "NFT_847e4d20ed60b512d606a011fffbc89fb05ba1db8b6b2a5c44361f5c9f57c63f",
                                "NFT_0ef29e6d04e05fd501e2fdae537226800ed37e231cbcdd3df375a94bea3414ff",
                                "NFT_fa2898e0a8d45fc6bfcb5375bddc3a0e33302ed46f6d744de696a7479dde80ae",
                                "NFT_73b6fc1d863e91526ff397c395e71e073920b024ab05c4f65c94b7a627ea03e1",
                                "NFT_7794f738b23698bd26cb654b2452a5e2f9fe6a927465e35d6f5e72c7fc7b36e9",
                                "NFT_0b155c388138c2fa5244dbd0b1dbd9e8790fd3e9068eb3bad9c47ea7e2187bd0",
                                "NFT_c3d8e0fae376287818479d7df0a78827c73968ad27fc2578c2a31c1ce8a54986",
                                "NFT_8436b143a690881c0d5f89c157287a4ea53476021ae1dd15669fe0bf253e5b18",
                                "NFT_3a2cf0d1409f9c7ece5e43db69145926f6e1cdbb2786f30b71ea0f2757e12cee",
                                "NFT_3de4d3e7aa4d280fae7b3b79832204fb5b0fbd78d3170d7f600bf12908378eb2",
                                "NFT_3a2cf0d1409f9c7ece5e43db69145926f6e1cdbb2786f30b71ea0f2757e12cee",
                                "NFT_33d866318659169f2183641e2890f7bc5ffa750f0a89bc70ee967b7b5db4eff6",
                                "NFT_da7cd78f666a0c355fb136f78afb112db1babda7cecab64a87ffb4e11dfea69f",
                                "NFT_4082aabb234aaf694a740dd4c981da3abd69c897766a7cacb44b6b687ac2190c",
                                "NFT_c57d08ad0bb352bad9157b1c9eee33d058e4f0b7e0c772e513789e64d8c4d628",
                                "NFT_31d570095756836f78e9b7ca5c3f25f2ecab74ebcc5bec80e123ce72f391d1f0",
                                "NFT_5a8af0a53dc5d3a6edddee5dc51b0da758fe4170b0d759a30f3986929488445b",
                                "NFT_9d0651b997a16797e3d8f71afa5e77006cf6bb07e5a798278626be26b41c3cd2",
                                "NFT_41e39830dd55abde84f5d735be661a5adc985e04ea1e250493c985b93eb5b2e7",
                                "NFT_91808e0ac1a46592eac31bfe026a78738fed0fdd5b05cfcda2ceecd552cade62",
                                "NFT_f767cbbd020c062ce87468dc1061cf619adcfe63242eb72912ef99b0c15a67b4",
                                "NFT_d5aa81a19e3bd8bf6f5262f61460f8f4261073ba72bfa164743bbe5c135bbd25",
                                "NFT_c8e702df5158067eac3a12c66f003c11aec6efef75cb1759e010da57433c5e0e",
                                "NFT_f192b0dc4acb97881b42ab83af4f5648d552c1d04b4a2f5463b378aaee9f8088",
                                "NFT_50b326049812ee71d7c35d8672d8d09c1c312a79449a902c9270b5a718bbb8ad",
                                "NFT_072c6ceaa62367e87160215d9cf948e2cb4e1e8c6ef90417674e8aaa01642982",
                                "NFT_97189cd910d1d8a629d03823ce273a89e20ba21d66f127a993a9230c88dacd68",
                                "NFT_500e32bf46bc7f24f3c91bb43a8d5b175803088509f609fb91ee7928c8abc202",
                                "NFT_ab5fcbec6b77b96bf8f985d9d3b2ccf02e6d573850f43444286de6d598ad4295",
                                "NFT_ff6ba455559bcda5c8c31432a26787cac0187def385b73f59a92ba7d98dab366",
                                "NFT_f7267a1c4d02d8f463c1adfe01362b2214a2f888422b32216fcf4006d7534d79",
                                "NFT_130ab907c0226dc270942b1caf7c1c61810960770afdbead91cd4e83b14fec52",
                                "NFT_6f3e97d4a638877ec87265ed37c1995427f7cff74a1f13463bfc7b7cb4e07aae",
                                "NFT_f467e9426427f20f9b663ca00ad963d4ea6a70e21f36428c59669d837ba81270",
                                "NFT_3610fdb9e538de28535d3455e22280a1f7d89cb14bc399fe8c7eafbe80866536",
                                "NFT_f75e77cd96c17c0cbd93ac9228a7e245c865c17bdd91c0da977e4c16afcd520a",
                                "NFT_ac675ef13fea49ab184f4668ed19da3b9e0b8f0e4d785bbc37c68c7fbf8b2559",
                                "NFT_bfc4ae6203a71f501d5c6f2851576b2ff5ce4e6a7f1d9695bed271dea5b9de1d",
                                "NFT_90db15a10d21eab9c715fedd003be1a732012c5dc4d75818887ab72f1d7362b5",
                                "NFT_1182b01e29cd9e91d1e6422ed4600191017df9014b3c1c46067fc787a42a3fe2",
                                "NFT_1b5a581dbea36bbf6bc4da25b2eab413a7339581ce07fad33beb5bf07df30d45",
                                "NFT_7404bccb442153b50fdeb1ab720f43900e65bcaab1b1c5849c44a129c2240490",
                                "NFT_12c04b226a8200154768aa362b20e685ce61262e17ca5194d1e62ebff8908ed3",
                                "NFT_ad2edb134e7bfe62631cd921d1945925d94d4c951f846ccf5971b4c0101f3332",
                                "NFT_1b0d12f32b53357ee8945d96246c617d78a276aa42e05c0135e683f8ac333ef3",
                                "NFT_b0aaa81407a8a88533491882a682d4b4dc3fd109186c7292f364a3e5e8a68ce1",
                                "NFT_c4f51805481a6f90c2b144a24839f06feb2b31ed00026de16e4b54e875f47bda",
                                "NFT_c276b091000f3bc900fe845ad57523c598180550f99248e07f95b8828ece5c27",
                                "NFT_eca8f2442621a6041a85c9d27240c715c3e1be32e73393088d18165bd115b880",
                                "NFT_a461540b572ba7dc5871451892f1b9a4f50596cde90216a4131cf026f9c8831a",
                                "NFT_5a96bb458b7ab19ae08a40fb68206056b6628c90ee387c0499d7ab802bc34135",
                                "NFT_81717f35e9aab881f66dd4d36c4e14468e0aff82f6409897529bee2807349048",
                                "NFT_eb5aa08a745de2a80c8a62a73d6c1b144114f377d09b2c7860b1ebe1b359f7f4",
                                "NFT_bd31460cdc77316a8a68547e94e83f68208e98cde9ea856bf622258f22c23f3d",
                                "NFT_f63677018d8d0747dd3d236d9285c8125bde6ad70819d2b678ba542e579b1b3a",
                                "NFT_4cdfea402868ccd1d75f541d64c467184f854403fa2e0ac526c7af8064d9a4aa",
                                "NFT_770b2cfc8ff7e6c661e98b2b89219283af890ccc5dbd9b16e63b14632a55d739",
                                "NFT_02b360cbad19d70b2e579768dc2f45f8d779232d3f11ce00f96da8e7254d8367",
                                "NFT_c633384dd703d35642cd0041ba568073d0f1f3f645e437585f407b4f5e9404a3",
                                "NFT_e2d924e6018403ce4d8e938c79e079763f83e685c125fb56bff2d754939f71fb",
                                "NFT_2cdcb031bbbf2f4bae897c99a5ddb7e9cd937173ec320529d745a8802021163b",
                                "NFT_636390111ad768700584c99c86a513f0dced526420709185305bdaf7aa6ce348",
                                "NFT_ad71405ad9a1fb7093126280fb7a53484f455699293bb2352bf5b200c5749f0b",
                                "NFT_baaf656087472d45eead4a6bb126167cc840cd7a06269f52b8d0e1c2434ca654",
                                "NFT_ee67a3cfa2651a93fbd9f80dfabf53aa447caa9e4cbb5a6046038db6d5fed963",
                                "NFT_daa050db64d9f4132a8b4cc46d52e18bd9ebd4a19e8f44d3d6bd964d325d1b94",
                                "NFT_9cf8d50e19be9895fa39dc1a18ccf5263abc823c440745cf385a3200c0de7612",
                                "NFT_ab7b408f93dc499122a652a813afb5ab60983d466df42021f6e0fba0ee37c336",
                                "NFT_cd827f044a61cbb6898f6c51247861d6012aa69c8b8098397f96c4edb64f43f1",
                                "NFT_78ae6a1ec5c7b419241b365207ec67a5a597037ae6ffb1e9b503c309d8fe65af",
                                "NFT_42689e1d7056fcd7e398b46fc6b4b0ae4f6cfed0a08cf98ee97007653264272a",
                                "NFT_546e2951a852f597c77b339f50c8fecec2abe28872e35bf3a58d14354b0d8f5c",
                                "NFT_03dcbe48c4e337d2a5298dd7a1b87886f75918d301c501ffbae7573361e95900",
                                "NFT_6a6d53daf2ff4deef125d1232753404438b0dfe06003deccc095f826c480e14a",
                                "NFT_f6ffd0e113e93f7b3e013519fcc4b9c25d7860f5091e4020422f21e29abf5cdf",
                                "NFT_2e0427ec41842be03fc219ec91d7d08387dd5f319597ccab63e83ecca5c5e700",
                                "NFT_c17ff10c388c6be9bc4e1037e0dcfa1ea79318a30677be11d3598b08001355d8",
                                "NFT_433137dda8bd0c9fd81bb227e12eb2de8ce6d889edb5f40dfc71ebd87de4a43f",
                                "NFT_c2d77e507a73c02765aa70d69a35f812beb93061d75dad7b3f75aa095e519612",
                                "NFT_e2514cf98af7f78788b41cc4ea4a21f20e176986bc767d130e096011382338de",
                                "NFT_b336a7ac50ddfef1d69ab71929a5b36e67e7f7e5aa7169c1d87b4e7f8a1d828e",
                                "NFT_b969ef5478b25cf080fd143ac044d45e96f07aa9a4ba9e57eccb9b9fce13f7dd",
                                "NFT_2cd260bf0e53700dddafed34e8135014de1e5c510a6e9f2b0244d13f91bc4bb9",
                                "NFT_177a75364b278192cf59fcf913d12a76ba103b9cfe89b6e19d666d5f24f6cfbf",
                                "NFT_7f7469d25346e73c0837e422f816b4a76102e3f48b6b43fea36b33f401937d30",
                                "NFT_1c0d84ae2be6b4a56829b72d1149c094c59ecb33c98c90302e136bc0fc504e89",
                                "NFT_fae573a196afcc5600469261962aceb19d8978d01617f4462f884dfaa4f07ed7",
                                "NFT_5c7bf1f79c6ef10317b98d322371309e583cd8feeeed5570c3f7314ce1e5cc59",
                                "NFT_98c00634acc48829a858356bb9c7f36cb03c9865c87abf3ead9bf8164b5616f4",
                                "NFT_d975132a78b0f937731f48af71a1117edb380e9c22372f320cb05d808f03ee4b",
                                "NFT_5b005688223c8da662f039c563375274a8b4b2fb87fda31a321d7c0174921d20",
                                "NFT_ea9d4769a80327b3b2e07627288215fa54d90207f4480a98bc40560d09d39d4e",
                                "NFT_b7057874ac81320a4f058f77557374d70afa53d95692ab673cc71a77c37795cc",
                                "NFT_604f591248c80f13f4e44e5ce6a49aaf5c7e793b007054bf15f2a6a7059cb106",
                                "NFT_daaaa49ef54dc0d1c8ea67c41eac65ba91b8fe0d9c345c945e5d4720246d977c",
                                "NFT_80adf63150394d0f834c2a1acfb6718e18094f32077887569a0af9a088e92b9c",
                                "NFT_23f02ba6f9c2b663cad1c27ee4c104397ed2fbdc759452fff0327e5f892fb8d6",
                                "NFT_5b09a67540a18e8078c6ae3238e64d50b38ac42fe2ff258240fcb7da840053f4",
                                "NFT_524cc1af217c26ced8fd304cbf0116989f461716eea1a2eda80dedc518cc8ee5",
                                "NFT_f76f1f09612109c809c1c5b7230703ba1171aac0dceb9d6c3bbf13138aa62be2",
                                "NFT_07e5000fef4038f22bfc81f36cacc1efad820060347ae52221939b7a74e497aa",
                                "NFT_64bdcf43baee78f62e349e108baa44d5e442ca9bf167e4e0fabde9a54d368e1b",
                                "NFT_adc6335ea65ab144c9c8821cfb21b51bf23ec663bd5e56cbe600a273b63633b3",
                                "NFT_809d7fff82bbb6bff086d155546876e70bcdeaaeb5aa2de7f6368ee4b5bc2d85",
                                "NFT_50052dd73baae0ad2b7394074443b01f47a6de2f247de65a8cdfeeca5710d7fc",
                                "NFT_b3c0db52ba57360a702818644e9c062ac1f1f756320064944da5205d6488dc8d",
                                "NFT_f1abe298add2f7606a20cc0153424632123c11eb2539633e994c5db0a3313bb1",
                                "NFT_97d2573dc3978122c10d70d5eb6c026a35dfbad1412570cfd6aab942fa6ee076",
                                "NFT_7acb8fc87a68c2cc17f37e30c97bf1d1aa69c98c044c955ea9d2a42ee63fb76c",
                                "NFT_598de44ef37d6fd5232fcc9072ed0a306e452a31d7ff44273f812798423defcd",
                                "NFT_86f499728eea767585791faae59e7339664d834777ed6b25e6068c355ee15089",
                                "NFT_73eaa5e18a652d0cc2ed36b9c1218ff6d78eec94bddbb528bb53af939aa625f3",
                                "NFT_bfc7795f24af18cd3fc96e396c1af8c7e51b96776f6ad860211e3d79a47ef5c5",
                                "NFT_8166e28929896f70207fa0524a81e72e46a55a7ead96d039405e29daaccad5c5",
                                "NFT_4fa27459d3b0b156e4d04a0ae5b61251cc02fbc1e30f8056a82f7ba384e2b72e",
                                "NFT_a4f93a9ed4621bbbba5b31867021fc659a480d2a4e3e976e956f0a3a063dbdde",
                                "NFT_3a653550f64ce7118ff07eb43d3ba45b6b3b9fcadef090d7f765f343ded7679c",
                                "NFT_657d429c6c33d36668ef0e319638181c4113cbcec96064f16dbd8d4038f9e1fc",
                                "NFT_045eb068e0f2c814268fb46ffd806aa039d185731b4bb45da90c386e8afc294c",
                                "NFT_100d09ef1d314853fb56f7c4ad43079b9d911a0f6d2e75a4de306f33f21024f8",
                                "NFT_3603fe075fa3891454a8caf8a3b3f7911910fc33669f3c857f51e5dde8e37d30",
                                "NFT_a0f857f16611d239612c4ebbece42267fc1b2b8dec1a6312c17b75d69a847427",
                                "NFT_75e6d66f8c6b7aaaab3fc799a40a00b35a9200ffeec404d2f0bb0f724d865fb3",
                                "NFT_fa0da04304bb2f25cc75bdd3d2dac44ede4ba3a38574a101c1b595da9d2f9a5f",
                                "NFT_aef5a5266f4a4f3530e1b6a6058f27dc73e5f61d38ebadc047bbd141a96dab29",
                                "NFT_83f3d0462be92815910210b811509a42112d5ef4efca3f37fa6cce30319a3278",
                                "NFT_0f0ed4a9ef5e17adce7989f37c37ca2c8f0b2aa846ce6360d6d6a39b84cf09eb",
                                "NFT_af0be8fadd2e3ca2f92d4e080edda8d69d705a6fd21ae195f8d8f8b0a4fbfdd0",
                                "NFT_14ef24ed72924bdc8c07ec365ecb465b96ce81d76a23e444f726f24126e07026",
                                "NFT_19c8c1b1e9437cb9c3d84031922e1958735bbdea6f087efba47f9ed1f105c4c4",
                                "NFT_1b1bfaa25635cbb62495040db39a7e946c42ba88ce946580533a39f1f46694d5",
                                "NFT_40a01420bb2ebd8d39a8e390d31c37cfcb51492f66e437993612c9def7109c0c",
                                "NFT_52476ff4f054c8fd47ff49b77906bfd8a90e749338765fc829a45487f346f820",
                                "NFT_8eef5dc206ca4c66486fab9467e6cc6a518973dfab91cd0a18b5b6eee732f1e5",
                                "NFT_9f097aa2af2242f00dfa7d08d3618f1f86faf280c236cdf776264eaedb289299",
                                "NFT_a4f93a9ed4621bbbba5b31867021fc659a480d2a4e3e976e956f0a3a063dbdde",
                                "NFT_e19827fbaf9091ab2428cb4be5b03374e3871cbd493a94a6f6ed604a7d099f14",
                                "NFT_e5c6f98ef9f2f21b851e18e55ec5251696ebda0272823e544bb4f54b17fd8e4b",
                                "NFT_ece5fe01e169867271a36ef211fe4bc81b99e8e18a3a92b9d65f73de06ae3b0c",
                                "NFT_fc4912565681c8e9b498f1bbaf6ab67dbc7682f3a2088c57f06b94d327c88d9b",
                                "NFT_475d2f8921cb31a8fd1ad5a168a300755e0bdbe8daf3ecdb9c40243393f4ad63",
                                "NFT_0f0dc8fd40f693abc5b869bd0fd82442367053590040e6d6342ef4ee88193770",
                                "NFT_3d0281aba01004ca31084077d50a8539e1c0868ef630d41cadb7cc8464590756",
                                "NFT_44bd39f19629f96bdf70b0e53ed2d0910b746fc1cdca3f314eab2ac45d477918",
                                "NFT_492720958bf477731ca8029684f74fb56e6e1030fa5721470f5573b6748c7a20",
                                "NFT_4a272af61f81df9832ebb251d9d4008d19c015573cd86373ba79f12f252c9b2d",
                                "NFT_568e32d161e28b18c797d179ccb7fa3dc2de70880b57bf5f734a7e0a8ed9390e",
                                "NFT_81c12d6fb17648619d17ef522cbd08fc47aced75612037af111aa835c5411843",
                                "NFT_8a2e8a60a6291755676959b82d63a7aaa19d6fbea9e94e147d429159b642fe37",
                                "NFT_b3516e57120c3f56d123017ca4ab9422ca7396ebbd4704d32461e2134ff38695",
                                "NFT_1cbc3cb994290a8a6f4bbd2da2b44e12cd91de8ae8bb71e005fa20eab3b81d45",
                                "NFT_35ff01ba3d7d2fb8c3a50914a779b95ca2914bba9f91fc73617248fbfe2e7569",
                                "NFT_458996820ec9fec17041edebb43fc30bec10d44c8ef8232c361f2b1974d2d45d",
                                "NFT_4c733a0452c22832466b7b970aa22766fbd9c064937133b222e18b11df3f31d7",
                                "NFT_5ecd2816304ad32aae541b723466c6681faf38a6a6cf812fdcd42da18d626d14",
                                "NFT_743919f3efd0e37f53d8f5f70872e8338d5acdec1c21f02b4fe385136cf907da",
                                "NFT_75144859a01717a925c5027b007f1e46ba61a3e6e44b3cf1ff630a794e1c72cc",
                                "NFT_8842d8e11e9b08bf8200115fe03f7fcb526c6a8d1902ed631ad4d140e2e34da8",
                                "NFT_91c3748aa0f6e7ae7aad4a7d34be17230eaa78e4bf2ab54c5446639f2bdd18c7",
                                "NFT_947c68194040661654c45e81bda030286f3d9610cbbc039aa9833b6797925d98",
                                "NFT_96f3775857ba4a4d7dd4e43ed2d7a1d66892d52dd7683a750c8d3e9363b6dcd7",
                                "NFT_9e6c74e89ca232132aa40cae92654ab09c334ce7b80fbdd6d826670346f128fc",
                                "NFT_b7852dfdbe7169bfe5cea27cc015872b7eae5765e01ca1620fa600f8b41a4e6d",
                                "NFT_cf3563e3abcdd22b22f3b2d4a61b097225a79d96b25205d30bfa4046dcf27a8a",
                                "NFT_d9f68cd9418aa4cd3414eb12a7d80a31ca17a74be1a14b8046bf0f8b24c2278d",
                                "NFT_dbd88595aebecbeb0b842d5b41cf4293d1b97ff59b8685e9cacf8019b9cb4bce",
                                "NFT_03bd60da25d15041a58b7ca51faee4ea3e0f78ac98701c01f297b8d0d2433a2d",
                                "NFT_2dae8d2af4adf5df10040921655c956a47ccd94d543b9ea2870527b48886de4c",
                                "NFT_3c3d1ad0982b4dc2edcda3639211d81c20c96f8e03c002867ff8398bb443821b",
                                "NFT_50c5dc54c221ed575fda9b38211a626dd0a7e899fbebb7e9c27a8c9c0933c659",
                                "NFT_5631d82b9e61548afc158ea0fd1f79d8efd4dcdeff9fb4d7cf0cd40d0d8585cd",
                                "NFT_64a43a159e3c69826b6f250783eee16505bcef959aefbd9e943271c199413088",
                                "NFT_779a5dba207dcac98ec179a8b67ebbeee8eb3a40d1f4c469131ad79e9f4dc6b0",
                                "NFT_7dd6456515950e573c473312524bef92c15509a8b027c3d82c6109895bda0196",
                                "NFT_b19db5e275845965f05a75aca46b9aaf045caabba227828a37e456633bf2ab0c",
                                "NFT_e3885d90c87806c4c756d1f5a01cf1bf96628ab4fb9afeab7e23cf447088007d",
                                "NFT_f01f1925780e48004eb53d5cc70ad0fb76e93ac78a98ec30e0196ab098940278",
                                "NFT_f8d38e75b30de7a84b7eaf93c22d29d632167db413600fa641fe68692e84ebbf",
                                "NFT_f98b72f2df3d69836fed8ea1844617805caf8f327e05a1e33fc232425a006785",
                                "NFT_0d8c1e095143b6b9244146e1b339604e5d019dd16023adfe337d36c41872a51d",
                                "NFT_182387ed4b59a50b1ccf61da00879d028862a604f9468913398e023c09a4830c",
                                "NFT_2194c58bd8611ed4b1d587486384e1c449aa5d3fcca4733375cfae35e4818773",
                                "NFT_29c57aa18d4e0915937ef841f85738a539b967bcf38d922d9e2b0c7b9254e51a",
                                "NFT_2a2b6b361f9797ccf3655676a8973a32dea778aee6b9cc83a8fb503173a19a48",
                                "NFT_352575ddc74182ed12edaf691a25ca12aa89167ca3809c1b00ffafad1cf1e2e6",
                                "NFT_45ffa12dadd1bbae44b7942ef339bc5095c84a46610ba249a38d5723f95bf6cc",
                                "NFT_62d2f01017189242a91b06b6d78f1575c686eb225e57919bd93d0d7f775accf8",
                                "NFT_6dd6eb7fb6460e4e9f69dde9b7fd3d5cd6b5d018baae6fe993a1366bdfa47c37",
                                "NFT_80b526ab2c8a523ea36228d59deaf9d14950682a94f5d9e2a35a98cd4d932ba4",
                                "NFT_87f64436f2c52f7b8da2d126005999ae8b16dfcad1c80abdc6462502dee0d4bc",
                                "NFT_922d0ca4b795a3397d3990ea21b8ec2fda1926bc1991b80d0b03c5cf7cd0edbe",
                                "NFT_950548ea793d3c955053b78d0714833b57b5c61c4b438e4c04c51d9819b9e3e4",
                                "NFT_b2807fb734fcb89c1e9ffaf13f6ca43755403271f0bdb49f954dc6178702f488",
                                "NFT_c22cb7bee6da9d2563cafa0387bca094e6c791d5e8b24de2b3937c6678d2e4df",
                                "NFT_c98876ba1f9a38bc8699a36d28f804141b33085a59afd02c2bf911ba13afa92a",
                                "NFT_d60dd36648bde090980e0073f21eb3dbfa38fbe4c452a0e6f8eaf6c92feeb527",
                                "NFT_ddff9aa18c3bbe0db70fde53e9472d08dba2ed64b24e266735a89656fec279be",
                                "NFT_e08cb459440297cdb228cccc1c6ae9af81f27f06e6ccc166b018cc11d8d3773b",
                                "NFT_e351814a406d5998c019836277069d39ecc516fb12518b39095f9de40c87d4de",
                                "NFT_e7d2593232f15a7687b5f396527c0e7ed92e25cc83b4443de5b66ed45136ec91",
                                "NFT_efadd3e6aaa7f803bee5a8767faff015c649ee474d26eec612add10ab7bb1635",
                                "NFT_0560f59f39aabf7589726cca6608437adb4252c89e034cefbde127c9a38903b6",
                                "NFT_0855469f58c0720d2652f88d450966008ba35881ea40b9777b8ba49945cacce1",
                                "NFT_18a433c3ed6f8c174bc0503c357fd210db46294192d6fa1f53b4a7b0126405ff",
                                "NFT_1f64807925a329be37488c3eaedc294bcd8d277c52ba93df8b3ac66785996951",
                                "NFT_2fa995be8fda2a4ad38765a2b0d5a26fef4ce0f595dcb43998aefeb2cd4d9fcc",
                                "NFT_3a794f7a19a31513dd2731166a34ad4da64d2fe414f2a4e84fa785507c16b883",
                                "NFT_3ba0168a998e3e5949f692b2d1fd607efb9c7031df15fc56cdf9ed173a860bb9",
                                "NFT_42689e1d7056fcd7e398b46fc6b4b0ae4f6cfed0a08cf98ee97007653264272a",
                                "NFT_4e3ae1e94347f412a4d769a077e4d22dacc683c3558e0270803ae05fa462d461",
                                "NFT_525b4a67cc570bd1141802ddf8a51d6be458024c2f34deb5821166ed09bbc7de",
                                "NFT_57add898fb037098be1e54967afe7575271ede5b8db8f7caf001a64fc1b87dc3",
                                "NFT_731daf6e9ba139e9293b49d50dc6675439b00678511f09f7e7f4f4c2c02ae5a2",
                                "NFT_7b966d041e9fe4556f3e2d8ac0a7720435ce8d27844dd43b7420bcf069f4ffbc",
                                "NFT_7c97f67386ce10c73c93844ca2979b94475e718c00161ec1b0cf75ae98a0f4be",
                                "NFT_7cd9eb91a5e9cb9e92222b2c10d3d4d69ad2d182136cc64a91a0754503c32f0a",
                                "NFT_916ec9148b58ce4e58820d883111cacd4e5d5b8ca47e3ff1b5520f16c1c92e22",
                                "NFT_bab7e05509547708409891cf453fe16734f3d656a3307e089d27ed5960ba654c",
                                "NFT_d902ede7864095e19acdec1694ebe60677fa9c525ba9b29e804f6293177d5066",
                                "NFT_e5d629a05b3ce60498458565edbc1eb8b0e1164f4ccd03644415ad15b99fd61f",
                                "NFT_f21eea56a8c8670bd8dfae8abd14c54654bb0ed4df7bac69247743d4b452804e",
                                "NFT_06924f526a0db98eb3d2e565dab1d5840f93ea4af925bf397d5b48479f3b9865",
                                "NFT_0855469f58c0720d2652f88d450966008ba35881ea40b9777b8ba49945cacce1",
                                "NFT_1be0f86bf67fb22ca8baf52aa336e13b5533a9153ee3feccf481e9cad1ba9f0b",
                                "NFT_3278014e917b6f94b2cdfaa3b68b9dfc28a1ed5550a88a00a9c0d7b00a51ead9",
                                "NFT_405695b21217f3f26dcc7b0d244d9582702f1075442615a103e031b61f21213d",
                                "NFT_85ff2aa48f77d98b9363a1a0c3ef83b8cafe1fa3db9dfebbe43bcd7eaa197b0b",
                                "NFT_95d9de43e2c63b8dae15e87e0d05c47f2d04dca78598f6066d3f6ef7b32a1c6a",
                                "NFT_aef5a5266f4a4f3530e1b6a6058f27dc73e5f61d38ebadc047bbd141a96dab29",
                                "NFT_b6dce8e351d18e75d469097f19f36d5b74d314502c9097729d8a30e88df544a4",
                                "NFT_cf5b0d380557a193b5e21d6ecb0e43e51180a53c4d4237912291029938a19a9c",
                                "NFT_dde4796464ff4129130049e75db4c159fb1b2aca80603efcb325f3b78b4dce3d",
                                "NFT_2bcc95d0d89655014eb2fcd71879207774595002902a8b861019d4e5b540edf1",
                                "NFT_4f97f3c28273c8207b59a043b84046a5428b5c3a82be8b744bbc4356d4a7b88c",
                                "NFT_5e7c90222a4e591dee0b40d0954bb8e8fec84d91f3d667e1918e34f898e94a30",
                                "NFT_7b35d3c06bba9d75490eb68c42c9965cdd9a0bbfdba0120b279fe5b877e8744b",
                                "NFT_bb97a6128cac669751df3778d4ee0eeb59dfba323fac9d130c2611fc0b1c5192",
                                "NFT_db65e3349037a68780dcc487b61ff2b9784a7838e69e65589ce2587b1585c6f9",
                                "NFT_ef1ec2ac8911bb90724d2d19b928458019f906c5a114892c464016e5e76b068a",
                                "NFT_f8e46f5c3857c7f4d1d94855ce764fcc6de05a8bf1cbc58c86a45d23950ad312",
                                "NFT_194373248a2cee2cf24d8bf76478efa2a19bbf360e301dbb5b0b489f5e9f69d7",
                                "NFT_1da46e161c0e4f933894580aac339cbfcf478b5d453505e20c2081319970fb50",
                                "NFT_33bfbea27dfdfe5b4a7ee28edebbabc5effa1a06eb66a88ee22600e02ad44dad",
                                "NFT_37e0feed449c93487c2ec8d716528c3c2134ff38a40a70c886e4cf6809ca9d83",
                                "NFT_388573aeb9acb8c538331c2b6a08868cbbd73d6657456e496442021515440cbb",
                                "NFT_459b6b8baa45ada4033d773b014cf29bc3c95c2cf777607d2c90ef309d0f59e4",
                                "NFT_4a36e708581ec6d5a84795c4ae55d0a905bfc3688685007de5187349aa78de5a",
                                "NFT_5761461b9797736f9ea8da13ebd0da71b4be801bb9a9d89eab03eadf328cb4ab",
                                "NFT_5d71358812725ac17b1fae0d4501877a61a8684e9f5eea2acf2935e707ec6eb2",
                                "NFT_87923bf98c53d511b0d94071cd2058a9d6ee36049a56c0eaecc541ff74515e07",
                                "NFT_893fef1c9b329d2d3c95d523ddf5de4a9f98bea8be1d7451df7cb58dd646f746",
                                "NFT_89e9cc15329af3c160a2d4f4d9b89c6ee7b5986b586fed09ca2a9188754e8872",
                                "NFT_8b77658c9197ec01546cba9113e7003e68fcd535b235dc6487fbe34a2bbd5529",
                                "NFT_92993461f968da441e1bd6957ae28ac8ec9e2f9156d314a052c8e78e32190dfe",
                                "NFT_99804d627a9e495ea54a49a2c0fd5f22e1ea0fa6d812a6302d7bf528c74570b6",
                                "NFT_9c58b75177b7d1b0b46f2da0f7ebf961505aca5f97458834b8996fcf1f0be214",
                                "NFT_a437322cbfa80d0d55fb5090fba18698609f88baaed883b04f43c82214735b7a",
                                "NFT_bb7e4c63c174c694a95bd9d9f9fd2f23fde47ff9288b4f6113ffbd82b7a43898",
                                "NFT_d709cca172aff320e946ab1b61f8685810eab891ae4c99784378520845f395dc",
                                "NFT_f0d217d543d1508a88bc2ee76243ab9df7988bb6a68379c8c46ba6f0454fc65a",
                                "NFT_f2c9caad064e45786a10d7110e54fc30bc5857e7f0491cde94ffa2993a98d617",
                                "NFT_f3d621a6a31aec1933cd936060233dd497abe8a34538442007af764449e97597",
                                "NFT_fd5fdf9a8b911559c63849dc7f7d5fc6f2a41130ba6df899c7be99b9b7f6198d",
                                "NFT_0eb193b263a588604f581c8ae97547ed693d17cf894996cea07b456a70f76884",
                                "NFT_10920e0b11b505701eab72df142304855f4ed65bfab074074117605434a95431",
                                "NFT_4d2b521b5eba2736aff6aed559ea8a7a8aca190cd3916270aea1b8e221106980",
                                "NFT_6fb6d2ce775eea0f5f3a73f3d7c494d40651a136146bb7c1b441825e27d17c8d",
                                "NFT_72fae13a1a0eac1a5879d854afe4bf4aa4d40760422f7aaffc6680a7df8151c2",
                                "NFT_785a4fc17ad2772e7472a25f3de55131b4d866a53181640547eb44d5c84131ee",
                                "NFT_8d784c32269422d6b505203109ff89ee2bce14e78e58e0d23af678f78aba4b1f",
                                "NFT_a7b941fe2478855fa743d4af665b0d1c7700b6a5acd1eacae4331517fa51f44b",
                                "NFT_c6135354da4a9c017342c51b5887a6a99ba124c7b0c5490dc93bb3aefd1d8ad6",
                                "NFT_ebee0f90be25a6cb78c6703366c20167a6f6bfbb8ca832f9f8d99b46cc04b80f",
                                "NFT_5bd1d5e8ed709c4d778a3a38b4e615ccd8943570ec52747907e393edbad9d4ce",
                                "NFT_6b173b147620df547335cdb6da07a9d8cbb826f0e9565b15e3664b15bfc1847f",
                                "NFT_6bda2f408c710cfbf3cc044f6666a6baf84984cde0ca58507434d44c4f305f9e",
                                "NFT_7ba5ec642874d5412d1e8e9fb3650f2450f7605c5836a1f9ef6cc76f99c6ebfe",
                                "NFT_8288dd57efa5ef3628df02cc3e55ffafc443dc7efd4dd3313161a003779afb0c",
                                "NFT_b72f6941eeaeed30023fd441bde38a27d7911917d2f6d8867b49c5545b9ceabc",
                                "NFT_c6ead292953199c02d1b7b8beff8f1e57128919850ded738c1de497cb01864cb",
                                "NFT_cdcf1662c34ac4d44050812aa6749237a9532e8e87dddaa2fae9f00dd41f855a",
                                "NFT_cff5cbf62258b322732e11597a8d4617b4bf3924797281a0837f05475b211670",
                                "NFT_0045282d637efc71209589cec79854a479a60669d97373bfa53654eab64c8da9",
                                "NFT_02cf4b0c520907517bc41190af9357e39143846a9fd07feba1f3fc27552fc74c",
                                "NFT_0f2b5db13b27860f93cd79e2fd61178c5999cfcb3630c5c4fd2871700ca4fb70",
                                "NFT_124e4d28ea710c35772bc881d68281c5cdaa4cb407eb8d7cfea5fca766635608",
                                "NFT_17854acb1767c9a978dd52080bb85f2a112b51512ba06d2caff733b0fd143cf7",
                                "NFT_226dbd2cac38cae96aaefaa8b275c7cb795dc8cd0ccae88f5a12ef6f818441ce",
                                "NFT_30bef602bd69440330336ac06ac3b6b791ee21915c7d26af4bb8c911cdee98c5",
                                "NFT_30f470b3364ac06f15a06404cfb6973ad2c702db5d0147c22b84c5c7f56c2d00",
                                "NFT_3146e29b700078563592a886b6ac2c4f0ef91e54df3b0966aad3fbd1e61e6c94",
                                "NFT_31aa1bdb6f6ad1ee73c7337deb2ddb84aecd4554be99313ce88e42c2aa82e12d",
                                "NFT_32a7a3259d49a4037d37dd20316862dc502a6cec1dd544704ece01820d12a825",
                                "NFT_43c3bbcb9e65a69fdb4c3c75bea6fe8d36375f841119f0f7ba84eed62a33e265",
                                "NFT_4d033c73ad0d49f1c5e30ab89b8c3474e4c0242aea099e3e2b88ca31a36fbd22",
                                "NFT_565b92b8b0de9c6c4e9636d24df01604b9de18182be49a9182b35cd417bd03a1",
                                "NFT_5ca0acbc8d29f82b8e1cf0aec17d64612ba6bf54ba9afe07d9ceaf80a89cd998",
                                "NFT_606a2f1445b66fc0d51858e62902df92da7a4c9e9222e525f3427c34cf166d74",
                                "NFT_62223bf66fec05db283a9b9f66c2c9b0a3db15244467c3555947b8fbccfc7eeb",
                                "NFT_7066a2fcf3a87ef12067a743931738c2484e131ccd08c3b4848fd42aeae8fb80",
                                "NFT_905f6c60f58ffc2a2bec87b6349381a263508617afaa87339dac30b9ea74d2b6",
                                "NFT_920e8c0d712d7ad88026c01d3040cca485d26229695b97201ad1377ef4b99790",
                                "NFT_98418fc156e80122055db0adaa744c273ecf7543d695051693c22cf478888767",
                                "NFT_a43c075decc1c1dec3f8373141196e69eb73d974fb0fc363827062174faa2e6a",
                                "NFT_a5a51d24a914709a97472d48895587c0e96b1789ae4239fa1ec3d9e6632bbd4e",
                                "NFT_ad36c96ac1b2325ff2950c2c9181fdae16f085a2e5a1709ca7e3b337b7ac6d89",
                                "NFT_b1b446a1cab1db8382745e517ed4e8c9e1ca7e58410504d7ed4fce8220f0bfd2",
                                "NFT_b35e18cf6552348982c5192e31ed52b2547afd0a62e36048f56104c64a4c083e",
                                "NFT_c8c3747e6836fde09a51142a7e06297c54c41869f40b4f48074e264371f6c600",
                                "NFT_cfc78dfc831f53ef319bb26e0d571f9bcb12b39fa662139feefc4d8e5ca54f4c",
                                "NFT_d9d45316a941e1de30bbb122719675073667d05a15eb3c83bc507eedbfef12b9",
                                "NFT_dd15ef26518ef2c4e8242ac3bc421c84670aa3e74c82e5b162914bb4f245d159",
                                "NFT_e1343348ec2f3842bbe375d6d33465da417ef67fab6782ff320cb395f36387bc",
                                "NFT_ea571f52048a24b592e33ce7d93d0fea3e0065a2756bbe3ded3af37bd5418815",
                                "NFT_44da8292c0a5e804793f8e50b7fc7111d1c477ab7ff15b6b01540ea94b49ee84",
                                "NFT_5a46a749245aa7cf68ea815294876afd187dba27b71c6d551449e3678b25f448",
                                "NFT_8b034dd95b810e9fc3b396478056ac0ea0344c50fdd421dcafa0dae51d62fca1",
                                "NFT_97813a98c733083b7f25f39337222e54fbc22221dd0a584731c569577e588971",
                                "NFT_dee1926966da22baf0e0e6d3c2704592b0bd3b5c5625ef958f7e13016b22d2fd",
                                "NFT_0790343979ab7e03e328eb253f28e454b64ce7ceaf2dfea1a403c0aa0840ee61",
                                "NFT_1a6e06369422f574a0f436133f5c1d7e1980f9ea48350cd446ff38bfca3c3c62",
                                "NFT_21474b21ec00e97173c8fd4f29b6d889d099df8575b32a648b642b56ccb8a77a",
                                "NFT_28873816c3d11391f97a5f70005a05acbad0c3a264026548a826b3bcb957820a",
                                "NFT_28885e16e09e3f90402e8d8d1df9aab766e3880793ffabc0140dbcffbb08a9f5",
                                "NFT_294dab73c908041e82c3863cc8667f25c73646d605299b9700c30e0ae0c84372",
                                "NFT_2dfab56a762ef1eeff8c42feddf5da08a47265809b2ef1ffe84bfe8c95aba13a",
                                "NFT_3c549e24862b21a3342bec0abaa7021c1e44eff9fe7ee040c5a24fd699aebbc4",
                                "NFT_3d1bcf254c0886e8d9edb30fd1c01d4020dd6b915137cc6329ec6cd906a67210",
                                "NFT_3fb9f7939defb0adddb4a26702eda1ed3ab9bba19c8394157024e1e63aa5ce03",
                                "NFT_52917a4c23a20758df4c7c4419d8fc779c9cbaa0977951eb6a644d89ae346824",
                                "NFT_7d043584d1537234c51aed3c383cec0bb1041f385d0eecf62c58212d01218977",
                                "NFT_8eccec9b087b0c8ec92bb68a4018add74d3bf6a7ba9c21dfb7acd44d458fa2b4",
                                "NFT_8f9506b12c4ef3db8e0c8a4af32f96aad4ea57700556d58b796b91d3170cc2d5",
                                "NFT_9f998b045c074391cd4535adb800d25a4a8aeba0bf500d4704cadb886f41904e",
                                "NFT_b0acb9260086430ec84a874f4f6cf12624064c3be98926502dc48def2f4fdce2",
                                "NFT_c881f2e516b8230c8f265ad8152cea6d8e40136f47419de75bf709829dee45d7",
                                "NFT_f5e9c77f166d4d1ae7783e3a32e0ed2dcae5a065219c04767891b26e68361715",
                                "NFT_1cbc547a69de7eab1f2a896cae66fe2f3922c88ce29eac8cf7bf71d637414040",
                                "NFT_1e623c670a3ba5e2c373ce41148f54a927311ec62d77d6131a5bc08370ad1729",
                                "NFT_21ef07295e0f36861019d192052dc0136891fc0a6c5e1fc4c90f6f54a5e9072a",
                                "NFT_222356a04985c6313c1bd6db4aef6c32fe4e50aca21bf44da24facacf65ad104",
                                "NFT_24d0389657b3f537b792d444a977d631172443a9d6fe29f2e24a94898530e9fb",
                                "NFT_387d7f270fd2ba14bab95deac0c55965056739cf981f61d7fb8eaaa7e68796a5",
                                "NFT_4163fb773e17b103bdd1ff11384f4560e881943eb89568702976c23f7b3113b7",
                                "NFT_4cbc4408a7b7a853c3f30acd313e470e3462705b2c5dbe39a98da0b691f24210",
                                "NFT_507810a4a164f1f4d44d29d7dfb622f7fa70416f98d01dc12133cc14bd9a88d2",
                                "NFT_5c6e9daf7e4a4c965e0ee8da7e28fbeb65e7af688ad09d3651c7377f24b72c4f",
                                "NFT_6337895e4ced649409139a5fcadfae6f4a7faf132347fbf77e244e4132e9938b",
                                "NFT_69cd2b274df48c70765dad77f41a2372f2c11adde8c145f8a77d105d10c4421b",
                                "NFT_79e272b5c86cf63c79ab0ea1ff4f5aba3079301cca57952fdf63dd960e6c6d36",
                                "NFT_848e0c555826724c7be78df3e10e185fdd1eceb23e151ecdf96919ba002db5ce",
                                "NFT_92211683d5af6909c0ee55a59e670a19be4d7c668fc73158cb783659619a3f20",
                                "NFT_9dd83f9dea287d2e3675691b76da09b35ef6549a91a6985d986ae50e3d32c331",
                                "NFT_9fcdd1b4add162235d0deb6a37fd81497b5013f7c9921ecab891c3fd75825735",
                                "NFT_a74030bbd8a422253b38e28be7510cb69466e9792a704353f82df4fc221a6b5f",
                                "NFT_ab70afdd508af92d3973e5cf346cbddaa9a9d451cfb1e6f87336a087235efdd0",
                                "NFT_b13287ef129ec4972c8dd25769f56aba248f7fc79c5ed1f957a7d02b1a232f27",
                                "NFT_b9d13820105c449e8aa12a7fb383208ad62301b216c738c1d260e8d1e29ea306",
                                "NFT_c27ffa3a6bef6df7d58a03483130ef7d4f69920510e29e3bfe79a2d39ebd53a6",
                                "NFT_c5304c0b2435c3de8062a6d5a42a5781a1faec35911b0d3904df14845da3113a",
                                "NFT_d00217865d31d9cc0a4cfb0154666f4c106433e56120ff239a6d960e764fca3b",
                                "NFT_e33a6767c2f4ae1653a0c6f6bb623e631cea9c704e070db3cd4a03a8cf4ef257",
                                "NFT_eac6c075f2296460a6747f9cbeb84d9d8fac4920f4510469e64db1edf0720b7f",
                                "NFT_fd6933f7c789ff88a002a7cf67823c0953515035491ee434af9c61007147248d",
                                "NFT_026e8e22a3fea688ef298fb177458646390f8896f4523796fd44fcb88f6ebfa1",
                                "NFT_040e84baee9706037b29a31590696ce4bb6702871c6166bffdc7c5413745cb0e",
                                "NFT_05301d827819f572c0d9634baad3c16456021a2a00c89d334fec9e738641db7a",
                                "NFT_15fa0ac2e9b6952315113577326003798f568c363b413500cbe4ced7cb0e6f92",
                                "NFT_1d04a10f64eb5ddb892cfe2be53ed4d87e782b9c9ddd21ea79804c5cf738cf1a",
                                "NFT_20fc21d378366f5db4f43a651efb28d6369cdcf0edc6322bd9163572dd301de9",
                                "NFT_249c559f660f64287ed7d93e967231886cde28008f2e223f4846f976f674fc4f",
                                "NFT_28f2744ad7bc10d6911f46653964ba1614bc1d72f5574ea317365061cbf50110",
                                "NFT_29415afde361c02ec4f8501b49a45bf5d6d69eb50981b62e986937496a13d286",
                                "NFT_33a30ee12a74b388c720f3c6512d4d8323faf02b8f50cb45ec11dac4ae9b9a22",
                                "NFT_3f2b394135974215be039d8014f6e243b0afe0472e3b10709f493f21a8a1ff2d",
                                "NFT_54db6d2fdc840e40b41dba1582963d95b5f537f01d8d9f4740a65c21df472ad1",
                                "NFT_6abce805b667b280f74e69229065f285476e2aa76b35079a66e0e97bdea043a3",
                                "NFT_6d114abca07ff713e253613c94b41d77de9dc2b6c496f163e67ab915cf13e6e7",
                                "NFT_70f77293190af282b36bab72cfcd34b7ef0cfef5f0cce1b597aabbc1353b132f",
                                "NFT_73d98625b58b52e8bb93a99662a82b84520e1df0325739af79d70f42f5aade8d",
                                "NFT_78f9b8ba0520c65941b6628cb2e08eceedbbffbd0095653ec610193ab601c201",
                                "NFT_8cd6cde137727b4c568f416c854bb405afc47ad5d953511c7fe139c8682efb85",
                                "NFT_8fd315df810a4521b2ca61b10c1745c1985122c70edaa9e2c8a18920d3253f1d",
                                "NFT_9a97165592c2ad6bd40a50ea5b8874a4e06560bd4ab1529d82ccb94ad355abad",
                                "NFT_9b5fc206064fb5c172ebee77c0700981776113fdeecbc65a3fc090d00b3e6f48",
                                "NFT_a0fc6f3905191b743f5c611e6ab290547de21fbcf92eeefd84d295af75449aa9",
                                "NFT_b5d6b7bd5f610c45179abb311adc158ca215f3cd8bdf903ae161ad7a4b51df04",
                                "NFT_bae0d42aab075ba57746313b1e78722c21a701640fbc87c651b9ac41ef89f27a",
                                "NFT_c0d3b8545ebaf637dd8b54ab9518ea42cc6de062dd1109843df18f6db9cd685a",
                                "NFT_ce6b49bacc3c5f610e08fcc2ab1b56c4e2a1a3d6de6ecc076a08567a766140a7",
                                "NFT_de765c3a9d3982ab795deee69ee752ac72e8878a5df9c7691107638bd80960c9",
                                "NFT_df587e13f47fd2058c83f38f49a72168833aa5031807189eb28bc35d2008c98d",
                                "NFT_e20b1655dc6cd432928e866ba0ff0fdaf0f7f5777fe2625d527d1cce3e0c8a54",
                                "NFT_e39156a8bbb017ebae9290ddc56d743a5777b65ff9355323f74efbe3d30f00cb",
                                "NFT_efba07c31ab3e222779d9dc3e32a3b4d1c8826822070fe8a095ee66eab2951da",
                                "NFT_f7710f6a0fa9990f9ae63a23799f40227be2a7c64214cd42734c634af0a363ce",
                                "NFT_0cfdd2191672b3ccd76797ff587944f2d7767ff9c864e28d8c543348a7b81fa7",
                                "NFT_15ccc8a048f30f746b399ebd3bdd25cc4705e2ae623ab397cc2a060978dd44cc",
                                "NFT_189840864113b418740f6c3a33e31a21554ae34da83f1fe975572b720bd326cf",
                                "NFT_2ea950a5e8b520053601e2ca37c78110f483b59690ef00f698359ee4a9740f17",
                                "NFT_33e8324106e656a4298b7d61463a7472c7f2b0212ae3e5211dec6ec0aa43e7f5",
                                "NFT_3f42a2eff14f2c383613df9ff52aeaae7dd1b5d1e3a2851331c4582248051d53",
                                "NFT_403e9bfa5f4c12c1fcb5947d5f9608b82f01cba8bc94ca23089c697b53286982",
                                "NFT_49b301a0e7b773b1bd8cc3dec900661e08da82f53bcecc7cabfa1ae134ed9060",
                                "NFT_5442f5e45c9f25a1c7329a75ea92cd06a01a3107c3f81c756f87dc48295f4076",
                                "NFT_5c59c4b075f48eb3a2e14550ff34884de7fbfedb51a91f6109c7b695fce5781b",
                                "NFT_7fbea7b434ac65054fea9c0deceb6b6e48073613d1e908a55215f6690711fff3",
                                "NFT_8b30b77d944511c666d8ea1fd254952bab84ca40af4890498ea657d764e53ec8",
                                "NFT_8dc9585cde98770a01074dce0509694ab541c99982168c0955d8ee2e3297913a",
                                "NFT_8e468059abd72af84fa6e3b063ac7196428e664bb0bd7ee7a6f0377da45da1a5",
                                "NFT_8e5e067939c1fd3972036eeb67e9376d00f77025474742cef9c8e1d6f9c4fb41",
                                "NFT_954b4777b7a085499e2d19cd673be2f5b790e7b550ce6638c30ba294e14dba3f",
                                "NFT_c4cecd96f59eae7d495583c121fff09de5daade70e28ca93d8847ef5142d30d3",
                                "NFT_f01f220b5684f921c253f569297ec9d5ef9ade7dde4cc5306f9469772ef83717",
                                "NFT_00121e1e2400606b490863f05e8b06a966d3f2e29c41159600dd1fac3ce8184d",
                                "NFT_13dfa9bee46b4118b75099312313f02e88e62c4a5b1221583329db50674d4019",
                                "NFT_28514d48b681b3ca9700d3150c416f2dfbda89de3713677132ffada01df875cb",
                                "NFT_4da08f40a3d7b7cda2c2fce9ed2731dc38e61801137c5a3b240015ea3e13aab6",
                                "NFT_4e2c8893b71b16dbc229ddfd833b6d7a69a2ce0a4bc7a4dc2d93662cd2ac73e6",
                                "NFT_5b1ea5ee557ab68d000c1d105d43a1a341f8d809dd2085cea90ce65e92e64a61",
                                "NFT_689457b1607ae7d675a2ee11e1338af88dbe5e4597255bc5249f1d25b385850a",
                                "NFT_7848188f92176106484772c61a8ac82be79d896712529b71fd008528a64efd99",
                                "NFT_78a21ac4c8d40aae3cb8bf9817ac0c11bfa29ad128836077495c310893afa6c2",
                                "NFT_7e127cdcb1631906e51bedfa6de4fc1b8cb818408c830b11705efa4722ba2a4d",
                                "NFT_a322ee9132313e925e71bbf40cb0d948ecc06608c3ce24be1e8c19af84ca7408",
                                "NFT_c321827876cd3800761d40ad51cb6f92678b7fd786d024d6f02d424a635ca970",
                                "NFT_c86ed83b25016ae986fe3b232a4cb5fed5b542ef2e00d9ed2877a07b9fc739f0",
                                "NFT_ca9206a5e8d20e228a9fba0483f1c6ae13012bd54478bf7b7bef54479336aa4b",
                                "NFT_def8613a8f95f105a6291cf910d783ec3ace58df18bbf41a3606d6d330c5e035",
                                "NFT_ea6a4b19f86e0829a4fb3345e27f8c8af16f53dcd217d461f330f4cc2c1d38f5",
                                "NFT_ec6b5d370cd3ec04f758fce9098b251340c35e325d1a175765e4c34831d3cdb3",
                                "NFT_f2eb86ab6240264a2232904180d51bb608973f436faf8181afb54badad1228ee",
                                "NFT_f4858ddb8c27a5a37b814f098e9d28ce019237e9c144603157aba41779b3f834",
                                "NFT_f97c7bd6ed618b46358222a352767604eb84658b0884ebf7999d1b01ad587575",
                                "NFT_315058eb175b12f4a7ef826a913ab3a8448ca11db3fe36ac3fb4f0310fd74fac",
                                "NFT_3413c8a13aa791dccac43090699fc33364165601ac522cd9e6df57a6edc9e8ce",
                                "NFT_453d8182e665b59ca1e8d1e6f747e3068154321e18218ed980268d160a9248ae",
                                "NFT_5cd320a5aec6f58a0a851c5953f20797506ffc0a1a2b83d782a4659ae1ed1923",
                                "NFT_63fb2e0da9d1bb68445d9b2b574a6afcbed121e54ac5666d47c6517b50c439dc",
                                "NFT_64efa34527b55f6eedc4861ed7e0a7724b1cfd33cf300f4e1d1c92360968bedc",
                                "NFT_6676eb50851a93512e6cfce56c0c33374ccba5ed219995fa750a50ee76e58cad",
                                "NFT_6be788737b05441f60a206b94556b28d36d15c0dee5e361c882828e635a6dc32",
                                "NFT_77ddda9d944cb74caa6cbc01eae0e8b232d2fbcb3267a9df1c82fc19cee18fdf",
                                "NFT_7e8880305efdbb874404a19f0a9bb002e631d00a6ae0944dfef8b3ca28339409",
                                "NFT_80e393fbe0afa05d7eaf7ff83f0d626bdacfb941e0b131c8eef6cc77f80c7c35",
                                "NFT_86c69bf9a561073da55c7de07768800ac2236ba2bce821a110a9186b85a721f4",
                                "NFT_9f268905e6e7fffa8c23fdcc9dfec86c7302072f81a5f556025969c64af3b677",
                                "NFT_b7bebaf2b961e98a2fc4809d3f555dc41acaafcbbba131620efcc14437f0b837",
                                "NFT_c354ba199ff7d6113d4eef5a528cda68904a774bbf40fe2fb4838b2831cbbcf8",
                                "NFT_d7e23c502471f112a49ce129f993332bcb478f46f4658dc44f932c6f59cd7fa0",
                                "NFT_e5b88dc0fbbb31f8762a968d798b0db41dcc56462e90764475a44f8016ada909",
                                "NFT_ea217ce48556c14b2c82d30b3c473307c5221f93134919b28457e8e997333c05",
                                "NFT_08cf509983911cdcfcbc59962b11dbf72d82fa9d7a5219b0d2be86dbf9949be9",
                                "NFT_39b1a06ae128a9c4491ebd6e67b81f2621640cb6da47a38aca61d477c15ad61f",
                                "NFT_48697b3d5cfa9d921fa63b225f58322d96fdeb1014a8a43ed90619da8e6b8410",
                                "NFT_4eeb054505d8d75778945dfcf291c62a3466c1067ffa06fac4f7fdffef539f38",
                                "NFT_5647b723dfa325fd23ce6ce6f8e8fd0d2f015908e8b1303d412998cacbdd8810",
                                "NFT_5ba32999571e84c83b40367ecc03af8369d06cff6a645822ad6270e9da8f21e7",
                                "NFT_5dd109c52896d837dbd8c479914c2b959f27cdd9a544cda5fa64c4fce6edbde8",
                                "NFT_68fdbdba43d0a9136ac47dc27e6ed783c2c4f74e7dcd9baeeb4651c2b5e24cd9",
                                "NFT_6f815dc3bb9a737253bdeecd4a674df900028a1ddf4be9ea447b80b7013f1bef",
                                "NFT_6fb16d896837c173f580901db064683f284edf08db5afb73c9536dca71a23970",
                                "NFT_73ca8f24463c51468f19608f5880a6320891f691c38390eba93d2ad1d9101446",
                                "NFT_85774a703f7919aa0d297237ec1503de7bfe7ff9293ca5fba2e4622aba92dd67",
                                "NFT_9650a7a3c3ab9629c3b14a0f4fcdf84bc4945b49bf927856014264497863be47",
                                "NFT_9d16339388a032e7c067efcf6a3eda46285c0d5b6b566de746dff1716e45de0b",
                                "NFT_b00f39534beba1e75011cc9c520cdfdb98d5f5842517c6b314a47440b1a8e2b6",
                                "NFT_c5d4983225f5b205d86e4f1d56a4d5f7bee548a5771b7b1781f4dc7681ed0ce4",
                                "NFT_cdeefe7ef72a1d5d720ca22ea57203a41aae9869f7ed41feb11a5e1bb5896045",
                                "NFT_dfa59f76b1541afa4895c80983d81e4c1fca5b1fdb88917f5df441f9c6721e56",
                                "NFT_01346618000000000000000002386f26fc100000000000000000000000000119",
                                "NFT_01346618000000000000000002386f26fc1000000000000000000000000001e4",
                                "NFT_07cfba02d326f23a9770d91eee9d28b408fc1e33b086a97f633ac0e9fa36c02f",
                                "NFT_0d284a30bbf6e98bac535243f50c16def470c5d19eb021b039d8b95632fd22d1",
                                "NFT_138ab9fc9748854a24f126c235995a483a36b4489790c087d745ac29b3d606de",
                                "NFT_17a6036106a248afed3fce8e43e95840fb7fb3ada47b617b9da4eed017d861e1",
                                "NFT_1a2cc57b7bc4dfdd2b50cbb2d9a4beb42b65602501cbf7c1aa9a933dbb1c7f72",
                                "NFT_1abeb50c8e288d69865243dfbbfd6c96399c95267c4dc4afa1a5eeafec21c354",
                                "NFT_232623e988f658d52ec46a4a52872e2719344bd9a7e306990738687f19df7669",
                                "NFT_2a79fd21a78fadbfe83adee440cecb3045fc4b38d2eff0a60a58025ae0df78dd",
                                "NFT_4d6f825f9d10096810db5d5aadec1e0ef0b5ac759d8a84d0d41f9b82eb38eedd",
                                "NFT_5d8b7023a4ad6beee9ad3d02a5e2bc5abd45b5782a6009b1d1e51711097026a3",
                                "NFT_681b8079622f7d59b73071b76d887b0d44d1a1e51be12f4a94938822ede4b7e6",
                                "NFT_695e305eff1e90987ce07323c091b118cbe2ef33a835d73896044284722be44e",
                                "NFT_714c923058a64b356cf6f07429e013825fca0dd7f9f0afa66861c14df8cb32e5",
                                "NFT_982114e9e8e38189696d6b300643a25cb9744c29de9a36943e354c9bf15d4c09",
                                "NFT_9ba987553650d9c0d911d1d146eef2efbef6652ca06e153a6b90fd6b2a8089d8",
                                "NFT_babbe3f17ee8a471ce256bcaa4b35b3c798b645ae6d2578d9dc980a1ee656e7b",
                                "NFT_da303c6cfff4679895b5aedcd11e60ee5f87b6036dd063c8a60c0c5328fdf3a9",
                                "NFT_e7b0fae7e62cbffae822ed344eb77e22556a6b88652dc3013c039b36a64a7f43",
                                "NFT_e7c2a744a78690c79252252da61301b01cc35abd87c5fa2e29e523883d3d0397",
                                "NFT_f0c877ece2d46107130901a328db2acda3b75a5a069326f031e592716fe13817",
                                "NFT_f4eeed7db3a61407645ccc13bbb03d99bc4392c938bd99e64d83c0b09a0ebc6e",
                                "NFT_1b4d6d6795cb95b6cbe4fae2e62ee1f49eca7a358eecdc931a7c2d11b701a1d6",
                                "NFT_1b7cd8bb752f5bea51979c1521244207d572b5bb8f57d7d58fdfc09577c6e8d9",
                                "NFT_2310ee1f8fb27c809961de1f7e09fe6a83bd2aea0acb92e7e5201f498f247ded",
                                "NFT_245d9b73741816264ebd4c57efa46a9e44cb186df9dd4ec8154005f08119b559",
                                "NFT_2f3557f15a92ade5170986bdd801bbdf0fcfabf68ac28fd34aad6f139c991789",
                                "NFT_352a1292a3e8ec36448524e2ed68e2d017370731e4302f8998e4c82f6f06a4a7",
                                "NFT_35dba405c0690866f38c14b87dd6a495d276970a523ea056c07ad34cfc88ac98",
                                "NFT_3b807dfa98314116a9c217c7057f21f0a7e94ab76a56224815c692f19cf3d050",
                                "NFT_5038bdbb926c15053b63da0c3ca8d9f7c44ff8b9df204a4e2a4719542505d3df",
                                "NFT_55f5ba5d8ca94a6a2183cac3994298c2f3067086a54e2361b84c5c4a7738f578",
                                "NFT_5905ff0c7a082233a5dfacb6cf60c78007b1bfff14f2140dc6eb99645de94d11",
                                "NFT_635589dc7ff5440cb85875688766c6a8f4c148fcccbdbd4ac0ea21c4ad06b467",
                                "NFT_6a386d87cd9c56d80050710c23500db592d51c87f71015bb7452b47c08551c09",
                                "NFT_6ab7bd7d737c19acb71381fb886896d27fee56cf23e648f3fbeb54a525a4ae6d",
                                "NFT_6da129752ce02827fa2011b4321039ffbe04b4b14677bddaa661d743cb501f4a",
                                "NFT_81de3eddc3036f9a3870bf53dfa01aae8b4384384efb88695fe5447c64be325b",
                                "NFT_8e436a708cddb4c6a11312de0c0be2009bb81d3f7ebdb66264c6cc8f3fd52a5c",
                                "NFT_9ee222c7f0ed005fe045481b86838e070c33315f960a30d8782c3990501f3dd8",
                                "NFT_a3239bdcef9f830db34abfd99dbe2ddc4bb3a5afd45195ad9a8a47cccb455450",
                                "NFT_a33c7d8ffd2ca71704db50af07563b492135ac85296a6c0b06e33b715f15d2e4",
                                "NFT_aaa7f1e8e620a6290438e31cd3f3d9e80a54a7fdac9ed2a226d2fc5c841fc97f",
                                "NFT_acdc9cce4371771a99d2366d96d55e0a699dcb1615b75f09843fdd19e8c8521a",
                                "NFT_cf9e30687fe4d4f8a62ce52506a2066063d59b1932b3a618cc2ff79e44ee39c9",
                                "NFT_db33dcfd6ad756c129d37640df3b6308693d2c55947a39b94f8204da6319cad8",
                                "NFT_de3d05fe542c60a8feff4c41fc7b2a610d1eb7b0f60f08df651b9886d2905f67",
                                "NFT_e85ac59aadcf41411aac476f8642e06bc5ebaaa19c73b1be35fbce01051edbcc",
                                "NFT_0b313d2191fbda6149cccd8fd2c462e83943668c15e183df35d7b0b0bddea8c3",
                                "NFT_11ebe1f7c8341106d686f5512369ca8abee8de020ec10f594c682dfb63276bf1",
                                "NFT_13123198057dac59660558f51ee01302db3521e949208d314a4a298515a21aea",
                                "NFT_19a1ade385d4f9eb6c344122a8c9d6b47cd70b68d78c2936571f2f5141f1e2f1",
                                "NFT_2bfc474849d160e6dc497867b0c54c21e339bc1fc1a87f5b4daddc722d34c963",
                                "NFT_2d937714134b376b667fc8159d9a58e57aaaee667f3fbd52af834e73d0f17c6e",
                                "NFT_2f67797d1c3606b40fe5361641c0f82dbfc25a774c6db32dcbc4a9ec42ca10da",
                                "NFT_312014fa1ca508f5ccb753cb8d6d633f976629e488153e684c9651f5661ba9ec",
                                "NFT_3183fffec726b74cd1c623ff6dfc2a60da8f7c730215274b347c5120a2bf7a16",
                                "NFT_5ba5bfda86e09d68424ce22cfee51e297a485d4eac9da5af73661e975cd89af6",
                                "NFT_5d8d3e626420d87fea186a304e5813afb47fe8bee3120ec1cef0871baa33d5bf",
                                "NFT_642922b53af6d44bb958f9eb4a234308e265a35a31755589b2161c7e01351ae1",
                                "NFT_6431c495b0ec42e119c33fd982a7e3c1b1f2ed5caf892acc118a97d47a6c6f79",
                                "NFT_6b6b89a6512a2480bb81b19ffe1ab0b6919c0e970bb466dfdba301ea697eff87",
                                "NFT_7059590cce672224ff67ece05e2cd976cddbbd228b0258b3e553f73571fbc98d",
                                "NFT_7b77de81bf93605c2d45b1953f6449b2789c9c19d430fe6b76dc07240e33dbcf",
                                "NFT_7d124721b5a971a8351753178ea541b39d6d0517f05f4982b7edde9d14119f4d",
                                "NFT_8b29fa7f2d41bada0c5f70b690794ca22407835e7043b70b262b9a7e09a0cd67",
                                "NFT_a05bc30a44e720084f8ba1c8e077ac8708699102b218dee15b08fec865928411",
                                "NFT_a14d6f953588dc9105ca09b9dd84f71007da6d893d34c30723d3deabbc546772",
                                "NFT_a185e13ed2604c56388fe955f138aad1f171ff993865dbb2a995289bf58a51a7",
                                "NFT_a274f4d46945353bfbe6d5915c944e21d5e95a0e1f15d36bc3bbb92d36cfdccf",
                                "NFT_adb9f5e51f1e6c3dd9ed88ae44a8398ef8ec722ced5df1a0742d3a450b187852",
                                "NFT_b4bd6a245f1486555f20a3064acec489becfbcb6401e27e6420c57b9ce842623",
                                "NFT_d42458b7382cd032ac833cff5f9eee7d7a29b246d25ada2a63517876b945076c",
                                "NFT_ea4dd519e7d97aab56ccdaa28855a1807a648b7afb7231ee2db5d746ac235701",
                                "NFT_ebbf3a009966c15c85e2eaa5d0974cb6adaf8e05542416f50f85751fab801099",
                                "NFT_ed640049e4c403f5376167e1d1e95f80614d3784f012d0f5d071f2fa2a520374",
                                "NFT_f0ada0e7f650a018a8403c29f15b491ea20b713c17b084a7d536be634a5351fd",
                                "NFT_fc79e491e9f60b8ca843ca2548a023421f3e0da3301f24d3229b1f692eb89299",
                                "NFT_fd19f19c1da37f8573efaf3a4aad2e3e6623c0363c00e60e8660e5b63c2fe222",
                                "NFT_0435e012220ab232685222f11f230790b876fee9074cc54f766f85d364d79f88",
                                "NFT_0805e2eb11a54fd9788b7ede91e200fda879d8153eaaace7158b87fe507b8e25",
                                "NFT_0b159f12fc305a4927ea9b22d17fe394393fa4c7a649d3bd3c977b76fbc9ef63",
                                "NFT_109c0c7b5ad8e38dfd139c1e8fa664f3687cb43633e98d10df8976ff7f7c3de9",
                                "NFT_19d14c5dff4194a8458fa0eba02046183c0004fdc2be298fc8861c29816dc9b8",
                                "NFT_1aa9129aafa5584cf65f8d1e8fec2d4f73e98d9afe8e2a3671dc43b58241f7ab",
                                "NFT_1c06871f3e36edbfe5fb662fe6f2b161c8400f2c1dec07b03d43502a6e382f79",
                                "NFT_1d2cd13a4742d8c74a848c9d76ce20b1d5a26f5039a4cb167c1b9ace8ed27b16",
                                "NFT_2310ee1f8fb27c809961de1f7e09fe6a83bd2aea0acb92e7e5201f498f247ded",
                                "NFT_2bf9173e513f61be9b34ca1109adca6a125e45d335b680e62e18e1a3f04cf871",
                                "NFT_2cb14810aadbdccf3e056c9747f9597dee9854ec81072111981a456dac734e90",
                                "NFT_34c0ebc221f573b75b17e0d8fb14f55e28eda05ab4e096212e197b97a7e89b23",
                                "NFT_35dba405c0690866f38c14b87dd6a495d276970a523ea056c07ad34cfc88ac98",
                                "NFT_3aa587518e0334b0efc5836ce0eb285d25f93b90bc8f4a6663897404badee0b7",
                                "NFT_3c401b7959265e6248432c4d93161a08c0dd863ee28883987518603810f8175b",
                                "NFT_3fe94e1160a6ca6b5cb58cf9a1502af509387b2f9232cebf09fd05d99e8fded2",
                                "NFT_42a9ce9c892a246067517db5527ffda8261911a48bf52a1aafb4db776194e8da",
                                "NFT_491fd7f372ea083609392ce16b1416ca5716ad46685e118ebea439c29b2695ee",
                                "NFT_4b6016e30610479728da891ce57420a205234430f246de7be748cfb98097ac2d",
                                "NFT_5311177ed032038036efa06dbb197c93e504b120ad414634f35cd3dd0c2b1a38",
                                "NFT_5ac79ca25ae665a6215ba0992c630b72fe225da618153044c8f223335ff26d07",
                                "NFT_5c8f7ede765353d58f8e5c801b95bccd6d65d64ba18e13c348f9847cca983b65",
                                "NFT_61f821485c6200554fb5c695f08b5fd316d48829adada8f0898e06c6078915b4",
                                "NFT_67986f98a257768d1bbdb5d37a8db91b541d85ea9756e7713051723dbab96293",
                                "NFT_6a0eedc2cab714645ae23611a2afb1e67040f5721ab9abc7760b626c7ef9c5b8",
                                "NFT_6eb97408cf8c4866077c06032a7bc7b2cae9d47b789b3026151888808af96915",
                                "NFT_70e9034ed7034f628c222d1efa8c954647033d3f869ec1828a725a16663f0a74",
                                "NFT_73da80e0b842e7e76da76d58de399fe70e478be135dbeadaa31070c59d915b97",
                                "NFT_7f42f3d5d5353d7ef6e7551d763fb6c938535a2f39d9873ef7bf69e44b25d792",
                                "NFT_88c8aaecb89dd2406b0b91775076ace2dcfcd6795c547f2c3d41e184993514d7",
                                "NFT_8f85e91514f07eb4e5cd4ed7f079098c5fa9dcb1bbfe698bda97830441a84910",
                                "NFT_9133a5c50dece8db0f6c57397cd751e80164dcdf78bd4c1b4b53a6f884746dfb",
                                "NFT_9611810a8c72edc19a43b5dbb8f94ceb964a28b9343c5a9cf6064556840e1055",
                                "NFT_97c6eaae21c9144cb396c379fed265b7399a12a854a2f2f3bd4cc3d28e8f88bc",
                                "NFT_9b711662552c0ff180fff09a040162cb8f4a5d8844cd62f843f56a15141dc1eb",
                                "NFT_a06bcb3d629b76fc6b7512f4ea785c2c18d5499fef4890d94a2ca003debd6605",
                                "NFT_a728309126445f17d39af901060f9fbfa326f574cfcae9cc0745261ab0fd4baa",
                                "NFT_a7b0455e334dd52869f619eb25131d67e4f4697b7f6921ec31aa96db0ec69131",
                                "NFT_b19e46804d632bf7ccdd765c69d684dfa3680f970623d186fea0fc6dad2def2b",
                                "NFT_b1ea654721a6939847f155305b827ca35645af12b4531c9c7a56c559d81a3d61",
                                "NFT_b6e59bb8e98e95acb68a842e1f0ceb44e670d4899504f806a8a2bd8565cf4aa7",
                                "NFT_ba2bbc38ada0703edf12ca4f184f4993b28ec98eb5f0b82eee7b796e0da84d0d",
                                "NFT_bb1793041dcc7808cf8d7aa371f60befc850543267f8ee37fd7c7a5a7a8759f0",
                                "NFT_cb39623431b311b64361b3eb8a40d6b5803cf2134e8e22a59ff99409ac7d8adf",
                                "NFT_cf7e58bf5baba30195639e282dd857908622c4f63d9ea12e7e6dbf3fe90f1fe7",
                                "NFT_d1a7581e18db875d7580bd2db3b2639413ad76e42cc25091a17b4249aa56c808",
                                "NFT_d34d5ef0eb0310542366be632fa135191223fe08858cafc2fd8b704085aa37a5",
                                "NFT_d9c40ff45403d66c291adb243b69a996e762c3930ab92a6c76a47add0d32b6ce",
                                "NFT_dbc13c67b0b663f7ecd046a8addf61475ce13725d2e26b53404aaca71dcbb7fa",
                                "NFT_debf15594b438ebeba7e1cd09b8a239095e8af23b15581fcbb6f177c1e764c7c",
                                "NFT_e457bf87d38ed4d9178d80fafa82086d0be89e1bff96d342bcd3730dfec6cb78",
                                "NFT_eea13da8173ac2d033c8b468f8b05f5406210d244d4e778c3250fbd2ab1fb77e",
                                "NFT_fb6426f81c9929969dc02d83ebf02a8a0c2f9ebf622c1c1fe99bf82ed1f7e948",
                                "NFT_0d0e9259292742ca45872648a36e543bcac0c6145c16deb65dfab5c73da6224b",
                                "NFT_32b8d0e973e23e4768efd1b40ffeaf2e064d80e95940eea81ef83be156375c85",
                                "NFT_35dba405c0690866f38c14b87dd6a495d276970a523ea056c07ad34cfc88ac98",
                                "NFT_39b30e2c9527c9758fb45f261d7fd7dbf4d78b2415c5c7d0734cfba7c141c5ae",
                                "NFT_492f0a8db55bc65bf038da58c850ae28eaac4364b8fbe8922d2d1f968417525e",
                                "NFT_49e1c660b374c30c10da34aac33bfe1cd529267fa38519e9365e3025bd4840cb",
                                "NFT_4c7e8c82c0f1496f637e43594f028b8e7c3ed5df53cd573f1751a22c39dd003d",
                                "NFT_5794aaede358b6385e472c4870506add6a16e8425c17a256e89f9a50f800fff6",
                                "NFT_6428f19edfdbb9bca9794f36faa45790584a1167e5b5a7aecffbb2c0512bb2be",
                                "NFT_6be83f72664a0a35bed6aba2615649eb5a4091e9181d8a122569cca450669e7b",
                                "NFT_747e58dbb8dda552cd1a9a95fea3ae50813d238e5ce941efa1cf0dc48492a6d2",
                                "NFT_926c22798199ef0cc5c3805a4b846f547ff31186027ecfd9e9bb60728bf3bf20",
                                "NFT_bc869c7544427908ce593fe43fe3e0c922458eb3313fab7acf00e84de729771e",
                                "NFT_d6014669c2e2f3f210bf79526f827be1fc4c96a98cedf1aef8687549260b3820",
                                "NFT_d9d86676b8189f4a431977d8e483aaab5711eee4041c465c81947d3effb0cec0",
                                "NFT_dfc44edf98cfe15940db487784605e32f3c216323646e06d143c25af33a9a391",
                                "NFT_e90d219bbcdda92a02e73ea1140c236ba4af754bb4d3ffdec0030b9460a3e46b",
                                "NFT_0230ac68550253c3fd9f95a44ef41b2716cef48e3c11004331613e1c9b76c797",
                                "NFT_27cbd6a41b0d26018bac7bf0887148b205bf45a881392b35398dbd3ce02f02a4",
                                "NFT_794badcd22a3ee98154cf8ee3d2a802ecf0c9b96a857f1a9a34fb1792c827cde",
                                "NFT_88ddcf9556cec0cc7f3d9044d1ec5f2a708a9f98190e7e9ff99ce158af38c271",
                                "NFT_cbd1426b8499a1e7e5d4fca5d57dd3388b06d06dad16cb1cd624f5ce3f4b7dfa",
                                "NFT_d789445b6d42b4814e73dfe0ffc3fdd9738b963b695e7afcc58b1798b4994deb",
                                "NFT_e9b905efc53e6c3fa2443f8bbf0d0e87d877f1273aa89f533a8c67f3b77d4b21",
                                "NFT_1bdae9be7e9cdae767fd4b8ec13c157113c37035a9ef15a9aa68df2157e95044",
                                "NFT_248fafa51e3f0e6053851ed354266466b7880d9c61340f37548d085205fb7b42",
                                "NFT_24dff3aa1ee1f6533debc4ea5cd797079a8b122bf8990a88b04fa65c9750e000",
                                "NFT_2cfdef7f02dd5ee3598fb7063e3a206be4746e6f478fed7262b34fefa05f7b9b",
                                "NFT_41eb4f3b5bb5138dee30591706f935a0987e5e5c58bfaf615017ff12e1f88aac",
                                "NFT_448a2029ea7587cd15036eb97bdcb6a3f03c6ef2115f5f698999abaa52e14ee0",
                                "NFT_4ae44afd4c13f74d38864befb3941c09ba5099ac2c2449d18c4dfbbdf4902aef",
                                "NFT_535701ace8d58651cc0fe3526fd735a75656ba064795b8780cbba8203cd4dd06",
                                "NFT_5a5b483dd56f5ef9ea9fb0c3299acceced499a687756d353630d0251512983d9",
                                "NFT_5baee9d8013aa3d7c55f5b30cac5c5b7f69288d084bb382563b257b050bfa844",
                                "NFT_62023932ec8aeab61b176c3b62bc31d2440090b38e4259f4612d3e73d51c2e98",
                                "NFT_677dbadc36c1bf470441b350446b6d853f15c8266650b469265d476151c12f56",
                                "NFT_7481522e8747da52460358ea8ac0a7665ad3bf9eec4a6d610a1f87f20615e0e7",
                                "NFT_7abea4d507cb48e50c52ae8743868a16b52e8eda2162d484067060e69ed868e5",
                                "NFT_b4b1c3d8faf9661c0a5c0f8e4e699c48130db88a7631ca832039574f0585ddc1",
                                "NFT_c0443ad1f470c3355b274de95b6275bd7bd076e1a090489e5b4560a3c3c98863",
                                "NFT_c8349036347a10820c232eee43f23ce4e3ee3c0d03d0607691374dc7c3c52dfe",
                                "NFT_d283412f50b526d0f664ab2c05e3e27822b3ac8e31236f7ae7f81f16165bd845",
                                "NFT_d82323f25c8c13fb9058f036ab5eff744ab68cee453300d0c18d5e95aabb068e",
                                "NFT_db41207d8ff734dd19aa1445601ccbe626d26545cb72f91bc4acff9d0e289ce5",
                                "NFT_e79585ea7e06ca0ae6f6e264f47088bb75d2b63b0a58e6a4712579ab9ea41ba9",
                                "NFT_ec34e5dbc60a5f4e8d6da05fac4b177fac4ebfcb69301e720f0b4304153a0bd0",
                                "NFT_f2796aa144f1dc0999f2aa75a5d392908d3c2655a4fbf78fa953c578ccf7ff37",
                                "NFT_f6ac5f2b475a265c1e46c314fc0c6f4d8fe88111f7ef804764c7beca281e00da",
                                "NFT_f71cd33f67a6d7c2ebffa3c789695bcc27cc1cd462ca39cd85c5989778d5d643",
                                "NFT_0e0a02b949f5b782fd062e4f932d759a84cfa660fc2a894479d006907a7bd404",
                                "NFT_16e5685c5c70526c33bdd70290149b30c9d9dacfeb43142c25f9473b6ca01eb3",
                                "NFT_17c145f495edf2abdd79ee86a832a0bfc732222cd8e8697cb74dcf944f3f4868",
                                "NFT_1bc256c8ab11e206e5f16eb9fffddca6508bc2eca95b8e3fec7a462a2fa2bded",
                                "NFT_3a17c2f12b362f0e99558a7d18a033e97d314a8ffae98772de96adb3703f2409",
                                "NFT_658e0748125c0ea7431f0bbffeee64c9c15295146491e67766ded5d9ddebdece",
                                "NFT_85f93b170fccc5242cd4980a095eddc5ca82f480a08795680c51575cb7c7dcec",
                                "NFT_b72fdd92ae1e6f12dc21f272708a11373365dafbae99a8fc513461a6e90daac4",
                                "NFT_befc779c49f25ef84e5e3d08e34b9f02288d63dbf084a13d0b93f53a02221e27",
                                "NFT_e384359610c1fde995a4eb34ea60b3ac83e0a2ef9c690ebb999575f9148d8155",
                                "NFT_e7fb0cc8726b8c5b29644c180e04426e07b2a331443b0f435a0fff877efde341",
                                "NFT_f38724c9ad1296ba82c302c1235f296f0928a5ca2dd109a669e13d777ad25ebf",
                                "NFT_2cd6ce6a64e787cd69379ce4699c58348b3667b77b0f51a0255912482aea1d91",
                                "NFT_3d894ccd12b3fe803ece0a8724ac7ced4c4d29b5d807f6e410c414cf0264dfd3",
                                "NFT_410992bb424fc1d6e08665f90b7ff759b0ece0f4765ec7dfa0a25fe99c805794",
                                "NFT_6e52cb0aa4796ed1e970dbd204d870a3eea41c7da5026b6da85ac52ea7a614d4",
                                "NFT_8092acbd901730f803d83929299fa722d78921baf7357fd5dd6b2e81f3283337",
                                "NFT_829533b1ce8803415e1291afc206cae21226d59236fa3a902f04afb141654fdf",
                                "NFT_a98c9e0d9e0d89802c0d925babb99e015b7a4904be1cea98fa49134e0de18885",
                                "NFT_c39aa026fae731955896c27f818bf5f5b5bd7a14c494d92428f78559fb7b0f2a",
                                "NFT_cc1f101acd301cc5911703e335255c438d82d3b1f2f4e20f162c6e25a35900cf",
                                "NFT_0514e8376574d6fca405f6339eba408d55652c78d7e7c10eb06de30e2a4445f2",
                                "NFT_054d093e5d243d2deda0f0fd68701d6534ce11b4873e640f4ee56b047941e361",
                                "NFT_0981dbbacd8d3e674a54c3f5ec227be2a8842e9fde6dbe306c64ef4db1b6415a",
                                "NFT_0e787d8a6d5675db37d6d1a41806555ce2d3d9af90cee0f64241b3ce3c7560b3",
                                "NFT_1346b4c40ec7e66fb2aeb84870d569cf5452ebd6071299df254f9c9ef41ee1b2",
                                "NFT_14548c9397da4ad7125ed3fdf68b350316b28686b9cb3dcd76a3411d45a303d0",
                                "NFT_1bb22fecf4f9985b9410879f99641077324c1a2bb443c2c8ba0f6c8c6681ae77",
                                "NFT_1df12af5a335ed445c26eff518dc5e7c53270d86f3fa0cad26f12b566876f59d",
                                "NFT_1f7dc993fdeddde16dcc422c278d7a9e3b8a714eb1b2139846e076dfe6e981a4",
                                "NFT_214bd2360d617a2522a8ad654517501c509bee5a674bab1788d28baa9609e3f9",
                                "NFT_22c055aed2577b768b8d9544eb4cb3b89ec4d876748e4457e73edfcec666e761",
                                "NFT_2793c604e9ca9ad4aef5aa69e2e013a04163d92ba652a39acc2dc22f9613b966",
                                "NFT_27bb65b11fdb4dc2ee48ef2b5c239a5f5664a5a1b28745fef2425896c3b352f9",
                                "NFT_2db88f18c61aefc1bc383e3998146e9f0e1f432f9e57b97c1fe8c762db64bcd4",
                                "NFT_328596480eb966913a0b21c0395fe3be80fc6f7ee3c4716074dcc685849b495f",
                                "NFT_359c327fec1bb43dd37218d71a048c975109c81c0faf5096b844e8090fe7a4a6",
                                "NFT_371fde0998a4cf20f38ba0460f9a55a4f47120015d1dab7be42df1d3224e1587",
                                "NFT_3d2fb5108241df09ff91a5afbc054af34c40c701c8ab789c02492114af68ed31",
                                "NFT_407a5f948da1f1036adae88b5a407503d2c1eb43facfb05d1927c5d987a0934e",
                                "NFT_407e814ea80a7e2c9f30fc0a17a77864d6296a693e14b9fee66a3e124056b506",
                                "NFT_4fe898e6547028d2e7b1ede2eb5563a6071d18265db94926b2f383227b099ada",
                                "NFT_50db983da586dca1e5692ac5d2811511da595c2fd4833543f23fe6b3e110e006",
                                "NFT_57d1b5f71ce89abf0fe917d361559c1937458e1438579f7bea998ac2a07a491e",
                                "NFT_6dde1ccfc3ffca0d6404dd81e3b48e58b899e3fb4800777639db6d0177d64327",
                                "NFT_6f0b211c8337bbc0c9ad3709201788c5e59510af0938b2cc53c0ae943b546a72",
                                "NFT_71d401d0a2a30f89eabca9a04cc8f3523c12b514c8e9c205e7d4c9c6bac9353f",
                                "NFT_73231264729246d5cc67037c3588d53f975463ad224de74577f3e3027102c805",
                                "NFT_7697c38a4bf27d657a60cbb252697674b1fb900e6664eb0d2a676e918d02c930",
                                "NFT_80c2de4753234fb983a1ec3cb4e433f7b5efee01135f00d0f4cde1a994c5283a",
                                "NFT_843fb07ef4ff58a9433f7016c12c982496a6f507eb88bbf25dba5fd7d0bf73ec",
                                "NFT_84cb4b9d7f2288f2b9d268bdcd204040e8477681bec7b315ebc7409a936508ab",
                                "NFT_88fbfd444df8f293040e691427ce45f5912f5bd43341e030fa3ff3cf393935be",
                                "NFT_935aa7e67388670663d0a233b955046dc011996e2ca390fa77b7c71d969a9593",
                                "NFT_940758b7c61e5653d076d4c28fe30dd3b589eef5c258ead05a81ca5ca114fd66",
                                "NFT_a5cfdeef26d3b5874766a079a9ef18f9287480a8a6e239207125eddd2ae983dc",
                                "NFT_a98a3c2add0446c7778063199add15019f155f8dba0b31765716d077d1a15b11",
                                "NFT_b2986f3077972bd80de69d3ec880c18510612c138825d286ede109bd19a1ead0",
                                "NFT_b4dbddcfe8f812f3b62e6be456c0e2e1d0baf8c2d345ce5bee0928c7a57435fc",
                                "NFT_b760af3cc5898451b5a5da4cc7a019b851baf555ff74237655a051a8263fd19b",
                                "NFT_b9fbccf6c0e01bee6802733d6574ebcc82b283ca9d7075a086898d0f5278dedb",
                                "NFT_bec6339cde2bdaaa2e3be809b10d1d52b28e23a05d5ba0554395a17c9678a821",
                                "NFT_c28c85e463c43da94e24cb60415baac3d9591993bfa54d490dea1d5f81d085d0",
                                "NFT_c3087c67809d7ca80026d3dca22c7cb55209053e5099bb884bad0c6c43876743",
                                "NFT_cbbfe5bcb3bd9603f06c0af8a5b58aee4dc20c550be7bfdd7f8fdb0a43847a66",
                                "NFT_d421c2b3297a72b2883b1ac6db4164fb0cc1c0f61261139f5fc9f5ad174445fe",
                                "NFT_d47b1b13ca7af0a2747cd7eb19f05857dd1b924f7f5d148f4ddf36fd9029d69a",
                                "NFT_d5233df3f98ab0843abb94f5ff5b6d87e23c4d14cd5ccaa021804641502b9df9",
                                "NFT_dc1e5e1dc5dac1829a170fdd21a5a925adec9f6c1fc4ae9c961130cbe663a11f",
                                "NFT_e203e1d86d8c2de2d0cc3e464420a2ae525ecfe6d13741c995c826787b9bddce",
                                "NFT_ecd96e590d05f9438879ca33bd7b5c5b596b1d0eb398a409aee7ba3f288c35cf",
                                "NFT_ef150576a718799fdf298200b6c9ca75f8ae51d77f26fa7a9f6d502911dd763f",
                                "NFT_ef4a77a63d9812090ef3fcd7ad19c8b79b28a767ef7f4625153e55a59d17bd94",
                                "NFT_f5fea715458dda4a53e5a4d39156c3312e22c4f5915267a8239dc90bd8938dfb",
                                "NFT_f6b8da7bba5e3745baebff92ca094cff7b08e3d6de0723fcab2eac4fdb6fcc93",
                                "NFT_f6e75a4fe1f593b80255341300c3038f38ced8a809259e2e2aabb9620c355607",
                                "NFT_f7256911b3262289ffee88b0c7ddd5daff8a0a086f63fa3a7655fba4257751b6",
                                "NFT_f9b8df023c3176e2dfe7f66d9c46c4957aabf2940008bb66a445d9f058166781",
                                "NFT_01348c01000000000000000002386f26fc10000000000000000000000000037a",
                                "NFT_059fc727d98628b6426ee9e99dbc2760d44415d2f116344c1fff7570f7d94731",
                                "NFT_09b84bf48da941481d055de3b2de9288aa66b55562e5bc22dd0a4ee91b4554f0",
                                "NFT_10dbe4ff210e5ad3694e81956163d559fcf96a4f47563499595f2eff3a0ffdc7",
                                "NFT_12a0f48ee5f4ef042c3a3dd74a21cd7fff65cd46443319aecee130138ce573aa",
                                "NFT_168f0e7d92c0108399c7122d00ae8f17ea3ceb0109c4a318d00cf8d65884344d",
                                "NFT_2755e66f9aca964a25743d151c1364805b932b92eb4388aab8b3815b18d2f117",
                                "NFT_2bda4ac4400e6de7f6735f554b95184c4ed717868a7f27168ff7249e70d268ec",
                                "NFT_2dd56dcfd2d7e49b18a64135b44759cf1096724471513693a6fb0aa342771a03",
                                "NFT_3b7e3f71ebbafcb712574d36d1a766464d7dea42c4713960043b833018ad4638",
                                "NFT_44951d60947c13fac93e60f336e52b9c0312d0f6bfd2cb061953c7124d3e817d",
                                "NFT_564d9680ad7e657401cedc512f78e11bfec946b7cda661cac03c92d89823094a",
                                "NFT_612bf34c364a3e22becffe7c2858e5fca596f17c1edafa91f7146c53fb2c840b",
                                "NFT_68ee7d95b85e3cc4eaff0eaee0664b2fc122c7e362f42d9684e8beba834308c5",
                                "NFT_6bed1f7e29728cd8589b6baac2ed121fc2c5f42fbc3ee236e2aacad37b1a840d",
                                "NFT_6da68e56d7b8175db0262ce4f81bf8ebf3ccd4bab04d2881d3e306cb473c9039",
                                "NFT_6ea8cdf47282b7dd33b91b759e692deb60628639d2b202496332627ec848fb63",
                                "NFT_74c5b57cf150130a1fcd28c63a192b1f9ca2e1b4b13275f97341ad5adc833dcd",
                                "NFT_82a0d06a8424a4620226b605d7267de92c6c353baa94be0e01eabe3f23c40da1",
                                "NFT_8c64169e4111cc6ff24596b36ad659220191861eeab3c4fef4a6f7de4467307e",
                                "NFT_90448cdd9e086b5d3b7de43524e7f79810c7828a37b509640313d9dadcd937b0",
                                "NFT_927c4a676dcb8413c4526ea0be580d66aa69e534acd95a3565be382354046c68",
                                "NFT_9e7d9b2fa194b13c1d6272da6d29883edb57c73eb21c8e863b74a3559f0ab176",
                                "NFT_abbe2fff2d3e33b2d6c572fbb60e24f68ae7ff5ba8c95003318181756ce26c45",
                                "NFT_ac53ee11196f3668dd6ff0b4ea593232ad956b858d1ff544009bc31df8a593e6",
                                "NFT_e2f044e6c9bb1ecfe937596671adff94fd7fe7dedabd65516f85622d7e60208c",
                                "NFT_f18f7ca9c9d6589afd03f8c1f062f07fa3a651807b38c5df97afdc763f056b44",
                                "NFT_f476b174bdb541061df3f971fdc435a6de3789d4f5695ced25b028295d8ddee1",
                                "NFT_fa24e6450cf5791185d6e6c52a65a8eed0726ca723ac89b8888a2591d083d784",
                                "NFT_fe9d49e50863823192a472b7afae44dae8b6d8bd3aabaa9124b8ddf6672070bb",
                                "NFT_ff2e2e3fd7db8fc4571215177fbc4ff530d16015ae8d79e73b73b75745ecaf2b",
                                "NFT_075b109bf5e8b1b42304e06e0a41fecc524da0ad00cb5333815409e238617fa2",
                                "NFT_2dd6229d405c830d71b0f8eb50efb7ce223d92e3475b194c6c531f20f7364f7d",
                                "NFT_3c8635c75eeeeb88725ce3298226e6b521fbdb3e45ba4df6e653ed4a40189bf0",
                                "NFT_686f83fe0d8f348c0917f5eb465572ba457a2a5d66383cf9098f8caa9b0eb49e",
                                "NFT_699f313e0fea6a61df1278cb5e1d2e478d08f23906a349f6e6241e69a48aaa62",
                                "NFT_764d39533619e852488b182020e14cbe9d2d9adad4f13c3dc074eaf4f8952df7",
                                "NFT_7a843ab9bd89f09889ad67ed39e2e54b991b4966fa51e5abc6d5a93e62adbb79",
                                "NFT_8b1812386d6559b120406352df7fe970e9b387257b99feeb6b8593c4c72dda49",
                                "NFT_9665145d69e029b2399bfb31171f905440f150042af1698969e8acf3702c7a41",
                                "NFT_b508b62797bd86d5cd01edce8849117e53e4932ab8c58096b19b3cd2b21b3465",
                                "NFT_eda9245b3f64ea75b7f060fbd14f677806822de577b575d5276f01469a713dee",
                                "NFT_06d3e759f96e21d9ae6b252c7d868e4292e6b08fdc4c4b50498c891a5e9daec5",
                                "NFT_0760b1320bb1e2266443f1702faa293f880acfc32c909142383792769dbbb4b8",
                                "NFT_0890bbeda4e3f15ae65f0b5f45c5c94c70887b9b85b4b459a049fd3733c3c444",
                                "NFT_17a880821fbbd01147566a04adfd912c81dec472f55ce871204e550f9ff5cd65",
                                "NFT_235721428d8d9b5ab82ef6d6eeb98aaa08f1a81ec0d45173fd2d07ce47256423",
                                "NFT_2508fa53d70e65c0847c8d1ae75c976a1a29b5646077f0458800fa68a2b6319d",
                                "NFT_2cca676bfb75dd3f16e1bf5a25792d48546b361c70c24c668d08a673c3cdabc3",
                                "NFT_319ed7389ca8c25597b7a443516f41922f650ff557478b12e55c6f9b3f3e46ed",
                                "NFT_3ad583e4a51f01e7f2357d454f977ed501d5dac6d672333dd07f434c64ae352d",
                                "NFT_3cc33f0f2eb4cfa0610c3145f720709981303ee7e61599570afbaee108b34617",
                                "NFT_3d4e9a75353a1fafb3cd2a4c56a093976651d4f2c2d058c08e0bbc75b97815e2",
                                "NFT_447c635ec1534003b5598a4cd53ecb09aca04c20384b79297a0b0a20c32192c0",
                                "NFT_49ad2cb7925af853c055627cb171b3d347341233bae18e5e0cf19cf2edc60358",
                                "NFT_4b42ecdd4a10043f673d00906c1ec3ad4ac9522211e2a031e4b6b85bd05547ba",
                                "NFT_4d3144b2d1460f001463df396eb4d0e8e71c4c4dc189222eebdd89c4505ff4f9",
                                "NFT_51eb695e646652368b74d3d831f5ebc1a9c049717c69b0986eef73e3ac6a17d5",
                                "NFT_559ecb5dbbd3f13fdbd508f7a250dfbc29c5d80abdddc089557f5931adb00fa6",
                                "NFT_582d758a66df4bbaf4c3eb8cd5dbf07ce6958f4d46a5f670c34224d09b367ef3",
                                "NFT_58651f2ad53a3c8d84f6a8de26554f12b58af371f44fd93c29232035f08fb4e7",
                                "NFT_5a89a4d7f7f2cba2f146209f7099113031efb606ec4e73bf53cc1e3e0d02fe41",
                                "NFT_5b327c607898c0c5c8981a377a899f6d85a9082fe013b3725f9df41d1e79111a",
                                "NFT_5f3dda854fc9deabc481ab5fe7ff0b9312aac691226a78dd69b982c8bfcb25b5",
                                "NFT_60fd1e2b025d03c1d616ea81a0e8c7c0c43479970fc00320c462a504fbbdb9b6",
                                "NFT_63878adb449079ea968db911d6e967737b463c6bbadea6c93c316f07c7b04698",
                                "NFT_675c65f2e101ea61e2c1fc745deb6ca75cc71e031cb42cd2215a59e559b9a8fb",
                                "NFT_6887bd535596cc55592e8b0accc6413b628affbef1227014052a8e479cf5a6fd",
                                "NFT_6e88584d5652f1079383fcd53e6b3e16fdd1c569b562bb409060d3f7da2a9ac0",
                                "NFT_705984a90a0c244c5ec77d107ab11130584f2c718f37d08cb744a083ce9b046a",
                                "NFT_712bceb43e4ed9d60d8b2ef9b510a2e4f75c67e06c5b2f7c1124852df52d31cd",
                                "NFT_78761cdcaea13f1731b4cbfa6f633f2b80c3fad9b2b0454ca3e92746d8b2069e",
                                "NFT_7890a1666d39a781d118f6d9c15175682182d981d92bb0b3bfa3c95edaeacb98",
                                "NFT_83c151aa7e29b2f29af003db9c083e8596d431e266b2a7d0b8a9939823e488b5",
                                "NFT_867cf44b5498f426b83a317728c83eacb09d174a4f04df029da509b1831df298",
                                "NFT_87acc938fecb803af5bde7e61ee70b94ff1339d04d11c7831cc0bbef8ed328d9",
                                "NFT_8c82420c7c787e8cbe8d0c26dd02bfba22d2d52a43c61769078cda61a845b70d",
                                "NFT_8dec4c0ad425369d7efb465a5ff413f27845424e389eeff1f6264984603ea67e",
                                "NFT_94212b1fb6026dbbe19481310de9f5f309b27ef494533e66cd1ca9fce5f7db0f",
                                "NFT_9764e4268ff4bebe091be7d5306b450f53623497a18c1e0589d477f1cb463277",
                                "NFT_a1b00e6d1e5c4a81f1fac84e294340a2f7c77a9290f0a8b65c89e3959abae887",
                                "NFT_a208ff26e45d0647d03466f7dd2f797bfa724196a0019a9b0cf68413c0e06686",
                                "NFT_a46e07bab1b9c31223ae7423af37d3d58fb5f124362ff44753c17b78a1555379",
                                "NFT_a59c89eb049b43ae931d31f200c0a9f1cd3a2c63924f081a4cfd0155bdb8752b",
                                "NFT_a5c60d2c7f8d737bcb740637d546d7415ead3449a6fe759dbe2c318ca5263f95",
                                "NFT_ad637103c2e2be333af8439e18cfd3b453d2949a5e7d5f1b78f0a911bdb31307",
                                "NFT_b0df910a60f0b518c05c1594c5e0499e6df5526043cb581abc7ed7f275f22bb2",
                                "NFT_ba126e4a6fa239a7fa9b3cc01f3b1fc1327f5e2419393282412f84cbfee955a1",
                                "NFT_cb92c95a1f001c98bd1ca52485ab641925b912869e801e5bf3f7f3e775a62f73",
                                "NFT_d5d627ad872983dcaaab963ce43d4093275b5960265c0df8a91266643a865767",
                                "NFT_d8738726c3ec6db65b68bedd1ab5604c655195427c50e58847aaec7e9cf49364",
                                "NFT_dfdbad63bde64d66401ce15ac65403ba91e758520a311ed475db2a074088f629",
                                "NFT_e20e1aaf4627deb87b6eca4b5fa0182d2832899c153e48dfb68a75e4d3057020",
                                "NFT_e5b425d4840062eaec338fb38bd25d40220c89ece533bf922159a8e73f125472",
                                "NFT_ee026c4ee67c03453b02e5fe21b884173e8fd9aa5ee1f596ab5b6b939ac90190",
                                "NFT_ee4b2343090c6badbe7dc4e3e1422fab525d492cd4b667f86e5e24ebc532010a",
                                "NFT_f2eae4e57ad478b858390aab5f1fc048674e5e09e5bc73cf6be0d4bbe24c5bd5",
                                "NFT_f4ec0573b809a0f7d64e173ed8a5d808903017b905fcd6e1a7f28e098ae03065",
                                "NFT_01348c00000000000000000002386f26fc100000000000000000000000000170",
                                "NFT_10baaadbbf43c8eb9e02bd5390418b248e7afef168762b5b6463967305fc56f5",
                                "NFT_1cfcd61898d6849d157fbf90cd95d7f38be47245f31c05001434ef046504dd49",
                                "NFT_1f27ed8a3eef94fc4a776b01ce679b3848c755f846b923d7dcd48a527a8abd33",
                                "NFT_240fce5fe5baa4095437a9761e2832fdcf6e2d54265cc807edfc8f30ea3e1c74",
                                "NFT_262b64d31a238af48eed60031f43b72f4cbb5551474155a5fb432c7d45e840ab",
                                "NFT_2f5512fba7490eb29dcf2293393a5779a43a0ed2d6ba7bd5f295cee3c97189a4",
                                "NFT_37e9b27e282a56104fdff63bea3fcb72b2ad58f4210a21ce31bbede35faf591c",
                                "NFT_499a5660174048292affdb72e53af57e91cd1ec16cc1a9c11487917429eabedb",
                                "NFT_72332c449121dd7a09ce7dedf0d516368c50a457766a84b4a150c061d83ec1eb",
                                "NFT_76112c6d162a83fbe9542e00dd59376f46a70003558aa7360c7a40a0863e6095",
                                "NFT_80163f8598e4be5ab06bd665ccda0101bca90bcfd936cd6b5573afed8cd83d06",
                                "NFT_8a66dbfb756e675f5283f98de6e6846dcf3536ebdc6f9cc3a4e8c86cbeb9087c",
                                "NFT_92a8ff7a1b2a0ff0a0e46fdde18f581b4f195fdb0869902af87e215018251c4a",
                                "NFT_b29a607e8b7726c8aa048931a6a4a5a1a67b4fa9e42243a301b08b65f013c4c3",
                                "NFT_b8e433f07e5555200923dcef119f22f5bce06f375c21a9e9f952ffa6e443e270",
                                "NFT_c485a7e1e1d48de12787ae33f0efeabf56707d8412756482028596d07daacf81",
                                "NFT_ca4f9ab78b702f5cd4887b1b99207593c96275e412c93dba357f269a1f7a75d4",
                                "NFT_d3ac0a730c56f7b31d87c5210a9a55dce90b8ac7f641676ea363952287ac97f0",
                                "NFT_ea1f65285ddbd9ff152d861dc25fca1e5b3b4eb58875e2acefec36a267ddd65b",
                                "NFT_eb639a1acc6496f4da5b96cf362f08b7e81f0f5f4212c7f504e82a4b28a9cc0e",
                                "NFT_ee3ede8ab380d0aa9c3cb981d639779b48b89af2a5a53d44207e082d375d51e9",
                                "NFT_f752b797034f75a009b89bb1e330f71067d0bed2b0d48ae1873a2f05f5671814",
                                "NFT_243cee3d2eb14016b99a0f530d43984fd22d50eb355eba21489e66c11d897c34",
                                "NFT_38730a8d5863f4a0a61e66914cbeb24cea21860554f18e13725d25e11fb513b6",
                                "NFT_3e796c91b1a6205f7bf24d61c2f3463895875cee303946cee8b427d9076074bc",
                                "NFT_43120017422769de714e917df352315f49335e308b2e24be4fd4a08cef5479c2",
                                "NFT_46ec3cfa92c28af705d7a9bbe0267c955f231903fea829171996b9a184c247e0",
                                "NFT_5a384883eafbd927e901adf9ccecd4ab297794b093af98d4eab02c9465c9c435",
                                "NFT_5db46a3eded77b5e9fd23e8e92d467f0be10251252ef2ae54aa48c70f9b6984d",
                                "NFT_5e53ac414f7269ccd51214064b346dd49ba66370044ffec9bce7be02a2159916",
                                "NFT_62f456bc7074e6c759d6c85ab96125ad9a0253470c24db0de6d22a5bbaf683bb",
                                "NFT_65d52c440eae7bc223dc09ecb5fb8bc126938655c8a0563e764e37e04fdb0f72",
                                "NFT_67a241603cdd15bf8d335e461e47410a4ae9f115e473ce086ba0024a9b0158b1",
                                "NFT_69a78bc4daea1871aef463299634c46338e9039a8c79b5b66b3c6ba6d7c61a87",
                                "NFT_6aa6fea83a8528973c4ab2f5605ad1726f47bb80a51d79b23970b8ff11bb4748",
                                "NFT_6eacee7ce2f2848095f9fdbfd8edceab5b31753323016458848f9184d4149990",
                                "NFT_764df7829f2bbb5e30b302869a414a7a3e1fa83ac06558a7e9d65ceff0c0a07a",
                                "NFT_7c7864561bf9fa0be95d1cdf5fa7d53e0cda6687ee392809aaf68452892e535e",
                                "NFT_8218e87a49acea407d10cc4fb5f5e481fa440ec7908220687ce623774ef0484b",
                                "NFT_83c836b9952d5b1e482118392a6b84f47205ac303cda4254e58f74670ff1acd9",
                                "NFT_8833cca1a3f63194f2087a3aa3e24656d3ef924f98830813db2f5413a4377b4d",
                                "NFT_8ced26770ed618d494cb63aa1d7d67fa97b17baff90eab3ad20f847d0365a7db",
                                "NFT_8e1866347684700f718ebd9555c981e38f32dd43dd8298cc8ee2700d067a3815",
                                "NFT_8f7eed29368a013a507971dbdad3d34ffbfcd9aca490ee5331a9f5f453672e95",
                                "NFT_937f097aabaeb6e9c7381dbd9b3a1d755aab1d4f1cacc8fc198429ff3c99fb4d",
                                "NFT_9f68f48a0568fcc95344625b4fef0f7c9d98acce66f354118eea1012fca7785b",
                                "NFT_a6567ea28119188f056f42a9fab437040d463d666714c924500a1ddbe1e3d02e",
                                "NFT_ab951ca2b8bb358e4b7fadabe1fc5504c9d030fa808dd402b23acde429778678",
                                "NFT_af77a1200061d77b73404a0b460369ef421a4b8eb3c93ee5747b5a1953ed2b46",
                                "NFT_cb29528f909f1dc8d4a6555662d958de19964c2acf916018c25317d21b86c558",
                                "NFT_cf5f5908cac1488cab0fde1a166cbc3c7c771c95e658c8935759cb81023c6369",
                                "NFT_d06ea64bd76f280174deabfaaf4b286b96fb2978d14afefe7a750e1cb8fd66cb",
                                "NFT_d5f979d3a51d221944fb787620b8ca7888842facada7790db79841caf226d55d",
                                "NFT_d93b8ae14ef9496dfa3be438e2bd41704ddd518301aa6e5d654a3a05f7531d2a",
                                "NFT_f0d418dc70bd6f920213648f3a1e8111d2be269ee7f0bdfa10c948071d3ebca2",
                                "NFT_01348c00000000000000000002386f26fc10000000000000000000000000007d",
                                "NFT_271b0515cc86602a37745c14825938b84bdb1430d5b518d1e649c9ca87277a69",
                                "NFT_4ae56871dfc9cda0089e22a13bc2c9c2069912b564183e891754ae5d667a8b2e",
                                "NFT_4d46c32b58c5d10d5aff0b14ea6f942a455865180e7c1a46cc691bb60323d0a4",
                                "NFT_d9b3cc594d284547f904e868134ddbbb6c2bcb2cbb9b8c7d6aa39a6b404cdb50",
                                "NFT_fea28fb79727b6043252b0c40719d891c55a574bfaca30d6bb1442b19fdff7b7",
                                "NFT_3268e2ff549abf4275fdee618fc673774ff23ca6b826bd04ace8b7bc51d476c5",
                                "NFT_3c996fc744055f6354d8d44820e17101379276a2570382186ff4875fc7b69bc0",
                                "NFT_4c2c237524e86f106d2d611738458b5ce874a459e548b73d1dd09ef27f5c2494",
                                "NFT_4ee6b70685943e22ab45cca337962760587864769c6fc92e0f3dcda4d5372f32",
                                "NFT_52f6d42710c5ba246ec3a505aa3cc55d14d5edc3655eeb3e06d0e0e3f1674af9",
                                "NFT_535d63434f1cca9e3967dd432c3782709312248b32729ed525f0cb2f0f95fa86",
                                "NFT_8beccb146c60395620b50b3b21c523a771814d2e7f549f6b5b3127c4f6b93d27",
                                "NFT_972826e0f0ad5d47a6bb28bf4c6296c45be089d7dd0b9a339bcbe8e2b3466ba4",
                                "NFT_9bd5c14afb9cfcae9746d2ca3e454ff5bc7d7b104e9f2f111710878f7a78a1a8",
                                "NFT_a99710c92a816347b7beaf918a7b93e430f6177b87aa3b3ff363b86ec9dd0e8a",
                                "NFT_c33674c027dfba62462683bc2c10108aa0daf9a1426ed3a72a4e7992cb1ae761",
                                "NFT_e74fa5b6295d946baf48d593b8a30d7ce5cf670bfbbd94084c3300dfee95278a",
                                "NFT_ef7e744bd04386bc017f6152956213e0a52450220d94e31512bd12669cbf8473",
                                "NFT_f191c9b7356efec0a4ed4995f0de39f976f8b7451949e3cbfe15753dac6d1c99",
                                "NFT_093938412a802f5e141ac4f19f87bec2d04cdcfcf2012657dc2458e9eb4363a8",
                                "NFT_12d5d87e035b67b5ddfe02caa0a757a33f042313dcbbdd17fc124faabecbfa9b",
                                "NFT_2af26df1fc3032e89cfd24ef4151a90f429c69624ad4365da5a4215771ceee68",
                                "NFT_2e98b5c5a12131da22b321bffdf84e3e441328021221bd4cbbea013bfded684c",
                                "NFT_38291d565d6e0850bcc884cbf2cbab64d5d0146691809b35912f1c0a61102471",
                                "NFT_3c377eff55522bdfa27fbe1b0ab0ae83ba449a1440fcac612551846096d87d50",
                                "NFT_47d204299608abea0426d66a3310f2dc0497f912beb676e7e12922451c43aa81",
                                "NFT_4e9f5c38e5c209d4d4317d9cad43e7418fd8aff19e65df2dc1c778bce85434fd",
                                "NFT_5510d98a7d937c0def096e074a504e31d3e82cf25fa1576008692670779a2a5b",
                                "NFT_5a4f4ae12143ccf1bf1aa4790a58bdaf3480f5844a01501e386aa9cfe1d428ac",
                                "NFT_5e19087d2e33aeebb8772bc73a1c6c110ad138aeae4098a0f52e678141836e39",
                                "NFT_60fecc4d2fb466d057843683475e50d1836f0e21fb47cc4db70f31c8ce6122d5",
                                "NFT_6a5fb3a10d9f4b8a4e0231624acaeaa397dca43b70f5d4ee98ead43f8b6f9481",
                                "NFT_6b25a753f8aa88ae59b89f41e364363552320aaa089db4550461d7155e45576c",
                                "NFT_6d62d5f280ed3d7da8b4704a2b4957648b3556cf3960cad528cdde42d7c9ffd7",
                                "NFT_7aa6ded7ffa9d1452ea0f158a9de9aa064bcc69fc1e38e189dc57cdb8f533ac9",
                                "NFT_8082e2bf14b0c47213f26a2fd22a7d2753644e132ad190c0d862f0fb1535ff44",
                                "NFT_85551b6d57acbb71cc418ddd0112e5004a8b7e1728ce219d45b9f04f8bff12f9",
                                "NFT_8bb48b6e39c1d3dc1b0cfa8744e98d82bac24d701bbf5d96dd03e959f1b522fb",
                                "NFT_978b8dcb52d9c8fbdaca19c07553c24657c5c5c9dee19d23632b6b17e1cc502c",
                                "NFT_9ea911d0e25de23f4a4d17b324300e857a826668a4e435f4d96c53a0fcbfa04c",
                                "NFT_a4054c517d374a7a20116b3af9bf182d0166e860202652547a9ca09c561238ea",
                                "NFT_a784ee2d8e7d0f35c42ae9d616e6599bd12078fb7e17beaf0c11f7d0f34dbee5",
                                "NFT_a9d08b534672c8b6cd4f9d2db1543ffa08e743fd15233e2e7009fe49400415be",
                                "NFT_aec7fbabf70f1fd3cd609f0036296f7f3564cbf86d7feee63272390c2fc491aa",
                                "NFT_b84a5f811afadeb60a6bbedaf1d9241aec50e480295086602de8b61c226865ed",
                                "NFT_ba0d3331efb57a87c4222a32dad11849b661ba3d46e0d6d08c8394ef4536b5ce",
                                "NFT_c5891e28b4da71d4f94718726fb4f92a8d5a44c4e2a5bf4c20a10fa1ceb51d11",
                                "NFT_df489d5da39dba913d0de2283ef54b2b9374de5e289e070a22e24546db116f7d",
                                "NFT_e0c6459f491b9808dd14b31a46ac7722958ee1955d26446919f72638bc71d5bb",
                                "NFT_e0ef4cb70232553234d6be7f598ad1b2eb3a0403c0cd14e32fcddeba490656fd",
                                "NFT_e675015f8dae9fe0ebe5f0d797602576b802c9ff0326a9abb2c11c96a996aed5",
                                "NFT_e6df06a764d9c8fb6a799cabe8506d421caa3a70a1ac59908fc31cf3b497fbb7",
                                "NFT_ef9558951292fca77ebbc38e968a8c87304f6e5b6f2d5e98b8b40fd4fa19a0fa",
                                "NFT_f12c7929df2207a8b3ff0fe62dfe0641f6b9799d4b201b0e49faea6acfbbb596",
                                "NFT_fc75ab55a0e8cb27020197332993cc8219e9269c69d40a16087db9ff94aa623c",
                                "NFT_fd1ac1992c74d5e488cfb207af4f692786477bd8fdd6c73835e90489ceefa000",
                                "NFT_58a0657698cb02769aa7dc2c550201245161ddcc2babec9eb193fbdd966b2d59",
                                "NFT_675b702b8b6360c5e2314b38a7f990493079686d8f1d5a985109b17841e28810",
                                "NFT_8cf9c68fc7a14f3241da4b922e5e18dadbd3804786d580e91b422a061ffd6da7",
                                "NFT_a2b956b744027eace03ddc63a92505af0a8243ad0e0adc3118f666379f632d0b",
                                "NFT_ae586099b3b3b0e0711557668180ac7bdd30bd3a67c8a0abbb42ef4289282bb9",
                                "NFT_0f93ef2096ce3b036d17dbd5827484ad3b3da5794fac2c2c334ff26c0bb23d46",
                                "NFT_1b909ca34d54e4fd8c495a9f8c92ec40e180a23a8677bbd53bea80f22ecdba09",
                                "NFT_34c86af760920b3628352b2fef445119edcf64cb05ea78bd59a6f000b93cb569",
                                "NFT_3f9922ce849c6f3e3801d7eb3608dff94ff9184882d7405580eecc17ce9676e8",
                                "NFT_99e2826518c07c1fef4400fb7b2b86fa1013ffe6f42b84ec2a3a6871d4ee2363",
                                "NFT_b0ff01bbb6730dbb905e84b4127b14e4c9a0dca58c0ad3d9f0eb8caeec5226ff",
                                "NFT_be57c4df97a3d648a380855b8f62f68e16e338a936d79648b973044cb3e8e777",
                                "NFT_c592af34d1aa9c912ff54e1820133b2438bda936728acdbcb3a42cfe8f56d485",
                                "NFT_da5707581690555aad64c0ab4993bec42846d58cbf440b3b70344bb08fbf5d2b",
                                "NFT_e76d7ea62fcd51ffbfb1811717580e17177f77deb063cdb5a256a8818eef6edc",
                                "NFT_2c6f7822231171c4c1fa1c0ce144152de5a47432481dd6840e201c899e7bbb73",
                                "NFT_43be6edbcee12e0c78bd653169d6779a67833ac62a17b7f9f10b9e24b91c9117",
                                "NFT_4dc5565147e01e17ac8927903d614c9a711fbc44123ec0cb96135fbc853a1c2c",
                                "NFT_5ba7dd70969ed17d1f73154d5895dcfee8326a926b7f4efe0ba7126fe649a45e",
                                "NFT_64694b3469d05d5b7ef50ff83c571a5c71c2a7edee2308c5924ccb59136dace5",
                                "NFT_951d16742590673baa57489f8a2b68a558e088d4d9d4616275ed7fc817fcb104",
                                "NFT_9f1607e505a266669f48162ae9dfd7a2366bf92adb74f3b2787f5d59d488ca75",
                                "NFT_c21c008b7d536af3538faff7f6d7bcb2485f59eef6ba4f2da7558605ba8ec0e7",
                                "NFT_c342980a190b5c1f54e82059be5fb565675d19afef91d581da20902c2e037f64",
                                "NFT_005c88fe3a2a79d00891b80ee86bf16ba7b5c9e101c4bfa49bc4166aecce209f",
                                "NFT_144ee356943395a107ade822e5060b9340df92c42cd9f0162246179a8ea4b063",
                                "NFT_3ff76d6e39d717372a9a6f0fc479fcdbd5c491963499ec611535763039563484",
                                "NFT_46b0c969378cebf184ba1b54728060fa1b4d1d92331c155b311cdb719d48e664",
                                "NFT_4797756a1c6812d87bca456d2b2c243d22637bfb81c2474b28b3afd24667e9b6",
                                "NFT_493c96376ff0b56840512f9b496f6644934ebfc9115619c869e5b3d91b4c34ce",
                                "NFT_4e5d8178c110a66c04eaef13fa28d20b32fe6423a626a0e179e76f5c7a72df4f",
                                "NFT_6188f6e1a9f1b3e38a791d8ae5226d24ce3260132389d862dbf156107e9dbc95",
                                "NFT_63a617207524bbd843cc380ab1289be9c87f100790b05d2205c790861c8aefd4",
                                "NFT_7505ca40f1f0026d8f1b3730a7bf708f2a86594f72780fe9efacda52d0954c28",
                                "NFT_762df0f7a31f8220692c10279ebf891b7d9a70341c96784f99c3be7aaa2c6aea",
                                "NFT_87a4835ba3313793ca1fd2df689c35c362732b432b01a4cd5ba317efab3fcfef",
                                "NFT_9101b9945e1861fd814de94090869439f5ceee6104e7c1c7bb2465245583dcc2",
                                "NFT_933e8c579b37e2a3bd0e14ce0e9ea3ca13c2029e1f960175102365d66c9f4f4f",
                                "NFT_c809621bb9910ef0562f2df48cb9eaee0277f31be8cf491e5e11c27113099489",
                                "NFT_d6a823fa8c4be1efa2a72ac40c644c6db596777ab0f741bbc719f2c1a811124e",
                                "NFT_d920120ced2bad570a328a6508bae19d238b808c78958b1156ee9c033c635507",
                                "NFT_e2e75c7ea830a6919f05357908b9448a31ac38c04caccfe6de37ac48b2f8056a",
                                "NFT_eba117b4344382d63a237f176a6e361149293ae80c4235e627258337711dd67b",
                                "NFT_fbedb745662ff8933e39584bd2432c46a22254354e3429c34d3ddb6194bd1748",
                                "NFT_fee979dd6a08a3eb681540da526a91ec0d650fe4504240eb52699f27a4fc2a19",
                                "NFT_ffc3ca14323a89a998239626f2456c6391e355c4b0b7a09c8e546b1eaecb14c0",
                                "NFT_1abff1c021d2fe523b6ac02fa12e5eebc7636d77514ae60c37afa79473750e8f",
                                "NFT_2535f02ebf4a8706e83a1a1bf39ef18f6d7850e84680ae57d5b30092a0b0c2c0",
                                "NFT_401412e0a623a4bc4fe3849c95617ef02e11c1adc9ed84a84349e20be5f681e2",
                                "NFT_46abba556ddcdc44bf90ee41fe8d425356501ce6f740f61d4df025903553eee5",
                                "NFT_5a5ed46a2356369f24660db324a1c8c01f0af014b1208a9dacb0a6eaffe1b0cf",
                                "NFT_6de784b9cc993b39ab41949b0fbd9e6527c2b84c88770e70e48937f8b87b1f6f",
                                "NFT_80d8ef109a005afe4a7394d0211bacb93003689442967bed23c9b3a9502d5614",
                                "NFT_8b8046a814eb90769c80ba0a27a4db554d8a5657016edc713e12fa597f44b6fb",
                                "NFT_8b91da1973684a56ed90f7323ba0ad9fccdcb197b80d21c925c050af289b1178",
                                "NFT_8cdc69f1c02882323dc572fc8a529e5848cf4d389dbf92e09bc719b35e4dbfe4",
                                "NFT_a8f24e6c40e8be30370d87c92ebbf21117e1be215f22a0e726f5f066b3e0e010",
                                "NFT_c8c1aeba7fab3756ddc09f2c0d77b2d826c60c6667de3abb0ff3b935cd2d000f",
                                "NFT_cb1eb978f60bd9239a7b1e427a9b9ddf1af4af169a64b568a35a60c9b51a4866",
                                "NFT_d58af0866fd95cadb3bad4f11b28c90313e8fee6516ab6f5aa55d40d1ea59fdc",
                                "NFT_e4d27d91797ba23ca44d1127c6a9b975722ebbc2854d7c7bcdee9ec459d886f6",
                                "NFT_e829b647122f96651a42abbc9525dd1dd134f4fe426e51fe0acfb9b06605072f",
                                "NFT_13f58d37049671140ac13e014e6a98728ea8894756ec56878d10144ce7549b03",
                                "NFT_5ad2a55e075bd8a41c4789b5b9a8fceee7f2d14892b03c338ce197d478b1d762",
                                "NFT_7f9d978ac75628498dc3f69592a70e82fe536147e3f9147dd26717f38e6a3495",
                                "NFT_c6eff1f60f8ff852b2d8c71e19103f78b73679bc0fca299dc0ac17524ec6d0c7",
                                "NFT_fd265ed715bb596810bc4d9766521be065312cccad46abab85f86219578ed58d",
                                "NFT_07861d4a76b5cd6ecf463aaabafbff509c3130c3e3a6df63eec42e4a0acc9d1d",
                                "NFT_13ae0333a47263a218f5b681ac6e0d11191e3ef788c30de4411488a987f79400",
                                "NFT_1b410f68a52f6180a9875a59fc45d132f686a7e98d383253f0d192c984085c3b",
                                "NFT_22ea8d2626daef8789dbcefb03371602aeb091d130d3f47b6c2f701652badf44",
                                "NFT_39b8d010d222c14d86f6f21286433600685876a36c9a413f42aed7f81232678b",
                                "NFT_4af89a4873e61384be4f56c5e22dab0695b2df8f91538644c9856673441e8406",
                                "NFT_6efbe6fb0b374136842355fbd0ef7f1c1b20cd8f91e718cbca7a4fe820481ce6",
                                "NFT_753c489fc36ad4f21a580f7d91fb4dca70d4062880e46829c75f3b40baab9a4f",
                                "NFT_77ad7594809ec2baaf1084d38642af4cc909380c3aac8cba488ce1f5b0dcdc30",
                                "NFT_8a5b3267a541336b8055a8701bd4cdf9a578be67553703e5faa6d7af75aba933",
                                "NFT_998536aefc0b2189df4dad1043e7dd72fd0218858465f5035f8b6598fd745826",
                                "NFT_abf31d45e035e7234d6372aba010991416c5fd134d60deb6a05f85255e66bef7",
                                "NFT_ac0276e097abe5e980b03e89d4d145f9b3d8140e40fabf4c835d2d2181aac7d4",
                                "NFT_bb3600e92c2927455876e161cf4cf298b0c8ea9bd6b592531af68571ef6fd8d9",
                                "NFT_bf9d823ee8f57c8183ec2beba876eda88dfd27662d55849efae1eebcb6dd6990",
                                "NFT_c9e0add6a52525b2d0fd7e9a403b3bdf16e691883a09cc8bb1f0192c193aeda0",
                                "NFT_cac329c18db2f93210ba11a82517bda4fb0d746201caf49d45a499ea66e60ef9",
                                "NFT_ce867d6ead7e38f94075a2923c12feab5d2f25a964992242f24530ab49836f2c",
                                "NFT_e30984755186eee9e7a2a2f2ce7ea07e02b9bc92cfe676f8ca3099dfa80dbfde",
                                "NFT_ee36e99f4302f1280f890fc259d15df9af61f5ee8108a910117dbe11d1df4179",
                                "NFT_f3207771e39c6db5eb62417adcc9bb2a0e142f40415b3dfedd432a56c05b3bd6",
                                "NFT_f78507357c95b2a35f820ece10a324c734f0530b13850f4323d2c6fbd6363a04",
                                "NFT_f92380b89743228e6367e9bd051382c0cb7dcd3c142031351bb24548999bbe9c",
                                "NFT_fe487c7fbd4d1094505675d19001fbbf27bbfa793c10564f72031d77adfb9f02",
                                "NFT_01348c49000000000000000002386f26fc100000000000000000000000000431",
                                "NFT_20b3eeeda90ade64e6279919243ae0b37d9eb707d9d93b8d5e13d7dfa0d9458d",
                                "NFT_409e2413c9ab80ab0550bec07f6fa445ec9229b41577b48ea888342536965165",
                                "NFT_45107ca7f9406b25657ae4f9da8c4e12413e969df0339cc339654032dd80d0d4",
                                "NFT_5e4fa9722e8c89562c04bee6cd771645a6f936f9232f011475a182c0b31e0fef",
                                "NFT_654ed8a103203ffc42aecc46ed7517090bb9be157389da20a34a46458a7497dd",
                                "NFT_691ae44385539122766a69b4f1fc535c2595738ee084f2f596303a9c60d40854",
                                "NFT_73385d05d561424c95af55a5ebd9883b53bb7ea4588b4e04daaa3c09b7391559",
                                "NFT_750fa1f1b430eeb3443682ec40a36c2f4b9af3616fd7d9c2410e61a992d5d57e",
                                "NFT_7ef49e1aaa3b93a95115385e7a9827dcb02e8c0263b2d4033b7bee529825b359",
                                "NFT_afbbae692d8e798cbd4695559c0324ec0e5f89aca4755304582066564707c8fd",
                                "NFT_bf9d0d96d475f45cb0a9610a0e191c58860876b93b8470c96b3fac05760d5ef2",
                                "NFT_ccb857c2338e7be503d30a1db97e211fcdbbe738722a912d22c396c112d13b4d",
                                "NFT_d142f52499ff6aeddde3f3d8db687f24efc524ef32bcd53e58ef9aea277b8a5a",
                                "NFT_dbee773a8fb09aa762eb6d35e9f3ddd8f37a9465655d5d738628f577fdc044ff",
                                "NFT_e84e79ee479e3ff3064b8a033fbd90c1be78e30ef64321e4622e1293dd348ce0",
                                "NFT_f72ea587df5dd53bcc888dbc59a2b2b2a6bfa27de819be6e68e4a31488486543",
                                "NFT_fb1a38d1124713a2bda48676a7b9b4797db85258f7ca815ed94782f264cf7c1a",
                                "NFT_ffde10408a493b78f9cd5c4fe93234e298d58dada309645a94fbbaca74af4c29",
                                "NFT_05dbb08fe46405fb5f26e19a409a123113c2c870a718b24fa823777f65200328",
                                "NFT_243b0acfc72d99518918ac12c5ed27001594bb131f6afbebb7ae013746492810",
                                "NFT_293de83880112b42a8de0abe3cc194c26c8879721e22c2f60e3de1ebb88d22e1",
                                "NFT_2940a808190c3c063fde2c1cd343d50d60203d817826fee2007dbbf8d64ad79e",
                                "NFT_36e2294e0b0710439f25e1584720e1aac293c3797f97e7e33c9df74df1d0a7f7",
                                "NFT_39842faacf4c92bfd4747c5cbdd5d79d54c60b02c2c3e0e0f709f2fb21586eb4",
                                "NFT_3ca662e904db3c63469574a1458ba5cf65cddc73bd56ebb3e0caceeadb60e9da",
                                "NFT_40abb1531c9d73a96a329b9e97d1a05b24fac611f60881445c0fad6cfe9205e1",
                                "NFT_4dc6d9afc08319b4c91ba0daf4716e9baac52b6a7c10c5f0dfb4c691e2415a9a",
                                "NFT_513b84c12c95470c4d03bca6333c3c9d54ae870f1dbbba3493b29fa6834be013",
                                "NFT_52ce65e7a2169fb1aa90103269e0b06642cd322fc114ce9800de23a433875174",
                                "NFT_856b7e21b43916a148cd975f5d7135e882d654badff4611468c0f658f2c83add",
                                "NFT_b03570581cee25a1a2610bda813b3714f2fdcfcccb4ea1b98b87864993bca1e6",
                                "NFT_b2775affbc1282e46e06da319f7b691563799f2322bd49ef17df6f460f298ad2",
                                "NFT_b405b77eb26002fd908d2d3c8a731f61cf97b1e89ac5c51c9dc6a142af697a03",
                                "NFT_c0b024c7588851125e05ffad4d1f3108502215415ba4f5f2f94146886aa99d4e",
                                "NFT_e9d858a6988b291f78f7c9641b694827765f4f01eb9b95f2b2ca63423ae12ac9",
                                "NFT_f393cc6954db2b0594f3fcb8f75faa8b4afa59e03b5e09b829c3078e33c61177",
                                "NFT_01348c00000000000000000002386f26fc1000000000000000000000000000b5",
                                "NFT_01348c00000000000000000002386f26fc100000000000000000000000000138",
                                "NFT_01348c02000000000000000002386f26fc1000000000000000000000000000ce",
                                "NFT_0290047072095337688ce69e8f3a9fedfe375fb1bb1fd2220226d47596395fe7",
                                "NFT_046892670f5278b599798d4fe2d9b7d29979b2b181270eb656f3d38c170723a2",
                                "NFT_09933c225c7508cbb68b08ddc2dccffc79658a7d704ee9bb121564f8ba5acf03",
                                "NFT_09b0b70d2710e1bc3c6b0248a53e7a436b6e505a9f5ad2934a24db1bb3c87b05",
                                "NFT_4c7c72caf1d54ddbb511c006f8a147d0abfe89c9d65fd78e4170aea25fbae495",
                                "NFT_60ac669a96e49799400d536fc62df7f8fb172a584687d43d609114897da1c2e6",
                                "NFT_7aeb331f86cbe19f1d8f7649b566508e7567dbd260f2205b001a6068538dc171",
                                "NFT_8115f009ffeea516c8f78cbd55860821b98cb7ba14cfef78dbacd3d21ec9a13a",
                                "NFT_a0a99a5211f833083ae1476021d40f034c39beb4032c32114567824ac8cc2a1a",
                                "NFT_a41262aa04b113204b30e597d48766452c9bdc37d8962a0a995b40aeb2282b7b",
                                "NFT_ae74274f3cb79421daf1dde785819909c4f9a8a0238fef57f2047ddfc153d7a9",
                                "NFT_b39e59101f4858a95699c4302cfc8c4a7c60b94d88b03b779f2b6098de68cef8",
                                "NFT_d4525945bab49ca188e4c182a85f9baf93191b1d6cc803065e5a7208b3438b48",
                                "NFT_dc32c0ad4c079597f7d7a6bfe303df6eac2d3a029d5fa28f1ab0d7e8d2857d5a",
                                "NFT_eef65272ce8b16829fb7bf4d3d837b304d8d7862babf324e920047e692dff481",
                                "NFT_f51b5bc795c59b8191ac1deb07fe62ace1ab056ac9519398dc67f0f2169218b8",
                                "NFT_28d12b4d6052b8b99b17f8708944ae0f0b655f5fe4e9899149e63e45b52f53f7",
                                "NFT_3f74bbc2034c0837734cefb8aa18bf45d863fe04139541648f15a94863c7b120",
                                "NFT_478320dcd97eb3d642d3de51193c81958ea00d7c354df29210a66587307b6f8b",
                                "NFT_64b066011c3c61bb839b83f96e534726d54883314719c8c72979e7328bc94f46",
                                "NFT_b78bb90c0833d6f56c4ed6eb285b624b29a0270e556448edda37e96f48027697",
                                "NFT_c7984b2906e769144e629f2d054b2b6cea1e08ed7a738f9aaf6e1be0d26a6e76",
                                "NFT_2450703b22ef14f784d17f36ccc9b657460ea6ad6ba4a1cf7b62e233a6107d52",
                                "NFT_42f7c822068cfeb13eecd2a549e507b28ca08e21c2742066f2a9982dfe35ce69",
                                "NFT_892f7314376c08aa68cabf81a6ef7472b9ab6860d4c0d8ee9b3a6b75b60ed8d2",
                                "NFT_8f8367cbbe187b5caba7f495f411da2bcbc7edc1769219591e7b48f81e6b5d94",
                                "NFT_9811e3d603b48f276a6b7cf22deb33a0f76e6612f67966a2deefb69531dab077",
                                "NFT_98e68fd0427ee3f76b806d5e77621cebd2b7549f639ea32075a4b58825b758e7",
                                "NFT_be87a5f95379bd08a2ee024e85045cd19b1b0a75b2eb338f1c0f20f53efb9755",
                                "NFT_d81b20a854f22263c0abdcfb33763bd49fc8dc1e79137275b67598eff603bf35",
                                "NFT_0b4998771437b40ec0e01d9bcbc5109cc5d4b9c31e29f14bada074ac47e218ca",
                                "NFT_1a92968751745445b51ab8e1ee1754c7bd2c0ab796d6fd3740afc584168721b3",
                                "NFT_20e5033208aa23d6249916bb8466b57db702f469a3fd9ac47e73e35bcc3c69fa",
                                "NFT_217a02f955f7a89efec17e4606d7f0ff1c30e3a289108420533e58a939a57046",
                                "NFT_24837c25f4c7b0d4f0d09214e3b92a12fa0530e6319c4036259edc7a1061add1",
                                "NFT_24f7221945a0d19ed9a7aa860e40eff04baa457be3b161fb7508e0e780e99458",
                                "NFT_34dc92076b682cfe4baa1237ee12991c71a2b503445068dcfa398d49ffb9da55",
                                "NFT_4ac883995c7ff976178936fa27685da1a484625f52177bd1ebc887a4c395d9e6",
                                "NFT_50f33d79016095a5bdf39c9c10ba75cf5d2c48288a2bc0bf4334b370f8431576",
                                "NFT_549d1454650e2ce6b7da455db03ae006dad4ef41ef435427181852b7ba9a55a4",
                                "NFT_6f767cb9204c42c690b5aa4517b305a442de416b75bcb624b809c5444f81be2f",
                                "NFT_8221e414054faf45849b1507042580f970f5f796c6c7bd77ffcb75bb52360d78",
                                "NFT_85e9531473cff75d0abed53a918f1d30b5c5a6e5633c705638a97f97a0dd1739",
                                "NFT_88656755a8a69ded24d2256b2c5b618f2fcdf1da56e3c79bb310630233bfba89",
                                "NFT_8da67d8342c4bf3dab59e6ffb972b6eca91b510edb3b101acf9b2631ebcd225a",
                                "NFT_936792826f4722eab45db183905b3cafe685db4fc3f0ce3b18b2ad23f9fa2c34",
                                "NFT_993b063ef1006517faa711696b2fe35cecc722e103cf414a0d2651a3aaeeaabc",
                                "NFT_aa13f7342013861a73992ecff083fe751ee17f9985ef5eee4e12125e1f389a3a",
                                "NFT_b3a77b04077bdc9036545734763eb1fed9d3c86e154f5a49638494d38e942c62",
                                "NFT_c1708e41dca4f45a624fc7a3a7cf0f6d2bb050a08e69edf06f6e43df5dea9f55",
                                "NFT_c40ed7fb637aced740ef448db1d086abc140fc034c5821831e9eb5d354289708",
                                "NFT_c7cfb3f73a62a077331af528a457219abfa6c7562d2bc9e3a9bd8b57149a5542",
                                "NFT_ce5fac6d79a98657d016f276ad66f53499ce988cd793f329c4803c03ca51ff54",
                                "NFT_d773993d9d9a9fb717fecbaae1dbf197037f5ef5ec0f27b30012cee6489c858d",
                                "NFT_d7e802eae1b30eb0481a6cdfdfd442d97e09a5b8a5f445417c12adeb4eb1c69e",
                                "NFT_d86a1fc6206f790f59011a7c7cc44ece3664591d37987cbdfd790320a3c6e871",
                                "NFT_0ac611bfb192f63fab9758807eb68789fae67fec273294cffc09735652e297ae",
                                "NFT_190b5bc98ffad7dca7675bb5c820b55024b7264b441d21c2983dfe23883228db",
                                "NFT_46f13fc372195ececa2c8683e329be9db296d895cba22fd10d0bd0165a3e7949",
                                "NFT_534bd5bb739eca58128a8343ed24fb466c9c6a9f779d6063e0184c33b28dd212",
                                "NFT_5dccd56bf3b62a2c7d992c3e421824b7c8a7ed8685da6d4cb6d173877e8af01e",
                                "NFT_7beeeb33e7911d2348beb3876a8232091f670528a3248bdf3e936dffab3fbe00",
                                "NFT_8c12fc756b4cff86bdca1c69754495e3a9183decb085d5c8da74b5b3a221957f",
                                "NFT_8d60cec1fcf88a330cd97465ceaf329413c5c9d6ed98fa213175098b2ebfc8da",
                                "NFT_8df42db20b020cb6c4aebce38791d31d9c1afa326228556cdf119daac63b7055",
                                "NFT_919cd216c5facb614c48738fa31fc56bdfc1d2beabe5d9f792d1172462ffab4a",
                                "NFT_a46c092d7e726ab7051fa3989f6322ad7d216f2db4c0f3e22a4b02399dc3c694",
                                "NFT_b4d433718961be472fbc684c4a2e106d1585b78bde60cb3156362f1d64e0a222",
                                "NFT_b5c5ec17ccd606446c82d123521bd3c9a384fd4c49a4a841e1daa8c1ad12932c",
                                "NFT_b7eb90ed0e4803cea46a884107b05786306645d1b43befa8a166d5d6dbfb99af",
                                "NFT_e79b39f579e212b526202f90145e90073c3fa404deb30d98bbdcdcbd0d4089ce",
                                "NFT_f2f43c0d37dcf914eb622fee65a56be3e682a6a2e76a5083265399b509fa5303",
                                "NFT_fed7489bab3fbb843c78cbe3e4a2ee4b9d73aaa6f868c6077d6e7ccc35a1aefa",
                                "NFT_054be2ce269e352966f09c70ccd08955aa7b05f10f132c9941cd2f3ffb526707",
                                "NFT_0dcffadadd30ded18f1397b5633c11cd4ec3b65fe717653a96b6435f680dc1dd",
                                "NFT_23b9f22053e04117cb975fa236385c3d6fc878f2e7f3af738cf31431088af8c1",
                                "NFT_2c7c5b7a98a15313a0938511a27b40692396258ffa5929f76f7fdfaf479a5814",
                                "NFT_2f9e27835f268e0652ad484b141239b002aecef59a4e5008e1de9bfef18925e9",
                                "NFT_3c6aacc6043d462083b4491855b52da317d68ff8c096676efdf9b3ff5352d1d6",
                                "NFT_3df84c6be1512b6bffad64c01b7ac5521c4d0b4b678e37aad52e9a290c3e4945",
                                "NFT_56633a6bf770ec96ba97b3479d19e65203fd5616402e10623f8b92a9a0786885",
                                "NFT_76aa3a0099b4575735c0f566f2f5970e11ccde62f240d62049fde1ee1af02019",
                                "NFT_79f79c225726f246a116160875eebc07c225c281d7aede90ab990d133ab45f08",
                                "NFT_870eb0b279e31ffda83f64dcbb25fa8eca1477d152c504effeaa90948d771ed3",
                                "NFT_8cc6e174f7f2c6f47fcedb85232ddc99c708e2c0afed1a926f459c718a1cd81b",
                                "NFT_9dc6debeaaa57b7a50f59ef487a9b97501288c304c8fc8e2484e3b0b7405cc22",
                                "NFT_a842311787c4f507b761e60ce86161fb21955bddf0b917955d8d528cadf9da15",
                                "NFT_b4e77c916e6811a273bb49fddc2503c6ae86ca431435e6b7239b03cbd2c960bf",
                                "NFT_bbdd4409b02382158b64173bc6308e904359656c8e68f5ad62f1698c0f9c0dc7",
                                "NFT_be8e81894b1e2d08e2f33bd0de2e36932f6b8ef966a2b43517bbf220cf694e26",
                                "NFT_c2c2a12ef81ec371f308fead15592a180d164b086c5236873858d853a70a61fb",
                                "NFT_d2a69ddf31cad64ab6c336814dc12255e76d6fe4919637132cab1b93c308faaf",
                                "NFT_e5742ffc75757faf7847b7a5cbf8858484163c433f77959e0de97a5b74b31123",
                                "NFT_f66d6d532cf7cb0a9e8609b3900ee22bbc6606e7710f07f5838cf0d31bc4f337",
                                "NFT_fc2eec4e08efa809dd52176aba2d347a8e626fa4e8ace907c954f7e304c577c3",
                                "NFT_5d88e765ce64bedbf94bd478e06d3db3fda6b18b11743489830863530199d458",
                                "NFT_69c202749fa76fa0ffbc506050fd6c7ad0f25e792a76598136741a63bc1db9ad",
                                "NFT_7a5559a927ddad7a479d026d256179683335b1ce94c897b114ffbebd02cbe78b",
                                "NFT_8920bfd1f13b642598ec51f8f0a7668a515c83c3087252c73ddd5db7c8074a4f",
                                "NFT_b0b0fa6126d29ce0333f1da7b09fed9ed154d260abb53a8958f78a76ffe004e0",
                                "NFT_c0532bc870d625a8f55915b8e703939044eea0694bca90d57e42b4935e0060b7",
                                "NFT_c2a412d2ea58f9542692f0b260569bd0ebe01ee2b3cf1942c8685c0e2be685d3",
                                "NFT_decadc336cdd318937f60d187c2c90fd5dd6c2280ff4745f3042f7b9c225ee36",
                                "NFT_e85235851068119543f1251ee0884f050ec0afa206478f47418cbdf694d5ff69",
                                "NFT_ea31a2881e994c91d45c9c752d7316b8fa878509b3f149023e64a2f87c254d09",
                                "NFT_ee5e8a356632113d1d894d0d8fc20fa103700aaaa406e4749cb9d5c8f026db2d",
                                "NFT_f0f532b9d5659808e7193dbc119eebd6d5be487a9ae4ace3a4b8026000285f9a",
                                "NFT_3204c5baba08fb3450a9018f43a82de1540bf3e8c3fefb8b553dbb7581a49f84",
                                "NFT_9069ac8ac3a958d4f37cd63d588f76bd3dd23df4f236f49547ff49bf06d992e0",
                                "NFT_48a246cf2e89db8dae25ac5ee43d0fb2bca45b33e117f01c8a1d6babde69eaac",
                                "NFT_dcf7b1adde5f11e4705a9938c2b64c28b18718886c3c79ccda2d1cb04f454011",
                                "NFT_fbe35b710f29c61b0852898bc50c1fe2ccd788ee3a481ac3286aaab8f353a664",
                                "NFT_0365d9643e96f6fb50951170680f8a404b1577103c221e04939ae156842b34de",
                                "NFT_055c9303a29a4b3b02eb040ea34ccabe6eb85a10308cb2f6495f1a8ce924037a",
                                "NFT_0d70d5a484c1e2157682885997435a317ee9a0f548775252eb79573f87a40e97",
                                "NFT_14c184feb4cdd7b4ebfa8d398c56415a4ddb67d163553a06f307f94c9548cc29",
                                "NFT_18550b18a30fb14c737c8dba28e8ec46527d0d5241d09e401e4787d037d5b561",
                                "NFT_1aef66d3c31693557cc02992b7f43955ffba941144ebbb2a49a37ca3997fc87d",
                                "NFT_1b7ba3f69d91235ca02245a239d110250f20848561d13dc3cbd57cefcb57f508",
                                "NFT_2fa3f18159e3005bfe4f14918c2f770179bc993a267b0d5d82ab6090572f188b",
                                "NFT_5f6fad593317dbd9800c8a8bb3295101c1d05a7ccbbce129dbf263aa95b97c91",
                                "NFT_93786133312348528e39425f80197ffa36d6937b02d6b7fa5835395c91b849c8",
                                "NFT_a79b617342f173ed1bef7356bc0e6ca80c18a12d0384ecf097d3d950b211bf5f",
                                "NFT_b5d4f59c3107a004380f04ccdb208e26b16eb13f4c27460e4730fa36496cd3f0",
                                "NFT_e836a2b252e0fb20393893d5c78c056d4185a21618411b8d06c87748e3674c66",
                                "NFT_1fa6081a6a2b7bac75763c297da9065cf8ae371c93e33f5a8501e5b4be470860",
                                "NFT_41215d83d0df4ddbbfe0ae557621e49a1c2b74476c27cd7492c8cce24097c535",
                                "NFT_5b174c0a0251c5d49b5de0f898f18453c7d1d34778c42c351fd5d79a96745149",
                                "NFT_cda20dd1a13999f713508d97778bf2b4697e9b2bc47f9ab25f9eb01f55dcafc2",
                                "NFT_f14342d440ee7bdc61f9d901614b8e8b0a0e4f714af1132648d8bd0b2997d609",
                                "NFT_0befee4d47c0090ff4140c13766d611083ae13f722624c0d5e3059bff1c999c0",
                                "NFT_4973970cacf01f878fffeb983e5693ec69cdd9148e727a6c1b43db7f5b84fecf",
                                "NFT_fd166db63b60fcfa312f336a0f614f0b9683f24bee3bdc84276e4a0203d64be5",
                                "NFT_01348c00000000000000000002386f26fc1000000000000000000000000000d9",
                                "NFT_01348c01000000000000000002386f26fc100000000000000000000000000309",
                                "NFT_207a27eb86025c201e4c5e4496408818269262dadaed7af244de711d9bb38cd4",
                                "NFT_971f06868077c2afea03011dced145d222c422c594206f43c22641c148f68cc1",
                                "NFT_cedf1082a587be2022f90d896eb2ff1a4b5d16e38d7bbbc917b17b51a1ffd4ec",
                                "NFT_cef5ce4d7edef12eae54b8d1df48654ef5caeca0287a8c3cb86265fa6bb799b9",
                                "NFT_e08addaab9619747a94c2d39ea3809f60b71c42742d6256b51f3e1952401aa0e",
                                "NFT_f0c86eca17ccfe5ff2f0caf22ebc37fc0014e834e94505999ac9cd1dea8f6a46",
                                "NFT_f428247c1aa511881b427d6278b2f0397a2dfc5be2da1d63d03e7521c93eb371",
                                "NFT_fc52aee2bc7dcbf926bb1b5b6d45350c8dc9b4dc86602c1f740f6657a5de0455",
                                "NFT_fe0048b4b774318e5862bb7d42daad7096afa315ec619d5078a22fdea4e1d849",
                                "NFT_0ed11173417b64f907b51a2f802c463d620261ebf8a7220057c2d518d26283d7",
                                "NFT_264fbddce4f913e8d41fc55f6fc8956a2aa42b06695d9593ad8dcac3077bbc2b",
                                "NFT_44928a6bbbf350ac44b76016674e04a0cabc72fd154b701bb097213f669334a5",
                                "NFT_45d40a1f8faafb8c0592cd7a2ed69fca07f1bdd50fe951918aad73b3e07b92f0",
                                "NFT_59666c29040c48c086ecabbd104e89f11b85cab036acaa79a18ee3dee8e1a303",
                                "NFT_61a269ef19994c8bc65a849a138a220fae5c6d20c94e7385ae32708955ef1eb9",
                                "NFT_a3cc110a698440fe5291a0e8550536204dff0f74a63e1a0bf4d284cd7d125f7f",
                                "NFT_b6073959093bc46e11542069efbe134978061f534a3c524b1b89041478bf99ea",
                                "NFT_c0ebcde38a48651f1125c376f51094c6bcfef7494f5da0b6f7d9829b0e0df4dc",
                                "NFT_cab59f1e0e4728b987342a5c27b7cffecc7e06c235c9df1e825bda399a233d87",
                                "NFT_e35d91ee21c1110447790dde046abe498c74172ba6f87905001d28bda5441cf4",
                                "NFT_056ae6fa15596c23c69628f5f09ad2c6c85072b4453d0ec4bb5ee550825055ed",
                                "NFT_10d2ce6cfe0f235b1cdb3d4cf828251bfd1cc5c605f1e0282d8b83723aece50d",
                                "NFT_23566c5b2912c093859d03be76d8c486d929bb3a9a807169da778618e4dbe3b5",
                                "NFT_4acbbd4fc6a187d3aa9c904acfadd29d311f3701c33808a395cc584217f3a449",
                                "NFT_4fc4ef65c43106724a9e31df69c370909628043b8c392979bfb2ad8fbf00dd2f",
                                "NFT_5e1c5f1ba951966beb1e8c16b7bc9c7312c0a3c5700d32981cbc6abd79d8f5b1",
                                "NFT_617a95a4b0c9e4b03f5bc00936aaa50c39c58b40c46e86c78e641927782696ef",
                                "NFT_792e952caeb65024a0e503221d6e9e3ba0e7267bf5313ea663143494ffb3af0d",
                                "NFT_81e1a02bdf6f984569508c5c8797f238254e351a334f5a748a83d6bfbf165751",
                                "NFT_b5159ee16b347aa7ad18f2aaea46312a8e5ca7334d4ac677814c98dc2a524498",
                                "NFT_d57b2fe25a9ba7dc91bf160a14cb51b61f37a6c551687655c9a3587f4e1fdcd9",
                                "NFT_ea879b7be3e3876dda4ceab3031718904fb27d2463df153ceb83dcb7578278f3",
                                "NFT_01348c01000000000000000002386f26fc1000000000000000000000000003d3",
                                "NFT_222d56c3ef463b685a6c2fa413ee8ef7e010f66d935a97668a002d644c794b5b",
                                "NFT_229e065ad1a2261f837b42ef797a113b449988f30e07f0ca0d61e03fce146fcc",
                                "NFT_75507fe93104e10d92728fdc2bd1f278f3430565493dd582a7110e41563148e6",
                                "NFT_9a2391f19fe124609c39895f3f3d01be02e4810e8696e4a927a847947650fa83",
                                "NFT_01348c02000000000000000002386f26fc10000000000000000000000000009e",
                                "NFT_03b80a244cc8319e7e9de79afea1b7f3bfd157e2b8ba7e017004e2c18c121ab0",
                                "NFT_0a6b8a3e9339035312acb23b5bd62521c0a3164a8f24e9d9c9094f47bddbcd22",
                                "NFT_226d57321dfb1e8ae1c29b64f65641ecaa0c8f6383e43a3fe05cf280f41629f4",
                                "NFT_2833bd490bbb13a3c9ac210a5f09ec21123550cc40cad0a4891f184df83e4ad7",
                                "NFT_34709cd529a1ff4930fc741fe4cba7a5e01ea3c17a432e893b595302bc6a0c39",
                                "NFT_406bc1686c865035e8e23dc66e2761613fff305899a8a31a52df672641ba282c",
                                "NFT_5fa7f0896745f6d61f38849ed6cabf676a3891967a650a4a31e41090b73846db",
                                "NFT_72af96067e5f71cca70b378be4d4f834c70ee1c2b2c2ed555a351d070a03034f",
                                "NFT_86628f5b99f8eb3b81c31c8ba9d6781c5549d97f92fa0926c7cc9f63d5c24f6f",
                                "NFT_a81bac9a84790bb7676f4e85c9a14297ba4418d5cd983ddae308d2a5d3929583",
                                "NFT_b6a919a9f2ab05c3c738eb60e270397d18cbc2766367515eaa646ec861fa572b",
                                "NFT_dfb6358d37fc6cb4ccb895ecc7180b8fdab42273adbef1cb7738039cda605df3",
                                "NFT_e43e38707a04a1087ff5d65f742117aa3e72620062344192575aa14ce1009958",
                                "NFT_fe19975d1f15fbf0f0cb482aa1dc9437a810caad0d051ac4fbafff6d9501d811",
                                "NFT_2d2a051a22792b444ffaf917c788d849001fbeee10a8258809da8095f20a3b96",
                                "NFT_3719e71052394b2267e0c73825652ce46472fb3da6b2e27593d50bd426da762f",
                                "NFT_421d8007ee1a92890ed3068cc450b018752fcddf6959829c5cbb53c79275b6f1",
                                "NFT_97b350981351c8363a97cf7c44501f4fabc88f874c711889845c9598a4764f65",
                                "NFT_99fa4af9c381a375d74aca2fe218cec6e003d8925a081bda3779009f6c724f73",
                                "NFT_b9e1e153eb47ae3b37aad674c2661506774f9ab99d1893bc0b327c47acb5b6e0",
                                "NFT_c22acbe86ee85ed728ed6fa8294373220e3f300d3467262012cfe4d11cab6a89",
                                "NFT_c8514095b097d049965f8688efb56c12666a819031aaf8a56a5f3425cfb8dfaf",
                                // @nextSpriteLine@
                            ];                          
        },
    
        setup: function($bubbleContainer, canvas, background, foreground, input) {
    		this.setBubbleManager(new BubbleManager($bubbleContainer));
    		this.setRenderer(new Renderer(this, canvas, background, foreground));
    		this.setChatInput(input);
        },
        
        setStorage: function(storage) {
            this.storage = storage;
        },
    
        setRenderer: function(renderer) {
            this.renderer = renderer;
        },

        setUpdater: function(updater) {
            this.updater = updater;
        },
    
        setPathfinder: function(pathfinder) {
            this.pathfinder = pathfinder;
        },
    
        setChatInput: function(element) {
            this.chatinput = element;
        },
    
        setBubbleManager: function(bubbleManager) {
            this.bubbleManager = bubbleManager;
        },

        loadMap: function(mapId) {
            var self = this;
            this.mapId = mapId;
    
            this.map = new Mapx(!this.renderer.upscaledRendering, this, mapId);

            this.storage.setMapId(mapId);
    
        	this.map.ready(function() {
                console.log("Map loaded.");
                var tilesetIndex = self.renderer.upscaledRendering ? 0 : self.renderer.scale - 1;
                self.renderer.setTileset(self.map.tilesets[tilesetIndex]);
                self.map._initStreamCheck();  
        	});
        },
    
        initPlayer: function() {
            this.player.setSpriteName(this.storage.data.player.armor);
            if(this.storage.hasAlreadyPlayed()) {
                this.player.setWeaponName(this.storage.data.player.weapon);
            }
        
        	this.player.setSprite(this.sprites[this.player.getSpriteName()]);
        	this.player.idle();
        
    	    console.debug("Finished initPlayer");
        },

        initShadows: function() {
            this.shadows = {};
            this.shadows["small"] = this.sprites["shadow16"];
        },

        initCursors: function() {
            this.cursors["hand"] = this.sprites["hand"];
            this.cursors["sword"] = this.sprites["sword"];
            this.cursors["loot"] = this.sprites["loot"];
            this.cursors["target"] = this.sprites["target"];
            this.cursors["arrow"] = this.sprites["arrow"];
            this.cursors["talk"] = this.sprites["talk"];
        },
    
        initAnimations: function() {
            this.targetAnimation = new Animation("idle_down", 4, 0, 16, 16);
            this.targetAnimation.setSpeed(50);
        
            this.sparksAnimation = new Animation("idle_down", 6, 0, 16, 16);
            this.sparksAnimation.setSpeed(120);
        },
    
        initHurtSprites: function() {
            var self = this;
        
            Types.forEachArmorKind(function(kind, kindName) {
                self.sprites[kindName].createHurtSprite();
            });
        },
    
        initSilhouettes: function() {
            var self = this;

            Types.forEachMobOrNpcKind(function(kind, kindName) {
                self.sprites[kindName].createSilhouette();
            });
            self.sprites["chest"].createSilhouette();
            self.sprites["item-cake"].createSilhouette();
        },
    
        initAchievements: function() {
            var self = this;
        
            this.achievements = {
                A_TRUE_WARRIOR: {
                    id: 1,
                    name: "A True Warrior",
                    desc: "Find a new weapon"
                },
                INTO_THE_WILD: {
                    id: 2,
                    name: "Into the Wild",
                    desc: "Venture outside the village"
                },
                ANGRY_RATS: {
                    id: 3,
                    name: "Angry Rats",
                    desc: "Kill 10 rats",
                    isCompleted: function() {
                        return self.storage.getRatCount() >= 10;
                    }
                },
                SMALL_TALK: {
                    id: 4,
                    name: "Small Talk",
                    desc: "Talk to a non-player character"
                },
                FAT_LOOT: {
                    id: 5,
                    name: "Fat Loot",
                    desc: "Get a new armor set"
                },
                UNDERGROUND: {
                    id: 6,
                    name: "Underground",
                    desc: "Explore at least one cave"
                },
                AT_WORLDS_END: {
                    id: 7,
                    name: "At World's End",
                    desc: "Reach the south shore"
                },
                COWARD: {
                    id: 8,
                    name: "Coward",
                    desc: "Successfully escape an enemy"
                },
                TOMB_RAIDER: {
                    id: 9,
                    name: "Tomb Raider",
                    desc: "Find the graveyard"
                },
                SKULL_COLLECTOR: {
                    id: 10,
                    name: "Skull Collector",
                    desc: "Kill 10 skeletons",
                    isCompleted: function() {
                        return self.storage.getSkeletonCount() >= 10;
                    }
                },
                NINJA_LOOT: {
                    id: 11,
                    name: "Ninja Loot",
                    desc: "Get hold of an item you didn't fight for"
                },
                NO_MANS_LAND: {
                    id: 12,
                    name: "No Man's Land",
                    desc: "Travel through the desert"
                },
                HUNTER: {
                    id: 13,
                    name: "Hunter",
                    desc: "Kill 50 enemies",
                    isCompleted: function() {
                        return self.storage.getTotalKills() >= 50;
                    }
                },
                STILL_ALIVE: {
                    id: 14,
                    name: "Still Alive",
                    desc: "Revive your character five times",
                    isCompleted: function() {
                        return self.storage.getTotalRevives() >= 5;
                    }
                },
                MEATSHIELD: {
                    id: 15,
                    name: "Meatshield",
                    desc: "Take 5,000 points of damage",
                    isCompleted: function() {
                        return self.storage.getTotalDamageTaken() >= 5000;
                    }
                },
                HOT_SPOT: {
                    id: 16,
                    name: "Hot Spot",
                    desc: "Enter the volcanic mountains"
                },
                HERO: {
                    id: 17,
                    name: "Hero",
                    desc: "Defeat the final boss"
                },
                FOXY: {
                    id: 18,
                    name: "Foxy",
                    desc: "Find the Firefox costume",
                    hidden: true
                },
                FOR_SCIENCE: {
                    id: 19,
                    name: "For Science",
                    desc: "Enter into a portal",
                    hidden: true
                },
                RICKROLLD: {
                    id: 20,
                    name: "Rickroll'd",
                    desc: "Take some singing lessons",
                    hidden: true
                }
            };
        
            _.each(this.achievements, function(obj) {
                if(!obj.isCompleted) {
                    obj.isCompleted = function() { return true; }
                }
                if(!obj.hidden) {
                    obj.hidden = false;
                }
            });
        
            this.app.initAchievementList(this.achievements);
        
            if(this.storage.hasAlreadyPlayed()) {
                this.app.initUnlockedAchievements(this.storage.data.achievements.unlocked);
            }
        },
    
        getAchievementById: function(id) {
            var found = null;
            _.each(this.achievements, function(achievement, key) {
                if(achievement.id === parseInt(id)) {
                    found = achievement;
                }
            });
            return found;
        },
    
        loadSprite: function(name) {
            if(this.renderer.upscaledRendering) {
                this.spritesets[0][name] = new Sprite(name, 1);
            } else {
                this.spritesets[1][name] = new Sprite(name, 2);
                if(!this.renderer.mobile && !this.renderer.tablet) {
                    this.spritesets[2][name] = new Sprite(name, 3);
                }
            }
        },
    
        setSpriteScale: function(scale) {
            var self = this;
            
            if(this.renderer.upscaledRendering) {
                this.sprites = this.spritesets[0];
            } else {
                this.sprites = this.spritesets[scale - 1];
                
                _.each(this.entities, function(entity) {
                    entity.sprite = null;
                    entity.setSprite(self.sprites[entity.getSpriteName()]);
                });
                //this.initHurtSprites();
                this.initShadows();
                this.initCursors();
            }
        },
    
        loadSprites: function() {
            console.log("Loading sprites...");
            this.spritesets = [];
            this.spritesets[0] = {};
            this.spritesets[1] = {};
            this.spritesets[2] = {};
            _.map(this.spriteNames, this.loadSprite, this);
        },
    
        spritesLoaded: function() {
            if(_.any(this.sprites, function(sprite) { return !sprite.isLoaded; })) {
                return false;
            }
            return true;
        },
    
        setCursor: function(name, orientation) {
            if(name in this.cursors) {
                this.currentCursor = this.cursors[name];
                this.currentCursorOrientation = orientation;
            } else {
                console.error("Unknown cursor name :"+name);
            }
        },
    
        updateCursorLogic: function() {
            if(this.hoveringCollidingTile && this.started) {
                this.targetColor = "rgba(255, 50, 50, 0.5)";
            }
            else {
                this.targetColor = "rgba(255, 255, 255, 0.5)";
            }
        
            if(this.hoveringMob && this.started) {
                this.setCursor("sword");
                this.hoveringTarget = false;
                this.targetCellVisible = false;
            }
            else if(this.hoveringNpc && this.started) {
                this.setCursor("talk");
                this.hoveringTarget = false;
                this.targetCellVisible = false;
            }
            else if((this.hoveringItem || this.hoveringChest) && this.started) {
                this.setCursor("loot");
                this.hoveringTarget = false;
                this.targetCellVisible = true;
            }
            else {
                this.setCursor("hand");
                this.hoveringTarget = false;
                this.targetCellVisible = true;
            }
        },
    
        focusPlayer: function() {
            this.renderer.camera.lookAt(this.player);
        },

        addEntity: function(entity) {
            var self = this;
            
            if(this.entities[entity.id] === undefined) {
                this.entities[entity.id] = entity;
                this.registerEntityPosition(entity);
                
                if(!(entity instanceof Item && entity.wasDropped)
                && !(this.renderer.mobile || this.renderer.tablet)) {
                    entity.fadeIn(this.currentTime);
                }
                
                if(this.renderer.mobile || this.renderer.tablet) {
                    entity.onDirty(function(e) {
                        if(self.camera.isVisible(e)) {
                            e.dirtyRect = self.renderer.getEntityBoundingRect(e);
                            self.checkOtherDirtyRects(e.dirtyRect, e, e.gridX, e.gridY);
                        }
                    });
                }
            }
            else {
                console.error("This entity already exists : " + entity.id + " ("+entity.kind+")");
            }
        },

        removeEntity: function(entity) {
            if(entity.id in this.entities) {
                this.unregisterEntityPosition(entity);
                delete this.entities[entity.id];
            }
            else {
                console.error("Cannot remove entity. Unknown ID : " + entity.id);
            }
        },
    
        addItem: function(item, x, y) {
            item.setSprite(this.sprites[item.getSpriteName()]);
            item.setGridPosition(x, y);
            item.setAnimation("idle", 150);
            this.addEntity(item);
        },
    
        removeItem: function(item) {
            if(item) {
                this.removeFromItemGrid(item, item.gridX, item.gridY);
                this.removeFromRenderingGrid(item, item.gridX, item.gridY);
                delete this.entities[item.id];
            } else {
                console.error("Cannot remove item. Unknown ID : " + item.id);
            }
        },
    
        initPathingGrid: function() {
            this.pathingGrid = [];
            this.pathingGridBackup = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.pathingGrid[i] = [];
                this.pathingGridBackup[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.pathingGrid[i][j] = this.map.grid[i][j];
                    this.pathingGridBackup[i][j] = this.map.grid[i][j];
                }
            }
            console.log("Initialized the pathing grid with static colliding cells.");
            _self = this;
        },
    
        initEntityGrid: function() {
            this.entityGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.entityGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.entityGrid[i][j] = {};
                }
            }
            console.log("Initialized the entity grid.");
        },
    
        initRenderingGrid: function() {
            this.renderingGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.renderingGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.renderingGrid[i][j] = {};
                }
            }
            console.log("Initialized the rendering grid.");
        },
    
        initItemGrid: function() {
            this.itemGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.itemGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.itemGrid[i][j] = {};
                }
            }
            console.log("Initialized the item grid.");
        },
    
        /**
         * 
         */
        initAnimatedTiles: function() {
            var self = this,
                m = this.map;

            this.animatedTiles = [];
            this.highAnimatedTiles = [];
            this.forEachVisibleTile(function (id, index) {
                if(m.isAnimatedTile(id)) {
                    var tile = new AnimatedTile(id, m.getTileAnimationLength(id), m.getTileAnimationDelay(id), index),
                        pos = self.map.tileIndexToGridPosition(tile.index);
                    
                    tile.x = pos.x;
                    tile.y = pos.y;
                    if (m.isHighTile(id)) {
                        self.highAnimatedTiles.push(tile);
                    } else {
                        self.animatedTiles.push(tile);
                    }
                }
            }, 1);
            //console.log("Initialized animated tiles.");
        },
    
        addToRenderingGrid: function(entity, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                this.renderingGrid[y][x][entity.id] = entity;
            }
        },
    
        removeFromRenderingGrid: function(entity, x, y) {
            if(entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
                delete this.renderingGrid[y][x][entity.id];
            }
        },
    
        removeFromEntityGrid: function(entity, x, y) {
            if(this.entityGrid[y][x][entity.id]) {
                delete this.entityGrid[y][x][entity.id];
            }
        },
        
        removeFromItemGrid: function(item, x, y) {
            if(item && this.itemGrid[y][x][item.id]) {
                delete this.itemGrid[y][x][item.id];
            }
        },
    
        removeFromPathingGrid: function(x, y) {
            this.pathingGrid[y][x] = 0;
        },
    
        /**
         * Registers the entity at two adjacent positions on the grid at the same time.
         * This situation is temporary and should only occur when the entity is moving.
         * This is useful for the hit testing algorithm used when hovering entities with the mouse cursor.
         *
         * @param {Entity} entity The moving entity
         */
        registerEntityDualPosition: function(entity) {
            if(entity) {
                this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;
            
                this.addToRenderingGrid(entity, entity.gridX, entity.gridY);
            
                if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                    this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
                    if(!(entity instanceof Player) && !(entity instanceof Mob && entity.isFriendly)) {
                        this.pathingGrid[entity.nextGridY][entity.nextGridX] = entity.id;
                    }
                }
            }
        },
    
        /**
         * Clears the position(s) of this entity in the entity grid.
         *
         * @param {Entity} entity The moving entity
         */
        unregisterEntityPosition: function(entity) {
            if(entity) {
                this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                this.removeFromPathingGrid(entity.gridX, entity.gridY);
            
                this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
            
                if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                    this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
                    this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
                }
            }
        },
    
        registerEntityPosition: function(entity) {
            var x = entity.gridX,
                y = entity.gridY;
        
            if(entity) {
                if(entity instanceof Character || entity instanceof Chest) {
                    this.entityGrid[y][x][entity.id] = entity;
                    if(!(entity instanceof Player) && !(entity instanceof Mob && entity.isFriendly)) {
                        this.pathingGrid[y][x] = entity.id;
                    }
                }
                if(entity instanceof Item) {
                    this.itemGrid[y][x][entity.id] = entity;
                }
            
                this.addToRenderingGrid(entity, x, y);
            }
        },

        updatePos: function(entity) {
            this.unregisterEntityPosition(entity);
            this.registerEntityPosition(entity);
        },
    
        setServerOptions: function(host, port, username, protocol) {
            console.log(host, port, protocol)
            this.host = host;
            this.port = port;
            this.username = username;
            this.protocol = protocol;
        },
    
        loadAudio: function() {
            this.audioManager = new AudioManager(this);
        },
    
        initMusicAreas: function() {
            var self = this;
            _.each(this.map.musicAreas, function(area) {
                self.audioManager.addArea(area.x, area.y, area.w, area.h, area.id);
            });
        },

        run: function(started_callback) {
            var self = this;
        
            this.loadSprites();
            this.setUpdater(new Updater(this));
            this.camera = this.renderer.camera;
        
            this.setSpriteScale(this.renderer.scale);
        
        	var wait = setInterval(function() {
                if(self.map.isLoaded && self.spritesLoaded()) {
                    self.ready = true;
                    console.debug('All sprites loaded.');
                            
                    self.loadAudio();
                    
                    self.initMusicAreas();
                    self.initAchievements();
                    self.initCursors();
                    self.initAnimations();
                    self.initShadows();
                    //self.initHurtSprites();
                
                    if(!self.renderer.mobile
                    && !self.renderer.tablet 
                    && self.renderer.upscaledRendering) {
                        self.initSilhouettes();
                    }
            
                    self.initEntityGrid();
                    self.initItemGrid();
                    self.initPathingGrid();
                    self.initRenderingGrid();
                
                    self.setPathfinder(new Pathfinder(self.map.width, self.map.height));
            
                    self.initPlayer();
                    self.setCursor("hand");
                    
                    self.connect(started_callback);
                
                    clearInterval(wait);
                }
        	}, 100);
        },
    
        tick: function() {
            this.currentTime = new Date().getTime();

            if(this.started) {
                this.updateCursorLogic();
                this.updater.update();
                this.renderer.renderFrame();
            }

            if(!this.isStopped) {
                if (this.windowHidden) {
                    setTimeout(this.tick.bind(this), 1000/60);
                } else {
                    requestAnimFrame(this.tick.bind(this));
                }
            }
        },

        start: function() {
            this.tick();
            this.hasNeverStarted = false;
            console.log("Game loop started.");
        },

        stop: function() {
            console.log("Game stopped.");
            this.isStopped = true;
        },
    
        entityIdExists: function(id) {
            return id in this.entities;
        },

        getEntityById: function(id) {
            if(id in this.entities) {
                return this.entities[id];
            }
            else {
                console.error("Unknown entity id : " + id, true);
            }
        },

        connect: function(started_callback) {
            var self = this,
                connecting = false; // always in dispatcher mode in the build version
    
            this.client = new GameClient(this.host, this.port, this.protocol, this.sessionId, this.mapId);
            this.renderStatistics();
            
            //>>excludeStart("prodHost", pragmas.prodHost);
            var config = this.app.config.local || this.app.config.dev;
            if(config) {
                this.client.connect(config.dispatcher); // false if the client connects directly to a game server
                connecting = true;
            }
            //>>excludeEnd("prodHost");
            
            //>>includeStart("prodHost", pragmas.prodHost);
            if(!connecting) {
                this.client.connect(true); // always use the dispatcher in production
            }
            //>>includeEnd("prodHost");
            
            this.client.onDispatched(function(host, port) {
                console.debug("Dispatched to game server "+host+ ":"+port);
                
                self.client.host = host;
                self.client.port = port;
                self.client.connect(); // connect to actual game server
            });
            
            this.client.onConnected(function() {
                console.log("Starting client/server handshake");
                
                self.player.name = self.username;
                self.player.setSpriteName(self.storage.data.player.armor);
                self.started = true;

            
                self.sendHello(self.player);
            });
        
            this.client.onEntityList(function(list) {
                var entityIds = _.pluck(self.entities, 'id'),
                    knownIds = _.intersection(entityIds, list),
                    newIds = _.difference(list, knownIds);
            
                self.obsoleteEntities = _.reject(self.entities, function(entity) {
                    return _.include(knownIds, entity.id) || entity.id === self.player.id;
                });
            
                // Destroy entities outside of the player's zone group
                self.removeObsoleteEntities();
                
                // Ask the server for spawn information about unknown entities
                if(_.size(newIds) > 0) {
                    self.client.sendWho(newIds);
                }
            });
        
            this.client.onWelcome(function(id, name, x, y, hp, title) {
                console.log("Received player ID from server : "+ id);
                self.player.id = id;
                self.playerId = id;
                // Always accept name received from the server which will
                // sanitize and shorten names exceeding the allowed length.
                self.player.name = name;
                console.log(self.storage);
                self.player.setGridPosition(x, y);
                self.player.setMaxHitPoints(hp);
                self.player.title = title;
                self.updateBars();
                self.resetCamera();
                self.updatePlateauMode();
                self.audioManager.updateMusic();
            
                self.addEntity(self.player);
                self.player.dirtyRect = self.renderer.getEntityBoundingRect(self.player);

                setTimeout(function() {
                    self.tryUnlockingAchievement("STILL_ALIVE");
                }, 1500);
            
                if(!self.storage.hasAlreadyPlayed()) {
                    self.storage.initPlayer(self.player.name);
                    self.storage.savePlayer(self.renderer.getPlayerImage(),
                                            self.player.getSpriteName(),
                                            self.player.getWeaponName());
                    self.showNotification("Welcome to LooperLands!");
                } else {
                    self.showNotification("Welcome back to LooperLands!");
                    self.storage.setPlayerName(name);
                }
        
                self.player.onStartPathing(function(path) {
                    var i = path.length - 1,
                        x =  path[i][0],
                        y =  path[i][1];
                
                    if(self.player.isMovingToLoot()) {
                        self.player.isLootMoving = false;
                    }
                    else if(!self.player.isAttacking()) {
                        self.client.sendMove(x, y);
                    }
                
                    // Target cursor position
                    self.selectedX = x;
                    self.selectedY = y;
                    self.selectedCellVisible = true;

                    if(self.renderer.mobile || self.renderer.tablet) {
        	            self.drawTarget = true;
        	            self.clearTarget = true;
        	            self.renderer.targetRect = self.renderer.getTargetBoundingRect();
        	            self.checkOtherDirtyRects(self.renderer.targetRect, null, self.selectedX, self.selectedY);
        	        }
                });
                
                self.player.onCheckAggro(function() {
                    self.forEachMob(function(mob) {
                        if(mob.isAggressive 
                        && (!mob.isFriendly || mob.breakFriendly(self.player)) 
                        && !mob.isAttacking() 
                        && self.player.isNear(mob, mob.aggroRange)) 
                        {
                            self.player.aggro(mob);
                        }
                    });
                });
            
                self.player.onAggro(function(mob) {
                    if(!mob.isWaitingToAttack(self.player) && !self.player.isAttackedBy(mob) && !self.player.isDead) {
                        self.player.log_info("Aggroed by " + mob.id + " at ("+self.player.gridX+", "+self.player.gridY+")");
                        if(mob.aggroMessage != undefined) {
                            self.createBubble(mob.id, mob.aggroMessage);
                            self.assignBubbleTo(mob);
                        }
                        self.client.sendAggro(mob);
                        mob.waitToAttack(self.player);
                    }
                });

                self.player.onBeforeStep(function() {
                    var blockingEntity = self.getEntityAt(self.player.nextGridX, self.player.nextGridY);
                    if(blockingEntity && blockingEntity.id !== self.playerId) {
                        console.debug("Blocked by " + blockingEntity.id);
                    }
                    self.unregisterEntityPosition(self.player);
                });
            
                self.player.onStep(function() {
                    if(self.player.hasNextStep()) {
                        self.registerEntityDualPosition(self.player);
                    }
                
                    if(self.isZoningTile(self.player.gridX, self.player.gridY)) {
                        self.enqueueZoningFrom(self.player.gridX, self.player.gridY);
                    }
                
                    self.player.forEachAttacker(function(attacker) {
                        if(attacker.isAdjacent(attacker.target)) {
                            attacker.lookAtTarget();
                        } else {
                            if (!(attacker instanceof Player)) {
                                attacker.follow(self.player);
                            }
                        }
                    });
                
                    if((self.player.gridX <= 85 && self.player.gridY <= 179 && self.player.gridY > 178) || (self.player.gridX <= 85 && self.player.gridY <= 266 && self.player.gridY > 265)) {
                        self.tryUnlockingAchievement("INTO_THE_WILD");
                    }
                    
                    if(self.player.gridX <= 85 && self.player.gridY <= 293 && self.player.gridY > 292) {
                        self.tryUnlockingAchievement("AT_WORLDS_END");
                    }
                    
                    if(self.player.gridX <= 85 && self.player.gridY <= 100 && self.player.gridY > 99) {
                        self.tryUnlockingAchievement("NO_MANS_LAND");
                    }
                    
                    if(self.player.gridX <= 85 && self.player.gridY <= 51 && self.player.gridY > 50) {
                        self.tryUnlockingAchievement("HOT_SPOT");
                    }
                    
                    if(self.player.gridX <= 27 && self.player.gridY <= 123 && self.player.gridY > 112) {
                        self.tryUnlockingAchievement("TOMB_RAIDER");
                    }
                
                    self.updatePlayerCheckpoint();
                
                    if(!self.player.isDead) {
                        self.audioManager.updateMusic();
                    }
                });
            
                self.player.onStopPathing(function(x, y) {
                    if(self.player.hasTarget()) {
                        self.player.lookAtTarget();
                    }
                
                    self.selectedCellVisible = false;

                    if(self.isItemAt(x, y)) {
                        var item = self.getItemAt(x, y);

                        try {
                            let aboutToEquipWeaponButHasNFTWeapon = item.type === "weapon" && self.player.getWeaponName().startsWith("NFT_");
                            if (!aboutToEquipWeaponButHasNFTWeapon) {
                                self.player.loot(item);
                                self.client.sendLoot(item); // Notify the server that this item has been looted
                                self.removeItem(item);
                                self.showNotification(item.getLootMessage());
                            
                                if(item.type === "armor") {
                                    self.tryUnlockingAchievement("FAT_LOOT");
                                }
                                
                                if(item.type === "weapon") {
                                    self.tryUnlockingAchievement("A_TRUE_WARRIOR");
                                }

                                if(item.kind === Types.Entities.CAKE) {
                                    self.tryUnlockingAchievement("FOR_SCIENCE");
                                }
                                
                                if(item.kind === Types.Entities.FIREPOTION) {
                                    self.tryUnlockingAchievement("FOXY");
                                    self.audioManager.playSound("firefox");
                                }
                            
                                if(Types.isHealingItem(item.kind)) {
                                    self.audioManager.playSound("heal");
                                } else {
                                    self.audioManager.playSound("loot");
                                }
                                
                                if(item.wasDropped && !_(item.playersInvolved).include(self.playerId)) {
                                    self.tryUnlockingAchievement("NINJA_LOOT");
                                }
                            } else {
                                console.log("You can't loot weapons because you have a NFT weapon equipped.");
                            }
                        } catch(e) {
                            if(e instanceof Exceptions.LootException) {
                                self.showNotification(e.message);
                                self.audioManager.playSound("noloot");
                            } else {
                                throw e;
                            }
                        }
                    }
                
                    if(!self.player.hasTarget() && self.map.isDoor(x, y)) {
                        var dest = self.map.getDoorDestination(x, y);
                        var _self = self;

                        function goInside() {
                            if (dest.map !== undefined) {
                                let url = '/session/' + self.sessionId + '/teleport';
                                axios.post(url, dest).then(function (response) {
                                    if (response.status === 200) {
                                        let newSessionID = response.data.sessionId;
                                        window.location.href = '/?sessionId=' + newSessionID;
                                    } else {
                                        console.error(response);
                                    }
                                }).catch(function (error) {
                                    console.log(error);
                                }).finally(function(e) {
    
                                });
                            } else {
                                _self.player.setGridPosition(dest.x, dest.y);
                                _self.player.nextGridX = dest.x;
                                _self.player.nextGridY = dest.y;
                                _self.player.turnTo(dest.orientation);
                                _self.client.sendTeleport(dest.x, dest.y);
                                
                                if(_self.renderer.mobile && dest.cameraX && dest.cameraY) {
                                    _self.camera.setGridPosition(dest.cameraX, dest.cameraY);
                                    _self.resetZone();
                                } else {
                                    if(dest.portal) {
                                        _self.assignBubbleTo(_self.player);
                                    } else {
                                        _self.camera.focusEntity(_self.player);
                                        _self.resetZone();
                                    }
                                }
                                
                                if(_.size(_self.player.attackers) > 0) {
                                    setTimeout(function() { _self.tryUnlockingAchievement("COWARD"); }, 500);
                                }
                                _self.player.forEachAttacker(function(attacker) {
                                    attacker.disengage();
                                    attacker.idle();
                                });
                            
                                _self.updatePlateauMode();
                                
                                _self.checkUndergroundAchievement();
                                
                                if(_self.renderer.mobile || _self.renderer.tablet) {
                                    // When rendering with dirty rects, clear the whole screen when entering a door.
                                    _self.renderer.clearScreen(_self.renderer.context);
                                }
                                
                                if(dest.portal) {
                                    _self.audioManager.playSound("teleport");
                                }
                                
                                if(!_self.player.isDead) {
                                    _self.audioManager.updateMusic();
                                }
                            }
                        }

                        function checkTrigger() {
                            if (dest.triggerId !== undefined) {    
                                let trUrl = '/session/' + self.sessionId + '/requestTeleport/' + dest.triggerId;
                                _self.doorCheck = true;
                                axios.get(trUrl).then(function (response) {
                                    if (response.data === true) {
                                        goInside();
                                        _self.updatePos(self.player);
                                    } else {
                                        _self.showNotification("This entrance is currently inactive.");
                                    }
                                }).catch(function (error) {
                                    console.error("Error while checking the trigger.");
                                }).finally(function(e) {
                                    _self.doorCheck = false;
                                });
                            } else {
                                goInside();
                                _self.updatePos(self.player);
                            }
                        }

                        if (dest.nft !== undefined) {
                            var url = '/session/' + self.sessionId + '/owns/' + dest.nft;
                            _self.doorCheck = true;
                            axios.get(url).then(function (response) {
                                if (response.data === true) {
                                    checkTrigger()
                                } else {
                                    _self.showNotification("You don't own the required NFT to enter.");
                                }
                            }).catch(function (error) {
                                console.error("Error while checking ownership of token gate.");
                            }).finally(function(e) {
                                _self.doorCheck = false;
                            });
                        } else if (dest.item !== undefined) {
                            let url = '/session/' + self.sessionId + '/ownsItem/' + dest.item;
                            _self.doorCheck = true;
                            axios.get(url).then(function (response) {
                                if (response.data === true) {
                                    checkTrigger();
                                } else {
                                    _self.showNotification("You do not have the required item to enter.");
                                }
                            }).catch(function (error) {
                                console.error("Error while checking ownership of token gate.");
                            }).finally(function(e) {
                                _self.doorCheck = false;
                            });
                        } else {
                            checkTrigger();
                        }
                    }
                
                    if(self.player.target instanceof Npc) {
                        self.makeNpcTalk(self.player.target);
                    } else if(self.player.target instanceof Chest) {
                        self.client.sendOpen(self.player.target);
                        self.audioManager.playSound("chest");
                    }

                    self.player.forEachAttacker(function(attacker) {
                        if(!attacker.isAdjacentNonDiagonal(self.player) && !(attacker instanceof Player)) {
                            attacker.follow(self.player);
                        }
                    });
                    
                    self.updatePos(self.player);
                });
            
                self.player.onRequestPath(function(x, y) {
                    var ignored = [self.player]; // Always ignore self
                
                    if(self.player.hasTarget()) {
                        ignored.push(self.player.target);
                    }
                    return self.findPath(self.player, x, y, ignored);
                });
            
                self.player.onDeath(function() {
                    console.log(self.playerId + " is dead");
                
                    self.player.stopBlinking();
                    self.player.setSprite(self.sprites["death"]);
                    self.player.animate("death", 120, 1, function() {
                        console.log(self.playerId + " was removed");
                    
                        self.removeEntity(self.player);
                        self.removeFromRenderingGrid(self.player, self.player.gridX, self.player.gridY);
                    
                        self.player = null;
                        self.client.disable();
                    
                        setTimeout(function() {
                            self.playerdeath_callback();
                        }, 1000);
                    });
                
                    self.player.forEachAttacker(function(attacker) {
                        attacker.disengage();
                        attacker.idle();
                    });
                
                    self.audioManager.fadeOutCurrentMusic();
                    self.audioManager.playSound("death");
                });
            
                self.player.onHasMoved(function(player) {
                    self.assignBubbleTo(player);
                });
                
                self.player.onArmorLoot(function(armorName) {
                    return;
                });
            
                self.player.onSwitchItem(function() {
                    var weaponName = self.player.getWeaponName();
                    if (!weaponName.startsWith("NFT_")) {
                        self.storage.setPlayerWeapon(self.player.getWeaponName());
                    }

                    if(self.equipment_callback) {
                        self.equipment_callback();
                    }
                });
                
                self.player.onInvincible(function() {
                    self.invincible_callback();
                    self.player.switchArmor(self.sprites["firefox"]);
                });
            
                self.client.onSpawnItem(function(item, x, y) {
                    console.log("Spawned " + Types.getKindAsString(item.kind) + " (" + item.id + ") at "+x+", "+y);
                    self.addItem(item, x, y);
                });
            
                self.client.onSpawnChest(function(chest, x, y) {
                    console.log("Spawned chest (" + chest.id + ") at "+x+", "+y);
                    chest.setSprite(self.sprites[chest.getSpriteName()]);
                    chest.setGridPosition(x, y);
                    chest.setAnimation("idle_down", 150);
                    self.addEntity(chest, x, y);
                
                    chest.onOpen(function() {
                        chest.stopBlinking();
                        chest.setSprite(self.sprites["death"]);
                        chest.setAnimation("death", 120, 1, function() {
                            console.log(chest.id + " was removed");
                            self.removeEntity(chest);
                            self.removeFromRenderingGrid(chest, chest.gridX, chest.gridY);
                            self.previousClickPosition = {};
                        });
                    });
                });
            
                self.client.onSpawnCharacter(function(entity, x, y, orientation, targetId) {

                    if (self.entityIdExists(entity.id) && entity instanceof Player) {
                        existingEntity = self.entities[entity.id];
                        if(!self.camera.isVisiblePosition(existingEntity.gridX, existingEntity.gridY)) {
                            console.log("Entity "+existingEntity.id+" is outside of the camera view so removing for respawn.");
                            self.removeEntity(existingEntity);
                            self.removeFromRenderingGrid(existingEntity, existingEntity.gridX, existingEntity.gridY);
                        }
                    }

                    if(!self.entityIdExists(entity.id)) {
                        try {
                            if(entity.id !== self.playerId) {
                                entity.setSprite(self.sprites[entity.getSpriteName()]);
                                entity.setGridPosition(x, y);
                                entity.setOrientation(orientation);
                                entity.idle();
                                if (entity.name === undefined) {
                                    entity.name = entity.normalSprite.name.replace(/[0-9]+/, "");
                                }                                

                                self.addEntity(entity);
                                self.getServerInfo();

                        
                                console.debug("Spawned " + Types.getKindAsString(entity.kind) + " (" + entity.id + ") at "+entity.gridX+", "+entity.gridY);
                        
                                if(entity instanceof Character) {
                                    entity.onBeforeStep(function() {
                                        self.unregisterEntityPosition(entity);
                                    });

                                    entity.onStep(function() {
                                        if(!entity.isDying) {
                                            self.registerEntityDualPosition(entity);

                                            entity.forEachAttacker(function(attacker) {
                                                if(attacker.isAdjacent(attacker.target)) {
                                                    attacker.lookAtTarget();
                                                } else {
                                                    attacker.follow(entity);
                                                }
                                            });
                                        }
                                    });

                                    entity.onStopPathing(function(x, y) {
                                        if(!entity.isDying) {
                                            if(entity.hasTarget() && entity.isAdjacent(entity.target)) {
                                                entity.lookAtTarget();
                                            }
                                
                                            if(entity instanceof Player) {
                                                var gridX = entity.destination.gridX,
                                                    gridY = entity.destination.gridY;
                                                
                                                if(self.map.isDoor(gridX, gridY)) {
                                                    var dest = self.map.getDoorDestination(gridX, gridY);

                                                    function checkTrigger() {
                                                        if (dest.triggerId !== undefined) {    
                                                            let trUrl = '/session/' + self.sessionId + '/requestTeleport/' + dest.triggerId;
                                                            axios.get(trUrl).then(function (response) {
                                                                if (response.data === true) {
                                                                    entity.setGridPosition(dest.x, dest.y);
                                                                    self.updatePos(entity);
                                                                }
                                                            }).catch(function (error) {
                                                                console.error("Error while checking the trigger.");
                                                            });
                                                        } else {
                                                            entity.setGridPosition(dest.x, dest.y);
                                                            self.updatePos(entity);
                                                        }
                                                    }
                                                    
                                                    if (dest.nft !== undefined) {
                                                        var url = self.map.mapId + '/player/' + entity.id + '/owns/' + dest.nft;
                                                        axios.get(url).then(function (response) {
                                                            if (response.data === true) {
                                                                checkTrigger()
                                                            }
                                                        }).catch(function (error) {
                                                            console.error("Error while checking ownership of token gate.");
                                                        });
                                                    } else {
                                                        checkTrigger();
                                                    }
                                                }
                                            }
                                        
                                            entity.forEachAttacker(function(attacker) {
                                                if(!attacker.isAdjacentNonDiagonal(entity) && attacker.id !== self.playerId) {
                                                    attacker.follow(entity);
                                                }
                                            });
                                
                                            self.updatePos(entity);
                                        }
                                    });

                                    entity.onRequestPath(function(x, y) {
                                        var ignored = [entity], // Always ignore self
                                            ignoreTarget = function(target) {
                                                ignored.push(target);

                                                // also ignore other attackers of the target entity
                                                target.forEachAttacker(function(attacker) {
                                                    ignored.push(attacker);
                                                });
                                            };
                                        
                                        if(entity.hasTarget()) {
                                            ignoreTarget(entity.target);
                                        } else if(entity.previousTarget) {
                                            // If repositioning before attacking again, ignore previous target
                                            // See: tryMovingToADifferentTile()
                                            ignoreTarget(entity.previousTarget);
                                        }
                                        
                                        return self.findPath(entity, x, y, ignored);
                                    });

                                    entity.onDeath(function() {
                                        console.log(entity.id + " is dead");
                                
                                        if(entity instanceof Mob) {
                                            // Keep track of where mobs die in order to spawn their dropped items
                                            // at the right position later.
                                            self.deathpositions[entity.id] = {x: entity.gridX, y: entity.gridY};
                                        }

                                        entity.isDying = true;

                                        if(!entity.deathAnimated) {
                                            entity.setSprite(self.sprites["death"]);
                                        }
                                        entity.animate("death", 120, 1, function() {
                                            console.log(entity.id + " was removed");

                                            self.removeEntity(entity);
                                            self.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                                        });

                                        entity.forEachAttacker(function(attacker) {
                                            attacker.disengage();
                                        });
                                        
                                        if(self.player.target && self.player.target.id === entity.id) {
                                            self.player.disengage();
                                        }
                                    
                                        // Upon death, this entity is removed from both grids, allowing the player
                                        // to click very fast in order to loot the dropped item and not be blocked.
                                        // The entity is completely removed only after the death animation has ended.
                                        self.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                                        self.removeFromPathingGrid(entity.gridX, entity.gridY);
                                    
                                        if(self.camera.isVisible(entity)) {
                                            self.audioManager.playSound("kill"+Math.floor(Math.random()*2+1));
                                        }
                                    
                                        self.updateCursor();
                                    });

                                    entity.onHasMoved(function(entity) {
                                        self.assignBubbleTo(entity); // Make chat bubbles follow moving entities
                                    });

                                    if(entity instanceof Mob || entity instanceof Player) {
                                        if(targetId) {
                                            var player = self.getEntityById(targetId);
                                            if(player) {
                                                self.createAttackLink(entity, player);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch(e) {
                            console.error(e);
                        }
                    } else {
                        console.log("Character "+entity.id+" already exists. Don't respawn.");
                    }
                });

                self.client.onDespawnEntity(function(entityId) {
                    var entity = self.getEntityById(entityId);

            
                    if(entity) {
                        console.log("Despawning " + Types.getKindAsString(entity.kind) + " (" + entity.id+ ")");
                        
                        if(entity.gridX === self.previousClickPosition.x
                        && entity.gridY === self.previousClickPosition.y) {
                            self.previousClickPosition = {};
                        }
                        
                        if(entity instanceof Item) {
                            self.removeItem(entity);
                        } else if(entity instanceof Character) {
                            entity.forEachAttacker(function(attacker) {
                                if(attacker.canReachTarget()) {
                                    attacker.hit();
                    	        }
                            });
                            entity.die();
                        } else if(entity instanceof Chest) {
                            entity.open();
                        }
                        
                        entity.clean();
                    }
                });
            
                self.client.onItemBlink(function(id) {
                    var item = self.getEntityById(id);

                    if(item) {
                        item.blink(150);
                    }
                });

                self.client.onEntityMove(function(id, x, y) {
                    var entity = null;

                    if(id !== self.playerId) {
                        entity = self.getEntityById(id);
                
                        if(entity) {
                            if(self.player.isAttackedBy(entity)) {
                                self.tryUnlockingAchievement("COWARD");
                            }
                            entity.disengage();
                            entity.idle();
                            self.makeCharacterGoTo(entity, x, y);
                        }
                    }
                });
            
                self.client.onEntityDestroy(function(id) {
                    var entity = self.getEntityById(id);
                    if(entity) {
                        if(entity instanceof Item) {
                            self.removeItem(entity);
                        } else {
                            self.removeEntity(entity);
                        }
                        console.debug("Entity was destroyed: "+entity.id);
                    }
                });
            
                self.client.onPlayerMoveToItem(function(playerId, itemId) {
                    var player, item;

                    if(playerId !== self.playerId) {
                        player = self.getEntityById(playerId);
                        item = self.getEntityById(itemId);
                
                        if(player && item) {
                            self.makeCharacterGoTo(player, item.gridX, item.gridY);
                        }
                    }
                });
            
                self.client.onEntityAttack(function(attackerId, targetId) {
                    self.getServerInfo();
                    var attacker = self.getEntityById(attackerId),
                        target = self.getEntityById(targetId);
                    if(attacker && target && attacker.id !== self.playerId) {
                        console.debug(attacker.id + " attacks " + target.id);
                        
                        if(attacker && target instanceof Player && target.id !== self.playerId && target.target && target.target.id === attacker.id && attacker.getDistanceToEntity(target) < 3) {
                            setTimeout(function() {
                                self.createAttackLink(attacker, target);
                            }, 200); // delay to prevent other players attacking mobs from ending up on the same tile as they walk towards each other.
                        } else {
                            self.createAttackLink(attacker, target);
                        }
                    }
                });
            
                self.client.onPlayerDamageMob(function(mobId, points) {
                    var mob = self.getEntityById(mobId);
                    if(mob && points) {
                        self.infoManager.addDamageInfo(points, mob.x, mob.y - 15, "inflicted");
                    }
                });
            
                self.client.onPlayerKillMob(function(kind, xp) {
                    var mobName = Types.getKindAsString(kind);

                    setTimeout(function() {
                        self.infoManager.addDamageInfo("+"+xp+" XP", self.player.x, self.player.y - 15, "xp");
                    }, 200);

                    self.renderStatistics();

                    if(mobName === 'skeleton2') {
                        mobName = 'greater skeleton';
                    }
                    
                    if(mobName === 'eye') {
                        mobName = 'evil eye';
                    }
                    
                    if(mobName === 'deathknight') {
                        mobName = 'death knight';
                    }
                    
                    if(mobName === 'boss') {
                        self.showNotification("You killed the skeleton king");
                    } else {
                        if(_.include(['a', 'e', 'i', 'o', 'u'], mobName[0])) {
                            self.showNotification("You killed an " + mobName);
                        } else {
                            self.showNotification("You killed a " + mobName);
                        }
                    }
                    
                    self.storage.incrementTotalKills();
                    self.tryUnlockingAchievement("HUNTER");

                    if(kind === Types.Entities.RAT) {
                        self.storage.incrementRatCount();
                        self.tryUnlockingAchievement("ANGRY_RATS");
                    }
                    
                    if(kind === Types.Entities.SKELETON || kind === Types.Entities.SKELETON2) {
                        self.storage.incrementSkeletonCount();
                        self.tryUnlockingAchievement("SKULL_COLLECTOR");
                    }

                    if(kind === Types.Entities.BOSS) {
                        self.tryUnlockingAchievement("HERO");
                    }
                });
            
                self.client.onPlayerChangeHealth(function(points, isRegen) {
                    var player = self.player,
                        diff,
                        isHurt;
                
                    if(player && !player.isDead && !player.invincible) {
                        isHurt = points <= player.hitPoints;
                        diff = points - player.hitPoints;
                        player.hitPoints = points;

                        if(player.hitPoints <= 0) {
                            player.die();
                        }
                        if(isHurt) {
                            player.hurt();
                            self.infoManager.addDamageInfo(diff, player.x, player.y - 15, "received");
                            self.audioManager.playSound("hurt");
                            self.storage.addDamage(-diff);
                            self.tryUnlockingAchievement("MEATSHIELD");
                            if(self.playerhurt_callback) {
                                self.playerhurt_callback();
                            }
                        } else if(!isRegen){
                            self.infoManager.addDamageInfo("+"+diff, player.x, player.y - 15, "healed");
                        }
                        self.updateBars();
                    }
                });
            
                self.client.onPlayerChangeMaxHitPoints(function(hp) {
                    self.player.maxHitPoints = hp;
                    self.player.hitPoints = hp;
                    self.updateBars();
                });
            
                self.client.onPlayerEquipItem(function(playerId, itemKind) {
                    var player = self.getEntityById(playerId),
                        itemName = Types.getKindAsString(itemKind);
                
                    if(player) {
                        if(Types.isArmor(itemKind)) {
                            player.setSprite(self.sprites[itemName]);
                        } else if(Types.isWeapon(itemKind)) {
                            player.setWeaponName(itemName);
                        }
                    }
                });
            
                self.client.onPlayerTeleport(function(id, x, y) {
                    var entity = null,
                        currentOrientation;

                    if(id !== self.playerId) {
                        entity = self.getEntityById(id);
                
                        if(entity) {
                            currentOrientation = entity.orientation;
                        
                            self.makeCharacterTeleportTo(entity, x, y);
                            entity.setOrientation(currentOrientation);
                        
                            entity.forEachAttacker(function(attacker) {
                                attacker.disengage();
                                attacker.idle();
                                attacker.stop();
                            });
                        }
                    }
                });
            
                self.client.onDropItem(function(item, mobId) {
                    var pos = self.getDeadMobPosition(mobId);
                
                    if(pos) {
                        self.addItem(item, pos.x, pos.y);
                        self.updateCursor();
                    }
                });
            
                self.client.onChatMessage(function(entityId, message) {
                    var entity = self.getEntityById(entityId);
                    self.createBubble(entityId, message);
                    self.assignBubbleTo(entity);
                    self.audioManager.playSound("chat");
                });
            
                self.client.onPopulationChange(function(worldPlayers, totalPlayers) {
                    if(self.nbplayers_callback) {
                        self.nbplayers_callback(worldPlayers, totalPlayers);
                    }
                });
                
                self.client.onDisconnected(function(message) {
                    if(self.player) {
                        self.player.die();
                    }
                    if(self.disconnect_callback) {
                        self.disconnect_callback(message);
                    }
                });

                self.client.onMobDoSpecial(function(id) {
                    let mob = self.getEntityById(id);

                    if (typeof mob.doSpecial === 'function') {
                        mob.doSpecial();
                    }
                });
            
                self.gamestart_callback();
            
                if(self.hasNeverStarted) {
                    self.start();
                    started_callback();
                }
            });
        },

        /**
         * Links two entities in an attacker<-->target relationship.
         * This is just a utility method to wrap a set of instructions.
         *
         * @param {Entity} attacker The attacker entity
         * @param {Entity} target The target entity
         */
        createAttackLink: function(attacker, target) {
            if(attacker.hasTarget()) {
                attacker.removeTarget();
            }
            attacker.engage(target);
            
            if(attacker.id !== this.playerId) {
                target.addAttacker(attacker);
            }
        },

        /**
         * Sends a "hello" message to the server, as a way of initiating the player connection handshake.
         * @see GameClient.sendHello
         */
        sendHello: function() {
            this.client.sendHello(this.player);
        },

        /**
         * Converts the current mouse position on the screen to world grid coordinates.
         * @returns {Object} An object containing x and y properties.
         */
        getMouseGridPosition: function() {
            var mx = this.mouse.x,
                my = this.mouse.y,
                c = this.renderer.camera,
                s = this.renderer.scale,
                ts = this.renderer.tilesize,
                offsetX = mx % (ts * s),
                offsetY = my % (ts * s),
                x = ((mx - offsetX) / (ts * s)) + c.gridX,
                y = ((my - offsetY) / (ts * s)) + c.gridY;
        
                return { x: x, y: y };
        },
    
        /**
         * Moves a character to a given location on the world grid.
         *
         * @param {Number} x The x coordinate of the target location.
         * @param {Number} y The y coordinate of the target location.
         */
        makeCharacterGoTo: function(character, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                character.go(x, y);
            }
        },
    
        /**
         *
         */
        makeCharacterTeleportTo: function(character, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                this.unregisterEntityPosition(character);

                character.setGridPosition(x, y);
                
                this.registerEntityPosition(character);
                this.assignBubbleTo(character);
            } else {
                console.debug("Teleport out of bounds: "+x+", "+y);
            }
        },

        /**
         * Moves the current player to a given target location.
         * @see makeCharacterGoTo
         */
        makePlayerGoTo: function(x, y) {
            this.storage.saveXY(x, y);
            this.makeCharacterGoTo(this.player, x, y);
        },
    
        /**
         * Moves the current player towards a specific item.
         * @see makeCharacterGoTo
         */
        makePlayerGoToItem: function(item) {
            if(item) {
                if (item.type === "weapon" && this.player.getWeaponName().startsWith("NFT_")) {
                    this.makePlayerGoTo(item.gridX, item.gridY);
                } else {
                    this.player.isLootMoving = true;
                    this.makePlayerGoTo(item.gridX, item.gridY);
                    this.client.sendLootMove(item, item.gridX, item.gridY);
                }
            }
        },
    
        /**
         *
         */
        makePlayerTalkTo: function(npc) {
            if(npc) {
                this.player.setTarget(npc);
                this.player.follow(npc);
            }
        },
    
        makePlayerOpenChest: function(chest) {
            if(chest) {
                this.player.setTarget(chest);
                this.player.follow(chest);
            }
        },
    
        /**
         * 
         */
        makePlayerAttack: function(mob) {
            this.player.previousTarget = null;
            this.player.disengage();
            this.createAttackLink(this.player, mob);
            this.client.sendAttack(mob);
        },
    
        /**
         *
         */
        makeNpcTalk: function(npc) {

            now = new Date().getTime();

            if (this.lastNPCTalk !== undefined) {
                if (now - this.lastNPCTalk < 500) {
                    return;
                }
            }
            this.lastNPCTalk = now;

            var msg;
        
            if(npc) {
                msg = npc.talk();
                this.previousClickPosition = {};
                if(msg) {
                    this.createBubble(npc.id, msg);
                    this.assignBubbleTo(npc);
                    this.audioManager.playSound("npc");
                } else {
                    this.destroyBubble(npc.id);
                    this.audioManager.playSound("npc-end");
                }
                this.tryUnlockingAchievement("SMALL_TALK");
                
                if(npc.kind === Types.Entities.RICK) {
                    this.tryUnlockingAchievement("RICKROLLD");
                }
            }
        },

        /**
         * Loops through all the entities currently present in the game.
         * @param {Function} callback The function to call back (must accept one entity argument).
         */
        forEachEntity: function(callback) {
            _.each(this.entities, function(entity) {
                callback(entity);
            });
        },
    
        /**
         * Same as forEachEntity but only for instances of the Mob subclass.
         * @see forEachEntity
         */
        forEachMob: function(callback) {
            _.each(this.entities, function(entity) {
                if(entity instanceof Mob) {
                    callback(entity);
                }
            });
        },
    
        /**
         * Loops through all entities visible by the camera and sorted by depth :
         * Lower 'y' value means higher depth.
         * Note: This is used by the Renderer to know in which order to render entities.
         */
        forEachVisibleEntityByDepth: function(callback) {
            var self = this,
                m = this.map;
        
            this.camera.forEachVisiblePosition(function(x, y) {
                if(!m.isOutOfBounds(x, y)) {
                    if(self.renderingGrid[y][x]) {
                        _.each(self.renderingGrid[y][x], function(entity) {
                            callback(entity);
                        });
                    }
                }
            }, this.renderer.mobile ? 0 : 2);
        },
    
        /**
         * 
         */    
        forEachVisibleTileIndex: function(callback, extra) {
            var m = this.map;
        
            this.camera.forEachVisiblePosition(function(x, y) {
                if(!m.isOutOfBounds(x, y)) {
                    callback(m.GridPositionToTileIndex(x, y) - 1);
                }
            }, extra);
        },
    
        /**
         * 
         */
        forEachVisibleTile: function(callback, extra) {
            var self = this,
                m = this.map;
        
            if(m.isLoaded) {
                this.forEachVisibleTileIndex(function(tileIndex) {
                    if(_.isArray(m.data[tileIndex])) {
                        _.each(m.data[tileIndex], function(id) {
                            callback(id-1, tileIndex);
                        });
                    }
                    else {
                        if(_.isNaN(m.data[tileIndex]-1)) {
                            //throw Error("Tile number for index:"+tileIndex+" is NaN");
                        } else {
                            callback(m.data[tileIndex]-1, tileIndex);
                        }
                    }
                }, extra);
            }
        },
    
        /**
         * 
         */
        forEachAnimatedTile: function(callback) {
            if(this.animatedTiles) {
                _.each(this.animatedTiles, function(tile) {
                    callback(tile);
                });
            }
        },

        forEachHighAnimatedTile: function(callback) {
            if(this.highAnimatedTiles) {
                _.each(this.highAnimatedTiles, function(tile) {
                    callback(tile);
                });
            }
        },
    
        /**
         * Returns the entity located at the given position on the world grid.
         * @returns {Entity} the entity located at (x, y) or null if there is none.
         */
        getEntityAt: function(x, y) {
            if(this.map.isOutOfBounds(x, y) || !this.entityGrid) {
                return null;
            }
            
            var entities = this.entityGrid[y][x],
                entity = null;
            if(_.size(entities) > 0) {
                entity = entities[_.keys(entities)[0]];
            } else {
                entity = this.getItemAt(x, y);
            }
            return entity;
        },

        getMobAt: function(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Mob) && !entity.isFriendly) {
                return entity;
            }
            return null;
        },

        getNpcAt: function(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Npc)) {
                return entity;
            }
            return null;
        },

        getChestAt: function(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Chest)) {
                return entity;
            }
            return null;
        },

        getItemAt: function(x, y) {
            if(this.map.isOutOfBounds(x, y) || !this.itemGrid) {
                return null;
            }
            var items = this.itemGrid[y][x],
                item = null;

            if(_.size(items) > 0) {
                // If there are potions/burgers stacked with equipment items on the same tile, always get expendable items first.
                _.each(items, function(i) {
                    if(Types.isExpendableItem(i.kind)) {
                        item = i;
                    };
                });

                // Else, get the first item of the stack
                if(!item) {
                    item = items[_.keys(items)[0]];
                }
            }
            return item;
        },
    
        /**
         * Returns true if an entity is located at the given position on the world grid.
         * @returns {Boolean} Whether an entity is at (x, y).
         */
        isEntityAt: function(x, y) {
            return !_.isNull(this.getEntityAt(x, y));
        },

        isMobAt: function(x, y) {
            return !_.isNull(this.getMobAt(x, y));
        },

        isItemAt: function(x, y) {
            return !_.isNull(this.getItemAt(x, y));
        },

        isNpcAt: function(x, y) {
            return !_.isNull(this.getNpcAt(x, y));
        },

        isChestAt: function(x, y) {
            return !_.isNull(this.getChestAt(x, y));
        },

        /**
         * Finds a path to a grid position for the specified character.
         * The path will pass through any entity present in the ignore list.
         */
        findPath: function(character, x, y, ignoreList) {
            var self = this,
                grid = this.pathingGrid;
                path = [],
                isPlayer = (character === this.player);
        
            if(this.map.isColliding(x, y)) {
                return path;
            }
        
            if(this.pathfinder && character) {
                if(ignoreList) {
                    _.each(ignoreList, function(entity) {
                        self.pathfinder.ignoreEntity(entity);
                    });
                }
            
                path = this.pathfinder.findPath(grid, character, x, y, false);
            
                if(ignoreList) {
                    this.pathfinder.clearIgnoreList();
                }
            } else {
                console.error("Error while finding the path to "+x+", "+y+" for "+character.id);
            }
            return path;
        },
    
        /**
         * Toggles the visibility of the pathing grid for debugging purposes.
         */
        togglePathingGrid: function() {
            if(this.debugPathing) {
                this.debugPathing = false;
            } else {
                this.debugPathing = true;
            }
        },
    
        /**
         * Toggles the visibility of the FPS counter and other debugging info.
         */
        toggleDebugInfo: function() {
            if(this.renderer && this.renderer.isDebugInfoVisible) {
                this.renderer.isDebugInfoVisible = false;
            } else {
                this.renderer.isDebugInfoVisible = true;
            }
        },
    
        /**
         * 
         */
        movecursor: function() {
            var mouse = this.getMouseGridPosition(),
                x = mouse.x,
                y = mouse.y;

            if(this.player && !this.renderer.mobile && !this.renderer.tablet) {
                this.hoveringCollidingTile = this.map.isColliding(x, y);
                this.hoveringPlateauTile = this.player.isOnPlateau ? !this.map.isPlateau(x, y) : this.map.isPlateau(x, y);
                this.hoveringMob = this.isMobAt(x, y);
                this.hoveringItem = this.isItemAt(x, y);
                this.hoveringNpc = this.isNpcAt(x, y);
                this.hoveringChest = this.isChestAt(x, y);
        
                if(this.hoveringMob || this.hoveringNpc || this.hoveringChest) {
                    var entity = this.getEntityAt(x, y);
            
                    if(!entity.isHighlighted && this.renderer.supportsSilhouettes) {
                        if(this.lastHovered) {
                            this.lastHovered.setHighlight(false);
                        }
                        this.lastHovered = entity;
                        entity.setHighlight(true);
                    }
                }
                else if(this.lastHovered) {
                    this.lastHovered.setHighlight(false);
                    this.lastHovered = null;
                }
            }
        },
    
        /**
         * Processes game logic when the user triggers a click/touch event during the game.
         */
        click: function(pos) {
            this.app.hideChat();
            if (pos === undefined) {
                pos = this.getMouseGridPosition();
            }
            var entity;

            if (pos.keyboard) {
                this.keyboardMovement = true;
            } else {
                now = new Date().getTime();

                if (this.lastClick !== undefined) {
                    if (now - self.lastClick < 500) {
                        return;
                    }
                }
                self.lastClick = now;
                this.keyboardMovement = false;
            }

            if(pos.x === this.previousClickPosition.x
            && pos.y === this.previousClickPosition.y) {
                this.previousClickPosition = {};
                return;
            } else {
                this.previousClickPosition = pos;
            }
	        
    	    if(this.started
    	    && this.player
    	    && !this.isZoning()
    	    && !this.isZoningTile(this.player.nextGridX, this.player.nextGridY)
    	    && !this.player.isDead
    	    && (!this.hoveringCollidingTile || pos.keyboard)
    	    && (!this.hoveringPlateauTile || pos.keyboard)
            && !(this.doorCheck)) {
        	    entity = this.getEntityAt(pos.x, pos.y);

                // an entity is not in the entity grid but is on the pathing grid
                if (entity == null && this.pathingGrid[pos.y][pos.x] >= 1 && this.pathingGridBackup[pos.y][pos.x] === 0) {
                    console.log("Cleaning up entity on pathing grid at " + pos.x + ", " + pos.y, this.pathingGrid[pos.y][pos.x]);
                    this.removeFromPathingGrid(pos.x, pos.y);
                }

        	    if(entity instanceof Mob && !entity.isFriendly) {
        	        this.makePlayerAttack(entity);
                } else if (entity instanceof Player && entity.id !== this.player.id) {
                    var inPvpZone = this.map.isInsidePvpZone(entity.gridX, entity.gridY);
                    if (inPvpZone) {
                        this.makePlayerAttack(entity);
                    } else {
                        this.makePlayerGoTo(pos.x, pos.y);
                    }
                }
        	    else if(entity instanceof Item) {
        	        this.makePlayerGoToItem(entity);
        	    }
        	    else if(entity instanceof Npc) {
        	        if(this.player.isAdjacentNonDiagonal(entity) === false) {
                        this.makePlayerTalkTo(entity);
        	        } else {
                        this.makeNpcTalk(entity);
        	        }
        	    }
        	    else if(entity instanceof Chest) {
        	        this.makePlayerOpenChest(entity);
        	    }
        	    else {
        	        this.makePlayerGoTo(pos.x, pos.y);
        	    }
        	}
        },
        
        isMobOnSameTile: function(mob, x, y) {
            var X = x || mob.gridX,
                Y = y || mob.gridY,
                list = this.entityGrid[Y][X],
                result = false;
            
            _.each(list, function(entity) {
                if(entity instanceof Mob && entity.id !== mob.id) {
                    result = true;
                }
            });
            return result;
        },
        
        getFreeAdjacentNonDiagonalPosition: function(entity) {
            var self = this,
                result = null;
            
            entity.forEachAdjacentNonDiagonalPosition(function(x, y, orientation) {
                if(!result && !self.map.isColliding(x, y) && !self.isMobAt(x, y)) {
                    result = {x: x, y: y, o: orientation};
                }
            });
            return result;
        },
        
        tryMovingToADifferentTile: function(character) {
            var attacker = character,
                target = character.target;
            
            if(attacker && target && target instanceof Player) {
                if(!target.isMoving() && attacker.getDistanceToEntity(target) === 0) {
                    var pos;
                    
                    switch(target.orientation) {
                        case Types.Orientations.UP:
                            pos = {x: target.gridX, y: target.gridY - 1, o: target.orientation}; break;
                        case Types.Orientations.DOWN:
                            pos = {x: target.gridX, y: target.gridY + 1, o: target.orientation}; break;
                        case Types.Orientations.LEFT:
                            pos = {x: target.gridX - 1, y: target.gridY, o: target.orientation}; break;
                        case Types.Orientations.RIGHT:
                            pos = {x: target.gridX + 1, y: target.gridY, o: target.orientation}; break;
                    }
                    
                    if(pos && !this.map.isColliding(pos.x, pos.y) && !this.map.isPlateau(pos.x, pos.y)) {
                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;
                        
                        return true;
                    }
                }
            
                if(!target.isMoving() && attacker.isAdjacentNonDiagonal(target) && this.isMobOnSameTile(attacker)) {
                    var pos = this.getFreeAdjacentNonDiagonalPosition(target);
            
                    // avoid stacking mobs on the same tile next to a player
                    // by making them go to adjacent tiles if they are available
                    if(pos && !target.adjacentTiles[pos.o]) {
                        if(this.player.target && attacker.id === this.player.target.id) {
                            return false; // never unstack the player's target
                        }
                        
                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;
                        
                        return true;
                    }
                }
            }
            return false;
        },
    
        /**
         * 
         */
        onCharacterUpdate: function(character) {
            var time = this.currentTime,
                self = this;
            
            character.lastUpdate = time;
            // If mob has finished moving to a different tile in order to avoid stacking, attack again from the new position.
            if(character.previousTarget && !character.isMoving() && character instanceof Mob) {
                var t = character.previousTarget;
                
                if(this.getEntityById(t.id)) { // does it still exist?
                    character.previousTarget = null;
                    this.createAttackLink(character, t);
                    return;
                } else {
                    this.unregisterEntityPosition(t);
                }
            }
        
            if(character.isAttacking() && !character.previousTarget) {
                var isMoving = this.tryMovingToADifferentTile(character); // Don't let multiple mobs stack on the same tile when attacking a player.
                
                if(character.canAttack(time)) {
                    if(!isMoving) { // don't hit target if moving to a different tile.
                        if(character.hasTarget() && character.getOrientationTo(character.target) !== character.orientation) {
                            character.lookAtTarget();
                        }
                        
                        character.hit();
                        
                        if(character.id === this.playerId) {
                            this.client.sendHit(character.target);
                        }
                        
                        if(character instanceof Player && this.camera.isVisible(character)) {
                            this.audioManager.playSound("hit"+Math.floor(Math.random()*2+1));
                        }

                        if(character.hasTarget() && character.target.id === this.playerId && this.player && !this.player.invincible & !(character instanceof Player)) {
                            this.client.sendHurt(character);
                        }
                    }
                } else {
                    if(character.hasTarget()
                    && character.isDiagonallyAdjacent(character.target)
                    && character.target instanceof Player
                    && !character.target.isMoving()) {
                        character.follow(character.target);
                    }
                }
            }
        },
    
        /**
         * 
         */
        isZoningTile: function(x, y) {
            var c = this.camera;
        
            x = x - c.gridX;
            y = y - c.gridY;
            
            if(x === 0 || y === 0 || x === c.gridW-1 || y === c.gridH-1) {
                return true;
            }
            return false;
        },
    
        /**
         * 
         */
        getZoningOrientation: function(x, y) {
            var orientation = "",
                c = this.camera;

            x = x - c.gridX;
            y = y - c.gridY;
       
            if(x === 0) {
                orientation = Types.Orientations.LEFT;
            }
            else if(y === 0) {
                orientation = Types.Orientations.UP;
            }
            else if(x === c.gridW-1) {
                orientation = Types.Orientations.RIGHT;
            }
            else if(y === c.gridH-1) {
                orientation = Types.Orientations.DOWN;
            }
        
            return orientation;
        },
    
        startZoningFrom: function(x, y) {
            this.zoningOrientation = this.getZoningOrientation(x, y);
                        
            if(this.renderer.mobile || this.renderer.tablet) {
                var z = this.zoningOrientation,
                    c = this.camera,
                    ts = this.renderer.tilesize,
                    x = c.x,
                    y = c.y,
                    xoffset = (c.gridW - 2) * ts,
                    yoffset = (c.gridH - 2) * ts;

                if(z === Types.Orientations.LEFT || z === Types.Orientations.RIGHT) {
                    x = (z === Types.Orientations.LEFT) ? c.x - xoffset : c.x + xoffset;
                } else if(z === Types.Orientations.UP || z === Types.Orientations.DOWN) {
                    y = (z === Types.Orientations.UP) ? c.y - yoffset : c.y + yoffset;
                }
                c.setPosition(x, y);

                this.renderer.clearScreen(this.renderer.context);
                this.endZoning();

                // Force immediate drawing of all visible entities in the new zone
                this.forEachVisibleEntityByDepth(function(entity) {
                    entity.setDirty();
                });
            }
            else {
                
                this.currentZoning = new Transition();
            }

            this.bubbleManager.clean();
            this.client.sendZone();
        },
        
        enqueueZoningFrom: function(x, y) {
            this.zoningQueue.push({x: x, y: y});
            
            if(this.zoningQueue.length === 1) {
                this.startZoningFrom(x, y);
            }
        },
    
        endZoning: function() {
            this.currentZoning = null;
            this.resetZone();
            this.zoningQueue.shift();
            
            if(this.zoningQueue.length > 0) {
                var pos = this.zoningQueue[0];
                this.startZoningFrom(pos.x, pos.y);
            }
            //this.pathingGrid = this.pathingGridBackup;
        },
    
        isZoning: function() {
            return !_.isNull(this.currentZoning);
        },
    
        resetZone: function() {
            this.bubbleManager.clean();
            this.initAnimatedTiles();
            this.renderer.renderStaticCanvases();
        },
    
        resetCamera: function() {
            this.camera.focusEntity(this.player);
            this.resetZone();
        },
    
        say: function(message) {
            this.client.sendChat(message);
        },
    
        createBubble: function(id, message) {
            this.bubbleManager.create(id, message, this.currentTime);
        },
    
        destroyBubble: function(id) {
            this.bubbleManager.destroyBubble(id);
        },
    
        assignBubbleTo: function(character) {
            var bubble = this.bubbleManager.getBubbleById(character.id);
        
            if(bubble) {
                var s = this.renderer.scale,
                    t = 16 * s, // tile size
                    x = ((character.x - this.camera.x) * s),
                    w = parseInt(bubble.element.css('width')) + 24,
                    offset = (w / 2) - (t / 2),
                    offsetY,
                    y;
            
                if(character instanceof Npc) {
                    offsetY = 0;
                } else {
                    if(s === 2) {
                        if(this.renderer.mobile) {
                            offsetY = 0;
                        } else {
                            offsetY = 15;
                        }
                    } else {
                        offsetY = 12;
                    }
                }
            
                y = ((character.y - this.camera.y) * s) - (t * 2) - offsetY;
            
                bubble.element.css('left', x - offset + 'px');
                bubble.element.css('top', y + 'px');
            }
        },
    
        restart: function() {
            console.debug("Beginning restart");
        
            this.entities = {};
            this.initEntityGrid();
            this.initPathingGrid();
            this.initRenderingGrid();

            this.player = new Warrior("player", this.username);
            this.initPlayer();
        
            this.started = true;
            this.client.enable();
            this.sendHello(this.player);
        
            this.storage.incrementRevives();
            
            if(this.renderer.mobile || this.renderer.tablet) {
                this.renderer.clearScreen(this.renderer.context);
            }
        
            console.debug("Finished restart");
        },
    
        onGameStart: function(callback) {
            this.gamestart_callback = callback;
        },
        
        onDisconnect: function(callback) {
            this.disconnect_callback = callback;
        },
    
        onPlayerDeath: function(callback) {
            this.playerdeath_callback = callback;
        },
    
        onPlayerHealthChange: function(callback) {
            this.playerhp_callback = callback;
        },
    
        onPlayerHurt: function(callback) {
            this.playerhurt_callback = callback;
        },
    
        onPlayerEquipmentChange: function(callback) {
            this.equipment_callback = callback;
        },

        onNbPlayersChange: function(callback) {
            this.nbplayers_callback = callback;
        },
    
        onNotification: function(callback) {
            this.notification_callback = callback;
        },
    
        onPlayerInvincible: function(callback) {
            this.invincible_callback = callback
        },
    
        resize: function() {
            var x = this.camera.x,
                y = this.camera.y,
                currentScale = this.renderer.scale,
                newScale = this.renderer.getScaleFactor();
    
                this.renderer.rescale(newScale);
                this.camera = this.renderer.camera;
                this.camera.setPosition(x, y);

                this.renderer.renderStaticCanvases();
                this.app.initEquipmentIcons();
        },
    
        updateBars: function() {
            if(this.player && this.playerhp_callback) {
                this.playerhp_callback(this.player.hitPoints, this.player.maxHitPoints);
            }
        },
    
        getDeadMobPosition: function(mobId) {
            var position;

            if(mobId in this.deathpositions) {
                position = this.deathpositions[mobId];
                delete this.deathpositions[mobId];
            }
        
            return position;
        },
    
        onAchievementUnlock: function(callback) {
            this.unlock_callback = callback;
        },
    
        tryUnlockingAchievement: function(name) {
            var achievement = null;
            if(name in this.achievements) {
                achievement = this.achievements[name];
            
                if(achievement.isCompleted() && this.storage.unlockAchievement(achievement.id)) {
                    if(this.unlock_callback) {
                        this.unlock_callback(achievement.id, achievement.name, achievement.desc);
                        this.audioManager.playSound("achievement");
                    }
                }
            }
        },
    
        showNotification: function(message) {
            if(this.notification_callback) {
                this.notification_callback(message);
            }
        },

        removeObsoleteEntities: function() {
            var nb = _.size(this.obsoleteEntities),
                self = this;
        
            if(nb > 0) {
                _.each(this.obsoleteEntities, function(entity) {
                    if(entity.id != self.player.id) { // never remove yourself
                        self.removeEntity(entity);
                        self.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                    }
                });
                console.debug("Removed "+nb+" entities: "+_.pluck(_.reject(this.obsoleteEntities, function(id) { return id === self.player.id }), 'id'));
                this.obsoleteEntities = null;
            }
        },
    
        /**
         * Fake a mouse move event in order to update the cursor.
         *
         * For instance, to get rid of the sword cursor in case the mouse is still hovering over a dying mob.
         * Also useful when the mouse is hovering a tile where an item is appearing.
         */
        updateCursor: function() {
            this.movecursor();
            this.updateCursorLogic();
        },
    
        /**
         * Change player plateau mode when necessary
         */
        updatePlateauMode: function() {
            if(this.map.isPlateau(this.player.gridX, this.player.gridY)) {
                this.player.isOnPlateau = true;
            } else {
                this.player.isOnPlateau = false;
            }
        },
    
        updatePlayerCheckpoint: function() {
            var checkpoint = this.map.getCurrentCheckpoint(this.player);
        
            if(checkpoint) {
                var lastCheckpoint = this.player.lastCheckpoint;
                if(!lastCheckpoint || (lastCheckpoint && lastCheckpoint.id !== checkpoint.id)) {
                    this.player.lastCheckpoint = checkpoint;
                    this.client.sendCheck(checkpoint.id);
                }
            }
        },
        
        checkUndergroundAchievement: function() {
            var music = this.audioManager.getSurroundingMusic(this.player);

            if(music) {
                if(music.name === 'cave') {
                    this.tryUnlockingAchievement("UNDERGROUND");
                }
            }
        },
        
        forEachEntityAround: function(x, y, r, callback) {
            for(var i = x-r, max_i = x+r; i <= max_i; i += 1) {
                for(var j = y-r, max_j = y+r; j <= max_j; j += 1) {
                    if(!this.map.isOutOfBounds(i, j)) {
                        _.each(this.renderingGrid[j][i], function(entity) {
                            callback(entity);
                        });
                    }
                }
            }
        },
        
        checkOtherDirtyRects: function(r1, source, x, y) {
            var r = this.renderer;
            
            this.forEachEntityAround(x, y, 2, function(e2) {
                if(source && source.id && e2.id === source.id) {
                    return;
                }
                if(!e2.isDirty) {
                    var r2 = r.getEntityBoundingRect(e2);
                    if(r.isIntersecting(r1, r2)) {
                        e2.setDirty();
                    }
                }
            });
            
            if(source && !(source.hasOwnProperty("index"))) {
                let animatedTileUpdate = function(tile) {
                    if(!tile.isDirty) {
                        var r2 = r.getTileBoundingRect(tile);
                        if(r.isIntersecting(r1, r2)) {
                            tile.isDirty = true;
                        }
                    }
                }
                this.forEachAnimatedTile(animatedTileUpdate);
                this.forEachHighAnimatedTile(animatedTileUpdate);
            }
            
            if(!this.drawTarget && this.selectedCellVisible) {
                var targetRect = r.getTargetBoundingRect();
                if(r.isIntersecting(r1, targetRect)) {
                    this.drawTarget = true;
                    this.renderer.targetRect = targetRect;
                }
            }
        },

        renderStatistics: function () {
            self = this;
            axios.get("/session/" + this.sessionId + "/statistics").then(function(response){
                if (response.data !== null && response.data !== undefined) {

                    level = response.data.avatarLevelInfo.currentLevel;
                    percentage = response.data.avatarLevelInfo.percentage;

                    if (!level || Number.isNaN(level) || !percentage || Number.isNaN(percentage)) {
                        console.error("Invalid level or percentage");
                        return;
                    }

                    if (self.player.level == null) {
                        self.player.level = level;
                    }
                    
                    
                    var levelInfoHTML = "Avatar Level: " + level + " ";
                    levelInfoHTML+=percentage + "%";

                    if (response.data.weaponInfo !== null && response.data.weaponInfo !== undefined) {
                        weaponPercentage = response.data.weaponInfo.weaponLevelInfo.percentage;
                        weaponLevel = response.data.weaponInfo.weaponLevelInfo.currentLevel;
                        levelInfoHTML+=" - Weapon Level: " + weaponLevel + " ";
                        levelInfoHTML+=weaponPercentage + "%";
                        levelInfoHTML+=", Trait: " + response.data.weaponInfo.trait;
                    }
                    $("#levelInfo").html(levelInfoHTML);

                    if (self.player.level !== level) {
                        console.log("LEVEL UP");
                    }
                }
            }).catch(function (error) {
                console.error("Error while getting updated level", error);
            });            
        },

        getServerInfo: function () {
            self = this;

            now = new Date().getTime();

            if (self.lastHPCall !== undefined) {
                if (now - self.lastHPCall < 500) {
                    return;
                }
            }
            self.lastHPCall = now;

            axios.get("/session/" + self.sessionId + "/polling").then(function (response) {
                if (response.data !== null && response.data !== undefined) {
                    if (response.data.playerInfo !== undefined) {
                        if (response.data.playerInfo.powerUpActive === false && self.player.spriteName !== response.data.playerInfo.armor) {
                            self.player.switchArmor(self.sprites[response.data.playerInfo.armor]);
                        }
                    }

                    Object.keys(response.data.characterInfo).forEach(function (id) {
                        toUpdateEntity = response.data.characterInfo[id];
                        if (self.entities[id] !== undefined) {
                            self.entities[id].hitPoints = toUpdateEntity.hitPoints;
                            self.entities[id].maxHitPoints = toUpdateEntity.maxHitPoints;
                            if (toUpdateEntity.moveSpeed !== undefined && toUpdateEntity.attackRate !== undefined) {
                                self.entities[id].moveSpeed = toUpdateEntity.moveSpeed;
                                self.entities[id].setAttackRate(toUpdateEntity.attackRate);
                            }
                        } else {
                            console.debug("Unknown entity " + id);
                        }
                    });
                }
            }).catch(function (error) {
                console.error("Error while getting entity hp info", error);
            });
        }
    });
    
    return Game;
});
