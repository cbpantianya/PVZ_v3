// 掉落的太阳
class Sun {
    constructor(x, y) {
        this.__init__(x, y)
    }

    __init__(x, y) {
        // 太阳精灵表
        var sunSheet = new createjs.SpriteSheet({
            "images": [window.loader.getResult("Sun")],
            "frames": {
                "width": 78,
                "height": 78,
                "count": 21
            },
            "animations": {
                "start": [0, 20, "start", 1]
            },
        });

        var sun = new createjs.Sprite(sunSheet, "start");
        sun.x = x
        sun.y = y
        sun.name = "sun"
        window.stage.getChildByName("gameContainer").addChild(sun)
        // 点击事件
        sun.addEventListener("click", this.click.bind(this, sun))

        // 太阳下落
        createjs.Tween.get(sun).to({ y: 400 }, 3000).call(this.fall.bind(this, sun))
    }

    click(sun) {
        // 点击太阳
        window.gameData.sun += 25
        // 修改文字显示
        window.stage.getChildByName("uiContainer").getChildByName("sunNumber").text = window.gameData.sun
        window.stage.getChildByName("gameContainer").removeChild(sun)
    }

    fall(sun) {
        // 太阳掉落
        createjs.Tween.get(sun).to({ y: 800 }, 6000).call(this.destroy.bind(this, sun))
    }

    destroy(sun) {
        // 移除太阳
        window.stage.getChildByName("gameContainer").removeChild(sun)
    }
}

class SunBoard {
    constructor(x, y, sunNumber) {
        this.__init__(x, y, sunNumber)
    }

    __init__(x, y, sunNumber) {
        // 生成太阳板
        var sunBoard = new createjs.Bitmap(window.loader.getResult("SunBoard"))
        sunBoard.x = 0;
        sunBoard.y = 0;
        window.stage.getChildByName("uiContainer").addChild(sunBoard)

        // 添加文字
        var text = new createjs.Text("100", "20px Arial", "#000000")
        text.x = 60
        text.y = 10
        text.name = "sunNumber"
        window.stage.getChildByName("uiContainer").addChild(text)

    }
}

export { Sun, SunBoard }
