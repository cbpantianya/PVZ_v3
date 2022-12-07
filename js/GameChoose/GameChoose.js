import { Game001 } from "../Game001/Game001.js";

class GameChoose {
  constructor() {
    this.__init__();
  }

  __init__() {
    document.body.removeChild(document.getElementById("co-list"));

    var div = document.createElement("div");
    var subdiv = document.createElement("div");
    subdiv.innerHTML = "开始冒险";
    div.appendChild(subdiv);
    div.id = "co-list";
    document.body.appendChild(div);
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
    var black = new createjs.Shape();
      black.graphics.beginFill("#000").drawRect(0, 0, 950, 750);
      black.name = "black";
      black.alpha = 0;
      stage.addChild(black);
      // 文字
      var text = new createjs.Text(
        "第一关",
        "bold 50px Arial",
        "#fff"
      );
      text.x = 300;
      text.y = 300;
      text.name = "text";
      text.alpha = 0;
      stage.addChild(text);
      createjs.Tween.get(black)
        .wait(3000)
        .to({ alpha: 1 }, 1000)
        .wait(3000)
        .call(function () {
          new Game001();
        })
        createjs.Tween.get(text)
        .wait(3000)
        .to({ alpha: 1 }, 1000)
        .wait(3000)

    
  }
}

export { GameChoose };
