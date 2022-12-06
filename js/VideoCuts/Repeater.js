import { PB1 } from "./PB1.js";

class Repeater {
  constructor(x, y) {
    this.__init__(x, y);
    this.blood = 9;
    this.waitBlood = 0;
  }

  __init__(x, y) {
    // 生成射手
    var peaShooterSheet = new createjs.SpriteSheet({
      images: [window.loader.getResult("Repeater")],
      frames: {
        width: 73,
        height: 71,
        count: 15,
        regX: 0,
        regY: 0,
        spacing: 0,
        margin: 0,
      },
      animations: {
        shoot: [0, 14, "shoot", 0.5],
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
    if (this.waitAttack == 50) {
      this.waitAttack = 0;
      // 生成双发子弹
      var PB = new PB1(this.peaShooter.x + 28, this.peaShooter.y - 15);
      var PB2 = new PB1(this.peaShooter.x + 18, this.peaShooter.y - 15);
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

class RepeaterCard {
  constructor(x, y) {
    this.__init__(x, y);
    this.__plantInHand__ = false;
    this.waitTime = 0;
  }

  __init__(x, y) {
    // 生成卡片
    var card = new createjs.Bitmap(window.loader.getResult("RepeaterCard"));
    card.x = x;
    card.y = y;
    card.name = "RepeaterCard";
    window.stage.getChildByName("uiContainer").addChild(card);

    // 卡片点击事件
    card.addEventListener("click", this.click.bind(this));
    card.addEventListener("tick", this.tick.bind(this));

    this.card = card;

    // 添加需要的太阳数量
    var text = new createjs.Text("200", "16px Arial", "#000000");
    text.x = x + 65;
    text.y = y + 45;
    window.stage.getChildByName("plantContainer").addChild(text);
  }

  tick() {
    if (window.gameData.sun >= 200 && this.waitTime <= 0) {
      window.stage
        .getChildByName("uiContainer")
        .getChildByName("RepeaterCard")
        .addEventListener("click", this.click.bind(this));
      window.stage
        .getChildByName("uiContainer")
        .getChildByName("RepeaterCard").alpha = 1;
    } else {
      if (window.gameData.sun < 200) {
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("RepeaterCard")
          .removeAllEventListeners("click");
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("RepeaterCard").alpha = 0.5;
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
            .getChildByName("vituralRepeater")
        );
    } else {
      // 生成射手,并跟随鼠标
      var RepeaterInHand = new Repeater(e.stageX, e.stageY);
      window.stage
        .getChildByName("plantContainer")
        .addChild(RepeaterInHand.peaShooter);

      // 鼠标移动事件
      window.stage.addEventListener(
        "stagemousemove",
        this.mousemove.bind(this, RepeaterInHand)
      );

      this.peaShooter = RepeaterInHand;

      this.__plantInHand__ = true;
    }
  }

  mousemove(RepeaterInHand, e) {
    // 跟随鼠标移动
    RepeaterInHand.peaShooter.x = e.stageX;
    RepeaterInHand.peaShooter.y = e.stageY;

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
          .getChildByName("vituralRepeater")
      ) {
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralRepeater").x = minLand.center.x;
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralRepeater").y = minLand.center.y;
      } else {
        // 生成一个新的射手，但是半透明
        var vituralRepeater = new Repeater(minLand.center.x, minLand.center.y);
        vituralRepeater.peaShooter.alpha = 0.5;
        vituralRepeater.peaShooter.name = "vituralRepeater";
        window.stage
          .getChildByName("plantContainer")
          .addChild(vituralRepeater.peaShooter);

        vituralRepeater.peaShooter.addEventListener(
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
            .getChildByName("vituralRepeater")
        );
    }
  }

  plantPlant() {
    // 种植物
    // 在指定位置生成一个豌豆射手
    var peaShooter = new Repeater(
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralRepeater").x,
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralRepeater").y
    );
    // 删除虚拟射手
    window.stage
      .getChildByName("plantContainer")
      .removeChild(
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralRepeater")
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

    window.gameData.sun -= 200;
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("sunNumber").text = window.gameData.sun;
    // 禁用卡片
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("RepeaterCard")
      .removeAllEventListeners();
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("RepeaterCard")
      .addEventListener("tick", this.tick.bind(this));
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("RepeaterCard").alpha = 0.5;
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
          if (window.gameData.sun >= 200) {
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("RepeaterCard")
              .addEventListener("click", this.click.bind(this));
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("RepeaterCard").alpha = 1;
          }
          this.waitTime = 0;
        }
      }.bind(this),
      600
    );
  }
}

export { RepeaterCard, Repeater };
