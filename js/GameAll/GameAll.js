import { Zombie } from "../VideoCuts/Zombie.js";
import { PeaShooterCard } from "../VideoCuts/PeaShooter.js";
import { GameData } from "../Storage/Storage.js";
import { SunBoard, Sun } from "../VideoCuts/Sun.js";
import { SunFlowerCard } from "../VideoCuts/SunFlower.js";
import { CherryBombCard } from "../VideoCuts/CherryBomb.js";
import { WallNutCard } from "../VideoCuts/WallNut.js";
import { Car } from "../VideoCuts/Car.js";
import { ShovelCard } from "../VideoCuts/Shovel.js";
import { TwinSunflowerCard } from "../VideoCuts/TwinSunflower.js";
import { GatlingPeaCard } from "../VideoCuts/GatlingPea.js";
import { RepeaterCard } from "../VideoCuts/Repeater.js";

class GameAll {
  constructor() {
    this.zombieList = []; // 僵尸驻场列表

    this.__init__();
  }

  __init__() {

    document.body.removeChild(document.getElementById("co-list"));

    var div = document.createElement("div");
    var subdiv = document.createElement("div");
    var list = [
      "在第m行第n列种植****",
      "1<=m<=5且1<=n<=9",
      "****为植物名称",
      "植物名称：豌豆射手/向日葵/樱桃炸弹",
      "坚果墙/双向日葵/机枪射手/双发射手",
      "______________________________",
      "移除第m行第n列的植物",
    ]
    list.forEach((item) => {
      subdiv.innerHTML += `<div>${item}</div>`;
    })
    div.appendChild(subdiv);
    div.id = "co-list";
    document.body.appendChild(div);

    window.gameStep = 2;
    window.stage.removeChild(window.stage.getChildByName("black"));
    window.stage.removeChild(window.stage.getChildByName("text"));
    // 清除三容器
    var bgContainer = window.stage.getChildByName("bgContainer");
    bgContainer.removeAllChildren();

    var uiContainer = window.stage.getChildByName("uiContainer");
    uiContainer.removeAllChildren();

    var gameContainer = window.stage.getChildByName("gameContainer");
    gameContainer.removeAllChildren();

    var plantContainer = window.stage.getChildByName("plantContainer");
    plantContainer.removeAllChildren();
    // 绘制背景
    var bg = new createjs.Bitmap(window.loader.getResult("BG5S"));
    bg.x = -120;
    bgContainer.addChild(bg);

    window.zombieList = null;
    window.gameData = null;

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
      count++;
    });

    window.zombieList = this.zombieList;

    // 添加Card
    var peaShooterCard = new PeaShooterCard(130, 0);
    var sunBoard = new SunBoard(0, 0);
    var sunFlowerCard = new SunFlowerCard(230, 0);
    var cherryBombCard = new CherryBombCard(330, 0);
    var wallNutCard = new WallNutCard(430, 0);
    var twinSunflowerCard = new TwinSunflowerCard(530, 0);
    var gatlingPeaCard = new GatlingPeaCard(630, 0);
    var repeaterCard = new RepeaterCard(730, 0);
    window.gameData.cardList.push(peaShooterCard);
    window.gameData.cardList.push(sunFlowerCard);
    window.gameData.cardList.push(cherryBombCard);
    window.gameData.cardList.push(wallNutCard);
    window.gameData.cardList.push(twinSunflowerCard);
    window.gameData.cardList.push(gatlingPeaCard);
    window.gameData.cardList.push(repeaterCard);
    
    new Car(100, 120);
    new Car(100, 220);
    new Car(100, 320);
    new Car(100, 420);
    new Car(100, 520);
    // 添加铲子的底图
    var shovelBG = new createjs.Bitmap(window.loader.getResult("ShovelBack"));
    shovelBG.x = 0;
    shovelBG.y = 35;
    // 缩放
    shovelBG.scaleX = 1.8;
    shovelBG.scaleY = 1.8;
    uiContainer.addChild(shovelBG);

    var shovel = new ShovelCard();

    // 等待5秒后，僵尸开始行动
    setTimeout(() => {
      // 开启tick
      createjs.Ticker.addEventListener("tick", this.tick.bind(this));
    }, 1000);

    // // 绘制地皮
    // window.gameData.land.forEach((land) => {
    //   // 添加矩形
    //   land.forEach((rect) => {
    //     // 新建矩形
    //     var shape = new createjs.Shape();
    //     shape.graphics
    //       .beginStroke("green")
    //       .drawRect(rect.x, rect.y, rect.width, rect.height);
    //     gameContainer.addChild(shape);
    //   });
    // });
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
    if (Math.random() < 0.0001) {
      window.gameData.sunOnland++;
      new Sun(Math.random() * 600, 0);
    }
  }
}

export { GameAll };
