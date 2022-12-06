import { PB1 } from "./PB1.js";
class GatlingPea {
  constructor(x, y) {
    this.__init__(x, y);
    this.blood = 9;
    this.waitBlood = 0;
  }

  __init__(x, y) {
    // 生成射手
    var peaShooterSheet = new createjs.SpriteSheet({
      images: [window.loader.getResult("GatlingPea")],
      frames: {
        width: 88,
        height: 84,
        count: 13,
        regX: 0,
        regY: 0,
        spacing: 0,
        margin: 0,
      },
      animations: {
        shoot: [0, 12, "shoot", 0.5],
      },
    });
    this.peaShooter = new createjs.Sprite(peaShooterSheet, "shoot");
    this.peaShooter.x = x;
    this.peaShooter.y = y;
    this.peaShooter.regX = 44;
    this.peaShooter.regY = 42;
    window.stage.getChildByName("plantContainer").addChild(this.peaShooter);
    this.attackRange = 700;
    this.waitAttack = 0;
    // 血量监测
    this.peaShooter.addEventListener("tick", this.tick.bind(this));
  }

  attack() {
    this.waitAttack += 1;
    if (this.waitAttack == 10) {
      this.waitAttack = 0;
      // 生成子弹
      var PB = new PB1(this.peaShooter.x + 25, this.peaShooter.y - 15);
    }
  }

  bloodJ() {
    if (this.waitBlood == 10) {
      this.waitBlood = 0;
      this.blood -= 1;
    }
    this.waitBlood++;
  }

  tick() {
    if (this.blood <= 0) {
      this.peaShooter.alpha = 0.5;
      // 移除监听并销毁自己
      this.peaShooter.removeEventListener("tick", this.tick.bind(this));
      window.stage
        .getChildByName("plantContainer")
        .removeChild(this.peaShooter);
      window.gameData.land.forEach((e) => {
        e.forEach((e) => {
          if (e.plant == this) {
            e.plant = null;
          }
        });
      });
      // 告诉附近的僵尸可以移动了
      window.zombieList.forEach((e) => {
        if (Math.abs(e.zombie.x - this.peaShooter.x) < 200) {
          e.isMove = true;
          e.zombie.gotoAndPlay("walk");
        }
      });
    }
  }
}

class GatlingPeaCard {
  constructor(x, y) {
    this.__init__(x, y);
    this.__plantInHand__ = false;
    this.waitTime = 0;
  }

  __init__(x, y) {
    // 生成卡片
    var card = new createjs.Bitmap(window.loader.getResult("GatlingPeaCard"));
    card.x = x;
    card.y = y;
    card.name = "GatlingPeaCard";
    window.stage.getChildByName("uiContainer").addChild(card);

    // 卡片点击事件
    card.addEventListener("click", this.click.bind(this));
    card.addEventListener("tick", this.tick.bind(this));

    this.card = card;

    // 添加需要的太阳数量
    var text = new createjs.Text("250", "16px Arial", "#000000");
    text.x = x + 65;
    text.y = y + 45;
    window.stage.getChildByName("plantContainer").addChild(text);
  }

  tick() {
    if (window.gameData.sun >= 250 && this.waitTime <= 0) {
      window.stage
        .getChildByName("uiContainer")
        .getChildByName("GatlingPeaCard")
        .addEventListener("click", this.click.bind(this));
      window.stage
        .getChildByName("uiContainer")
        .getChildByName("GatlingPeaCard").alpha = 1;
    } else {
      if (window.gameData.sun < 250) {
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("GatlingPeaCard")
          .removeAllEventListeners("click");
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("GatlingPeaCard").alpha = 0.5;
      }
    }
  }

  click(e) {
    if (this.__plantInHand__) {
      // 删除射手
      window.stage
        .getChildByName("plantContainer")
        .removeChild(this.peaShooter.peaShooter);
      this.__plantInHand__ = false;
      // 删除虚拟射手
      window.stage
        .getChildByName("plantContainer")
        .removeChild(
          window.stage
            .getChildByName("plantContainer")
            .getChildByName("vituralGatlingPea")
        );
    } else {
      // 生成射手,并跟随鼠标
      var GatlingPeaInHand = new GatlingPea(e.stageX, e.stageY);
      window.stage
        .getChildByName("plantContainer")
        .addChild(GatlingPeaInHand.peaShooter);

      // 鼠标移动事件
      window.stage.addEventListener(
        "stagemousemove",
        this.mousemove.bind(this, GatlingPeaInHand)
      );

      this.peaShooter = GatlingPeaInHand;

      this.__plantInHand__ = true;
    }
  }

  mousemove(GatlingPeaInHand, e) {
    // 跟随鼠标移动
    GatlingPeaInHand.peaShooter.x = e.stageX;
    GatlingPeaInHand.peaShooter.y = e.stageY;

    // 寻找最近的地皮

    var minDistance = 100000;
    var minLand = null;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 9; j++) {
        if (
          window.gameData.land[i][j].type == 1 &&
          window.gameData.land[i][j].plant == null
        ) {
          var distance = Math.sqrt(
            Math.pow(window.gameData.land[i][j].center.x - e.stageX, 2) +
              Math.pow(window.gameData.land[i][j].center.y - e.stageY, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            minLand = window.gameData.land[i][j];
          }
        }
      }
    }

    if (minDistance <= 50 && this.__plantInHand__) {
      // 通过name场上是否存在虚拟射手
      if (
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralGatlingPea")
      ) {
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralGatlingPea").x = minLand.center.x;
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralGatlingPea").y = minLand.center.y;
      } else {
        // 生成一个新的射手，但是半透明
        var vituralGatlingPea = new GatlingPea(
          minLand.center.x,
          minLand.center.y
        );
        vituralGatlingPea.peaShooter.alpha = 0.5;
        vituralGatlingPea.peaShooter.name = "vituralGatlingPea";
        window.stage
          .getChildByName("plantContainer")
          .addChild(vituralGatlingPea.peaShooter);

        vituralGatlingPea.peaShooter.addEventListener(
          "click",
          this.plantPlant.bind(this)
        );
      }
    } else {
      window.stage
        .getChildByName("plantContainer")
        .removeChild(
          window.stage
            .getChildByName("plantContainer")
            .getChildByName("vituralGatlingPea")
        );
    }
  }

  plantPlant() {
    // 种植物
    // 在指定位置生成一个豌豆射手
    var peaShooter = new GatlingPea(
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralGatlingPea").x,
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralGatlingPea").y
    );
    // 删除虚拟射手
    window.stage
      .getChildByName("plantContainer")
      .removeChild(
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralGatlingPea")
      );
    // 删除射手
    window.stage
      .getChildByName("plantContainer")
      .removeChild(this.peaShooter.peaShooter);
    this.__plantInHand__ = false;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 9; j++) {
        if (
          window.gameData.land[i][j].center.x == peaShooter.peaShooter.x &&
          window.gameData.land[i][j].center.y == peaShooter.peaShooter.y
        ) {
          window.gameData.land[i][j].plant = peaShooter;
        }
      }
    }

    window.gameData.sun -= 250;
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("sunNumber").text = window.gameData.sun;
    // 禁用卡片
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("GatlingPeaCard")
      .removeAllEventListeners();
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("GatlingPeaCard")
      .addEventListener("tick", this.tick.bind(this));
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("GatlingPeaCard").alpha = 0.5;
    // 添加倒计时
    var time = 10;
    this.waitTime = 60;
    var timeText = new createjs.Text(time, "20px Arial", "#000");
    timeText.x = this.card.x + 40;
    timeText.y = this.card.y + 25;
    window.stage.getChildByName("uiContainer").addChild(timeText);
    var timer = setInterval(
      function () {
        time--;
        timeText.text = time;
        if (time == 0) {
          clearInterval(timer);
          window.stage.getChildByName("uiContainer").removeChild(timeText);
          if (window.gameData.sun >= 250) {
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("GatlingPeaCard")
              .addEventListener("click", this.click.bind(this));
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("GatlingPeaCard").alpha = 1;
          }
          this.waitTime = 0;
        }
      }.bind(this),
      600
    );
  }
}

export { GatlingPeaCard, GatlingPea };
