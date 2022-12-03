class Zombie {
  constructor(x, y) {
    this.blood = 8;
    this.colunm = null;
    this.isMove = true;
    this.__init__(x, y);
    this.moveS = 0.4;
  }

  __init__(x, y) {
    // 生成僵尸
    var zombieSheet = new createjs.SpriteSheet({
      images: [
        window.loader.getResult("ZombieWalk"),
        window.loader.getResult("ZombieDie"),
        window.loader.getResult("ZombieEat"),
        window.loader.getResult("ZombieBoomDie"),
      ],
      frames: {
        width: 166,
        height: 144,
        count: 200,
        regX: 0,
        regY: 0,
        spacing: 0,
        margin: 0,
      },
      animations: {
        walk: [0, 20, "walk", 0.5],
        die: [42, 50, "die", 0.5],
        eat: [70, 80, "eat", 0.5],
        boom: [102, 116, , 0.2],
      },
    });
    this.zombie = new createjs.Sprite(zombieSheet, "walk");
    this.zombie.x = x;
    this.zombie.y = y;
    window.stage.getChildByName("gameContainer").addChild(this.zombie);
    // 监听僵尸的移动
    this.zombie.addEventListener("tick", this.tick.bind(this));
  }

  move() {
    this.zombie.x -= this.moveS;
  }

  tick() {
    if (this.isMove) {
      this.move();
    }

    // 当僵尸移动到20像素的时候，游戏失败
    if (this.zombie.x < -20) {
      // 显示：僵尸吃掉了你的脑子
      if (
        !window.stage.getChildByName("uiContainer").getChildByName("ZombieWon")
      ) {
        var ZombieWon = new createjs.Bitmap(
          window.loader.getResult("ZombieWon")
        );
        ZombieWon.x = 0;
        ZombieWon.y = 0;
        ZombieWon.name = "ZombieWon";
        window.stage.getChildByName("uiContainer").addChild(ZombieWon);
        // 更新舞台
        window.stage.update();
        // 停止游戏
        createjs.Ticker.paused = true;
        console.log("游戏失败");
      }
    }

    // 判断与植物的碰撞
    for (let i = 0; i < window.gameData.land.length; i++) {
      for (let j = 0; j < window.gameData.land[i].length; j++) {
        if (window.gameData.land[i][j].plant != null) {
          if (
            Math.abs(
              this.zombie.x -
                window.gameData.land[i][j].plant.peaShooter.x +
                100
            ) < 20 &&
            Math.abs(
              this.zombie.y -
                window.gameData.land[i][j].plant.peaShooter.y +
                100
            ) <= 20
          ) {
            // 切换动画
            if (this.isMove) {
              this.zombie.gotoAndPlay("eat");
            }
            this.isMove = false;
            this.colunm = i;
            window.gameData.land[i][j].plant.bloodJ();
          }
        }
      }
    }
    ``;
  }

  attacked() {
    this.zombie.alpha = 0.5;
    setTimeout(() => {
      this.zombie.alpha = 1;
    }, 100);
  }

  boom() {
    this.zombie.gotoAndPlay("boom");
    this.isMove = false;
  }
}

export { Zombie };
