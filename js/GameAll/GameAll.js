import { Zombie } from "../VideoCuts/Zombie.js";
import { PeaShooterCard } from "../VideoCuts/PeaShooter.js";
import { GameData } from "../Storage/Storage.js";
import { SunBoard, Sun } from "../VideoCuts/Sun.js";
import { SunFlowerCard } from "../VideoCuts/SunFlower.js";
import { CherryBombCard } from "../VideoCuts/CherryBomb.js";
import { WallNutCard } from "../VideoCuts/WallNut.js";
import { Car } from "../VideoCuts/Car.js";

class GameAll {
  constructor() {
    this.zombieList = []; // 僵尸驻场列表

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
    // 绘制背景
    var bg = new createjs.Bitmap(window.loader.getResult("BG5S"));
    bg.x = -120;
    bgContainer.addChild(bg);

    // 生成僵尸
    for (var i = 0; i < 10; i++) {
      this.zombieList.push(
        new Zombie(700 + Math.random() * 100 - 50, 100 + i * 50)
      );
    }

    // 生成地皮
    window.gameData = new GameData();
    window.gameData.generateLand(5);

    // 播放完动画之后，给僵尸分配道次
    var count = 0;
    this.zombieList.forEach((zombie) => {
      zombie.colunm = count % 5;
      // 调整位置
      zombie.zombie.x = 900 + zombie.colunm * -100 + Math.random() * 80;
      zombie.zombie.y = zombie.colunm * 100 + 20;
      console.log(zombie.colunm);
      count++;
    });

    window.zombieList = this.zombieList;

    // 添加Card
    var peaShooterCard = new PeaShooterCard(130, 0);
    var sunBoard = new SunBoard(0, 0);
    var sunFlowerCard = new SunFlowerCard(250, 0);
    var cherryBombCard = new CherryBombCard(370, 0);
    var wallNutCard = new WallNutCard(490, 0);
    new Car(100, 120);
    new Car(100, 220);
    new Car(100, 320);
    new Car(100, 420);
    new Car(100, 520);

    // 等待5秒后，僵尸开始行动
    setTimeout(() => {
      // 开启tick
      createjs.Ticker.addEventListener("tick", this.tick.bind(this));
    }, 1000);

    // 绘制地皮
    window.gameData.land.forEach((land) => {
      // 添加矩形
      land.forEach((rect) => {
        // 新建矩形
        var shape = new createjs.Shape();
        shape.graphics
          .beginStroke("green")
          .drawRect(rect.x, rect.y, rect.width, rect.height);
        gameContainer.addChild(shape);
      });
    });
  }

  // 游戏开始
  tick() {
    // 遍历地皮
    window.gameData.land.forEach((land) => {
      land.forEach((rect) => {
        // 是否具有植物
        if (rect.plant) {
          // 判断该行是否有僵尸
          var zombie = this.zombieList.find((zombie) => {
            return zombie.colunm == rect.colunm;
          });
          if (zombie) {
            // 判断僵尸是否在植物的攻击范围内
            if (
              zombie.zombie.x - rect.x < rect.plant.attackRange &&
              zombie.zombie.x - rect.x > -50
            ) {
              // 攻击
              rect.plant.attack(zombie);
            }
          }
        }
      });
    });

    // 生成太阳
    if (Math.random() < 0.01) {
      window.gameData.sunOnland++;
      new Sun(Math.random() * 600, 0);
    }
  }
}

export { GameAll };
