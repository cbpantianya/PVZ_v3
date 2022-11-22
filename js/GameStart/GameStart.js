import {GameChoose} from "../GameChoose/GameChoose.js"
class GameStart {
    constructor() {
        this.__init__()
    }

    __init__() {
        // 清空背景
        var bgContainer = window.stage.getChildByName("bgContainer")
        bgContainer.removeAllChildren()

        // 清空游戏内容
        var gameContainer = window.stage.getChildByName("gameContainer")
        gameContainer.removeAllChildren()

        // 清空游戏UI
        var uiContainer = window.stage.getChildByName("uiContainer")
        uiContainer.removeAllChildren()

        // 添加背景
        var bg = new createjs.Bitmap(window.loader.getResult("StartGameBG"))
        bg.x = 50
        bgContainer.addChild(bg)

        // 开始游戏文字
        var startGameText = new createjs.Text("开始游戏", "bold 18px Arial", "#ffffff")
        startGameText.x = 450
        startGameText.y = 565
        startGameText.textAlign = "center"
        startGameText.textBaseline = "middle"
        startGameText.cursor = "pointer"
        startGameText.addEventListener("click", this.__startGame__)
        startGameText.hitArea = new createjs.Shape() // 事件区域
        startGameText.hitArea.graphics.beginFill("#000").drawRect(-200, -50, 400, 100)
        uiContainer.addChild(startGameText)
        // 悬浮事件
        startGameText.addEventListener("mouseover", function (e) {
            e.target.color = "#ff0000"
        })
        // 离开事件
        startGameText.addEventListener("mouseout", function (e) {
            e.target.color = "#ffffff"
        })

    }

    __startGame__() {
        // 跳转场景
        new GameChoose()

    }
}

export { GameStart }