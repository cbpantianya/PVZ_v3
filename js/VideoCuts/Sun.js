// 掉落的太阳
class Sun{
    constructor(x, y) {
        this.__init__(x, y)
    }

    __init__(x, y) {
    }
}

class SunBoard{
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
