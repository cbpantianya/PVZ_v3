// 最后的防线
class Car {
  constructor(x, y) {
    this.__init__(x, y);
  }

  __init__(x, y) {
    var car = new createjs.Bitmap(window.loader.getResult("LawnMower"));
    car.x = x;
    car.y = y;
    car.name = "LawnMower";
    car.regX = 35;
    car.regY = 28;
    window.stage.getChildByName("plantContainer").addChild(car);
    this.car = car;
    this.car.addEventListener("tick", this.tick.bind(this));
  }

  tick() {
    // 监测附近僵尸，如果存在，卡车压死僵尸
    for (var i = 0; i < window.zombieList.length; i++) {
      console.log(window.zombieList[i].zombie.x);
      if (
        this.car.x > window.zombieList[i].zombie.x + 70 &&
        this.car.x < window.zombieList[i].zombie.x + 166 &&
        this.car.y >= window.zombieList[i].zombie.y + 75 &&
        this.car.y <= window.zombieList[i].zombie.y + 100 &&
        window.zombieList[i].blood != 0
      ) {
        // 向右开车
        createjs.Tween.get(this.car).to({ x: 2000 }, 1000)
        // 僵尸死亡
        window.zombieList[i].blood = 0;
        window.zombieList[i].moveS = -3
        window.zombieList[i].zombie.gotoAndPlay("die");
        window.zombieList[i].zombie.addEventListener(
          "animationend",
          this.animationend.bind(this, window.zombieList[i])
        );
      }
    }
  }

  animationend(zombie) {
    window.stage.getChildByName("gameContainer").removeChild(zombie.zombie);
    window.zombieList.splice(window.zombieList.indexOf(zombie), 1);
  }
}

export { Car };
