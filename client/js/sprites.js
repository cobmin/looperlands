
define(['text!../sprites/agent.json',
        'text!../sprites/arrow.json',
        'text!../sprites/axe.json',
        'text!../sprites/bat.json',
        'text!../sprites/beachnpc.json',
        'text!../sprites/bluesword.json',
        'text!../sprites/boss.json',
        'text!../sprites/chest.json',
        'text!../sprites/clotharmor.json',
        'text!../sprites/coder.json',
        'text!../sprites/crab.json',
        'text!../sprites/death.json',
        'text!../sprites/deathknight.json',
        'text!../sprites/desertnpc.json',
        'text!../sprites/eye.json',
        'text!../sprites/firefox.json',
        'text!../sprites/forestnpc.json',
        'text!../sprites/goblin.json',
        'text!../sprites/goldenarmor.json',
        'text!../sprites/goldensword.json',
        'text!../sprites/guard.json',
        'text!../sprites/hand.json',
        'text!../sprites/impact.json',
        'text!../sprites/item-axe.json',
        'text!../sprites/item-bluesword.json',
        'text!../sprites/item-burger.json',
        'text!../sprites/item-cake.json',
        'text!../sprites/item-firepotion.json',
        'text!../sprites/item-flask.json',
        'text!../sprites/item-goldenarmor.json',
        'text!../sprites/item-goldensword.json',
        'text!../sprites/item-leatherarmor.json',
        'text!../sprites/item-mailarmor.json',
        'text!../sprites/item-morningstar.json',
        'text!../sprites/item-platearmor.json',
        'text!../sprites/item-redarmor.json',
        'text!../sprites/item-redsword.json',
        'text!../sprites/item-sword1.json',
        'text!../sprites/item-sword2.json',
        'text!../sprites/king.json',
        'text!../sprites/lavanpc.json',
        'text!../sprites/leatherarmor.json',
        'text!../sprites/loot.json',
        'text!../sprites/mailarmor.json',
        'text!../sprites/morningstar.json',
        'text!../sprites/nyan.json',
        'text!../sprites/octocat.json',
        'text!../sprites/ogre.json',
        'text!../sprites/platearmor.json',
        'text!../sprites/priest.json',
        'text!../sprites/rat.json',
        'text!../sprites/redarmor.json',
        'text!../sprites/redsword.json',
        'text!../sprites/rick.json',
        'text!../sprites/scientist.json',
        'text!../sprites/shadow16.json',
        'text!../sprites/skeleton.json',
        'text!../sprites/skeleton2.json',
        'text!../sprites/snake.json',
        'text!../sprites/sorcerer.json',
        'text!../sprites/sparks.json',
        'text!../sprites/spectre.json',
        'text!../sprites/sword.json',
        'text!../sprites/sword1.json',
        'text!../sprites/sword2.json',
        'text!../sprites/talk.json',
        'text!../sprites/target.json',
        'text!../sprites/villagegirl.json',
        'text!../sprites/villager.json',
        'text!../sprites/wizard.json',
        'text!../sprites/NFT_c762bf80c40453b66f5eb91a99a5a84731c3cc83e1bcadaa9c62e2e59e19e4f6.json',
        'text!../sprites/NFT_38278eacc7d1c86fdbc85d798dca146fbca59a2e5e567dc15898ce2edac21f5f.json',
        'text!../sprites/NFT_d2fb1ad9308803ea4df2ba6b1fe0930ad4d6443b3ac6468eaedbc9e2c214e57a.json',
        'text!../sprites/NFT_b03847a6a7c25e8f52016c0ffca8e7d608593f004c17f3519506b4d0a42d61bf.json',
        'text!../sprites/NFT_3c1fa300af2deef916ade14eb6ca68dd14913e4adc4a4d174ea98f1f878ef733.json',
        'text!../sprites/NFT_cfd9a7ae82698da0da065befb2b39f3bfe3eca509febdb9da865fafd4d98e543.json',
        'text!../sprites/NFT_b131df57290a3c656d6cf35b10e4d342e147345ca01c9cf34ad13205d0e43e50.json',
        'text!../sprites/NFT_9f051ae4b657a07bc82d8d1fac5a5263ca0cb33e3be717c29814d06fa4860487.json',
        'text!../sprites/NFT_01346618000000000000000002386f26fc10000000000000000000000000037b.json',
        // @nextSpriteImport@
    ], function() {
    
    var sprites = {};
    
    _.each(arguments, function(spriteJson) {
        var sprite = JSON.parse(spriteJson);
        
        sprites[sprite.id] = sprite;
    });
    
    return sprites;
});
