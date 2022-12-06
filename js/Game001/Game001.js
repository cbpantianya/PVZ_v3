import { Zombie } from "../VideoCuts/Zombie.js";
import { PeaShooterCard } from "../VideoCuts/PeaShooter.js";
import { GameData } from "../Storage/Storage.js";
import { SunBoard, Sun } from "../VideoCuts/Sun.js";
import { Car } from "../VideoCuts/Car.js";
import { GameAll } from "../GameAll/GameAll.js";
import { ShovelCard } from "../VideoCuts/Shovel.js";


class Game001 {
  constructor() {
    this.zombieList = []; // 僵尸驻场列表
    this.__init__();
  }

  __init__() {


    document.body.removeChild(document.getElementById("co-list"));

    var div = document.createElement("div");
    var subdiv = document.createElement("div");
    subdiv.innerHTML = "<div>在第3行第n列种植豌豆射手</div><div>例如:在第3行第4列种植豌豆射手</div>";
    div.appendChild(subdiv);
    div.id = "co-list";
    document.body.appendChild(div);



    window.gameStep = 1;
    // 清除三容器
    var bgContainer = window.stage.getChildByName("bgContainer");
    bgContainer.removeAllChildren();

    var uiContainer = window.stage.getChildByName("uiContainer");
    uiContainer.removeAllChildren();

    var gameContainer = window.stage.getChildByName("gameContainer");
    gameContainer.removeAllChildren();
    // 绘制背景
    var bg = new createjs.Bitmap(window.loader.getResult("BG0S"));
    bg.name = "bg";
    bg.x = 0;
    bgContainer.addChild(bg);

    // 生成地皮
    window.gameData = new GameData();
    window.gameData.generateLand(1);

    // 弄3只假的僵尸
    var fakeZombies = [];
    for (let i = 0; i < 3; i++) {
      fakeZombies.push(new Zombie(1200, 100 + i * 100));
    }

    // 给他们加上动画
    fakeZombies.forEach((zombie) => {
      createjs.Tween.get(zombie.zombie)
        .to({ x: 700 }, 1000)
        .wait(2000)
        .to({ x: 1080 }, 1000)
        .call(() => {
          (function (zombie) {
            // 移除
            zombie.zombie.parent.removeChild(zombie.zombie);
          })(zombie);
        });
    });

    // 播放动画
    createjs.Tween.get(bgContainer.getChildByName("bg"))
      .to({ x: -450 }, 1000)
      .wait(2000)
      .to({ x: -120 }, 1000)
      .call(
        function () {
          // 再播放铺草坪动画
          var BG1S = new createjs.Bitmap(window.loader.getResult("BG1S"));
          BG1S.x = -120;
          stage.addChild(BG1S);
          // 遮罩
          var mask = new createjs.Shape();
          mask.graphics.beginFill("#000").drawRect(0, 0, 750, 150);
          mask.x = -580;
          mask.y = 320;
          mask.regX = 0;
          mask.regY = 50;
          BG1S.mask = mask;

          // 草的轴
          var sodRoll = new createjs.Bitmap(window.loader.getResult("SodRoll"));
          sodRoll.x = 170;
          sodRoll.y = 360;
          sodRoll.name = "sodRoll";
          sodRoll.regX = 34;
          sodRoll.regY = 141;
          stage.addChild(sodRoll);

          // 草的横截面
          var sodRollCap = new createjs.Bitmap(
            window.loader.getResult("SodRollCap")
          );
          sodRollCap.x = 170;
          sodRollCap.y = 340;
          sodRollCap.name = "sodRollCap";
          sodRollCap.regX = 36;
          sodRollCap.regY = 35;
          stage.addChild(sodRollCap);

          createjs.Tween.get(mask, { loop: false }).to(
            { x: 140 },
            2000,
            createjs.Ease.getPowInOut(4)
          );

          createjs.Tween.get(sodRollCap, { loop: false }).to(
            { x: 900, scale: 0.3, y: 375, rotation: 720 },
            2000,
            createjs.Ease.getPowInOut(4)
          );

          createjs.Tween.get(sodRoll, { loop: false })
            .to(
              { x: 900, scaleX: 0.3, scaleY: 0.8, y: 380 },
              2000,
              createjs.Ease.getPowInOut(4)
            )
            .call(
              function () {
                this.zombieList.push(
                  new Zombie(700 + Math.random() * 100 - 50, 100)
                );

                stage.removeChild(stage.getChildByName("sodRoll"));
                stage.removeChild(stage.getChildByName("sodRollCap"));
                stage.removeChild(BG1S);
                // 更换背景图片
                bg.image = window.loader.getResult("BG1S");

                // 播放完动画之后，给僵尸分配道次
                var count = 0;
                this.zombieList.forEach((zombie) => {
                  zombie.colunm = 2;
                  // 调整位置
                  zombie.zombie.x =
                    900 + zombie.colunm * -100 + Math.random() * 80;
                  zombie.zombie.y = zombie.colunm * 100 + 20;
                  count++;
                });

                window.zombieList = this.zombieList;

                // 添加Card
                var peaShooterCard = new PeaShooterCard(130, 0);
                var shovel = new ShovelCard();
                var sunBoard = new SunBoard(0, 0);
                new Car(100, 320);

                // 等待5秒后，僵尸开始行动
                setTimeout(() => {
                  // 开启tick
                  createjs.Ticker.addEventListener(
                    "tick",
                    this.tick.bind(this)
                  );
                }, 1000);

                // 绘制地皮
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
              }.bind(this)
            );
        }.bind(this)
      );
  }

  // 游戏开始
  tick() {
    // 如果zombieList为空，说明僵尸都死光了，游戏结束
    if (this.zombieList.length == 0 && window.gameStep == 1) {
      window.gameStep = 2;
      //黑屏一下
      console.log("游戏结束");
      var black = new createjs.Shape();
      black.graphics.beginFill("#000").drawRect(0, 0, 950, 750);
      black.name = "black";
      black.alpha = 0;
      stage.addChild(black);
      // 文字
      var text = new createjs.Text(
        "正在转移到下一关",
        "bold 50px Arial",
        "#fff"
      );
      text.x = 300;
      text.y = 300;
      text.name = "text";
      text.alpha = 1;
      stage.addChild(text);
      createjs.Tween.get(black)
        .to({ alpha: 1 }, 1000)
        .wait(3000)
        .call(() => {
          // 重新开始
          var bgContainer = window.stage.getChildByName("bgContainer");
          bgContainer.removeAllChildren();

          var uiContainer = window.stage.getChildByName("uiContainer");
          uiContainer.removeAllChildren();

          var gameContainer = window.stage.getChildByName("gameContainer");
          gameContainer.removeAllChildren();
          // 移除舞台的监听事件
          window.stage.removeAllEventListeners();

          new GameAll();
        });
    }

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
    if (Math.random() < 0.005) {
      window.gameData.sunOnland++;
      new Sun(Math.random() * 600, 0);
    }
  }
}

export { Game001 };
