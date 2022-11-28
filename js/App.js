import { GameData } from "./Storage/Storage.js"
import { GameStart } from "./GameStart/GameStart.js"

function loadAssets() {
    var manifest = [
        { src: "../assets/imgs/StartGameBG.png", id: "StartGameBG" },
        { src: "../assets/imgs/ChooseGameBG.png", id: "ChooseGameBG" },
        { src: "../assets/imgs/SelectorScreenStartAdventur.png", id: "SelectorScreenStartAdventur" },
        { src: "../assets/imgs/BackGroundS/BG5S.jpg", id: "BG5S" },
        { src: "../assets/imgs/Zombies/Zombie/ZombieWalk1.png", id: "ZombieWalk" },
        { src: "../assets/imgs/Zombies/Zombie/ZombieDie.png", id: "ZombieDie" },
        { src: "../assets/imgs/Cards/PeaShooter.png", id: "PeaShooterCard" },
        { src: "../assets/imgs/Cards/PeaShooterG.png", id: "PeaShooterCardG" },
        { src: "../assets/imgs/Plants/PeaShooter/PeaShooter.png", id: "PeaShooter" },
        { src: "../assets/imgs/Plants/PB1.gif", id: "PB1" },
        { src: "../assets/imgs/Zombies/Zombie/ZombieEat.png", id: "ZombieEat" },
        { src: "../assets/imgs/SunBack.png", id: "SunBoard" },
    ]
    var loader = new createjs.LoadQueue()
    loader.loadManifest(manifest)
    loader.on("complete", handleComplete)
    window.loader = loader
}

function main() {

    var canvas = document.getElementById("canvas")
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.interval = 1000 / 31;


    // 获取容器并初始化舞台
    window.stage = new createjs.Stage(canvas)
    stage.enableMouseOver(50)



    // 新建容器，用于处理背景图片
    var bgContainer = new createjs.Container()
    window.stage.addChild(bgContainer)
    bgContainer.name = "bgContainer"



    // 新建容器，用于处理游戏UI
    var uiContainer = new createjs.Container()
    window.stage.addChild(uiContainer)
    uiContainer.name = "uiContainer"

    // 新建容器，用于处理游戏内容
    var gameContainer = new createjs.Container()
    stage.addChild(gameContainer)
    gameContainer.name = "gameContainer"

    // 添加舞台刷新
    createjs.Ticker.on("tick", window.stage)
    new GameStart()

    return
}

function handleComplete() {
    main()
}

// 获取资源
loadAssets()