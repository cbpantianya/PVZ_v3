import { GameAll } from "../GameAll/GameAll.js";

class GameChoose {
  constructor() {
    this.__init__();
  }

  __init__() {
    // 清空三容器
    var bgContainer = window.stage.getChildByName("bgContainer");
    bgContainer.removeAllChildren();
    var gameContainer = window.stage.getChildByName("gameContainer");
    gameContainer.removeAllChildren();
    var uiContainer = window.stage.getChildByName("uiContainer");
    uiContainer.removeAllChildren();

    // 添加新背景
    var bg = new createjs.Bitmap(window.loader.getResult("ChooseGameBG"));
    bgContainer.addChild(bg);

    // 添加‘开始冒险’精灵图
    var startAdventur = new createjs.SpriteSheet({
      images: [window.loader.getResult("SelectorScreenStartAdventur")],
      frames: { width: 331, height: 146, count: 2 },
      animations: {
        normal: [0],
        hover: [1],
        blink: [0, 1, "blink", 0.5],
      },
    });
    var startAdventurSprite = new createjs.Sprite(startAdventur, "normal");
    startAdventurSprite.x = 470;
    startAdventurSprite.y = 80;
    startAdventurSprite.cursor = "pointer";
    startAdventurSprite.addEventListener("click", this.__startAdventur__);
    startAdventurSprite.addEventListener("mouseover", function (e) {
      e.target.gotoAndStop("hover");
    });
    startAdventurSprite.addEventListener("mouseout", function (e) {
      e.target.gotoAndStop("normal");
    });
    uiContainer.addChild(startAdventurSprite);
  }

  __startAdventur__(e) {
    // 闪烁
    e.target.gotoAndPlay("blink");
    // 移除所有事件
    e.target.removeAllEventListeners();
    // 跳转场景
    new GameAll();
  }
}

export { GameChoose };
