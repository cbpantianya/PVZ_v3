class PB1 {
  constructor(x, y) {
    this.__init__(x, y);
  }
  __init__(x, y) {
    var PB1 = new createjs.Bitmap(window.loader.getResult("PB1"));
    PB1.x = x;
    PB1.y = y;
    PB1.regX = 48;
    PB1.regY = 17;
    window.stage.getChildByName("gameContainer").addChild(PB1);
    this.PB1 = PB1;
    // 监听事件
    PB1.addEventListener("tick", this.tick.bind(this));
  }
  tick(e) {
    this.PB1.x += 3;
    // 判断与僵尸的碰撞
    for (var i = 0; i < window.zombieList.length; i++) {
      if (
        this.PB1.x > window.zombieList[i].zombie.x + 70 &&
        this.PB1.x < window.zombieList[i].zombie.x + 166 &&
        this.PB1.y > window.zombieList[i].zombie.y + 80 &&
        this.PB1.y < window.zombieList[i].zombie.y + 100
      ) {
        window.zombieList[i].blood -= 1;
        // 透明1秒钟
        window.zombieList[i].attacked();
        if (window.zombieList[i].blood == 0) {
          window.zombieList[i].zombie.gotoAndPlay("die");
          window.zombieList[i].zombie.addEventListener(
            "animationend",
            this.animationend.bind(this, window.zombieList[i])
          );
        }
        window.stage.getChildByName("gameContainer").removeChild(this.PB1);
      }
    }
  }
  animationend(zombie) {
    window.stage.getChildByName("gameContainer").removeChild(zombie.zombie);
    window.zombieList.splice(window.zombieList.indexOf(zombie), 1);
  }
}

export { PB1 };
