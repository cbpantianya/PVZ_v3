class Zombie {
    constructor(x, y) {
        this.blood = 10;
        this.__init__(x, y)
    }

    __init__(x, y) {
        // 生成僵尸
        var zombieSheet = new createjs.SpriteSheet({
            "images": [window.loader.getResult("ZombieWalk"), window.loader.getResult("ZombieDie")],
            "frames": { "width": 166, "height": 144, "count": 56, "regX": 0, "regY": 0, "spacing": 0, "margin": 0 },
            "animations": {
                "walk": [0, 20, "walk", 0.5],
                "die": [42, 50, "die", 0.5]
            }
        });
        this.zombie = new createjs.Sprite(zombieSheet, "walk");
        this.zombie.x = x
        this.zombie.y = y
        window.stage.getChildByName("gameContainer").addChild(this.zombie)
    }
}

export { Zombie }