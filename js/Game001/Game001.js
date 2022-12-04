class Game001 {
  constructor() {
    this.__init__();
  }
  __init__() {
    // 清除三容器
    var bgContainer = window.stage.getChildByName("bgContainer");
    bgContainer.removeAllChildren();

    var uiContainer = window.stage.getChildByName("uiContainer");
    uiContainer.removeAllChildren();

    var gameContainer = window.stage.getChildByName("gameContainer");
    gameContainer.removeAllChildren();
  }
}
