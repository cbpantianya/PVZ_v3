import { Zombie } from '../VideoCuts/Zombie.js'

class GameAll {
    constructor() {
        this.__init__()
    }

    __init__() {
        // 清除三容器
        var bgContainer = window.stage.getChildByName("bgContainer")
        bgContainer.removeAllChildren()
        var gameContainer = window.stage.getChildByName("gameContainer")
        gameContainer.removeAllChildren()
        var uiContainer = window.stage.getChildByName("uiContainer")
        uiContainer.removeAllChildren()

        // 绘制背景
        var bg = new createjs.Bitmap(window.loader.getResult("BG5S"))
        bgContainer.addChild(bg)

        // 生成僵尸
        for (var i = 0; i < 5; i++) {
            new Zombie(100 + i * 100, 100)
        }


    }
}

export { GameAll }