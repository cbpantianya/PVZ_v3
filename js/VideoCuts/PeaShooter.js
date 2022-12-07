// 豌豆射手的影片剪辑
// 包括卡片和射手本身
import { PB1 } from "./PB1.js";
import { SunFlower, SunFlowerCard } from "./SunFlower.js";
import { CherryBomb } from "./CherryBomb.js";
import { WallNut } from "./WallNut.js";
import { TwinSunflower } from "./TwinSunflower.js";
import { GatlingPea } from "./GatlingPea.js";
import { Repeater } from "./Repeater.js";
class PeaShooter {
  constructor(x, y) {
    this.__init__(x, y);
    this.blood = 9;
    this.waitBlood = 0;
  }

  __init__(x, y) {
    // 生成射手
    var peaShooterSheet = new createjs.SpriteSheet({
      images: [window.loader.getResult("PeaShooter")],
      frames: {
        width: 71,
        height: 71,
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
    this.peaShooter.regX = 35;
    this.peaShooter.regY = 35;
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

class PeaShooterCard {
  constructor(x, y) {
    this.__init__(x, y);
    this.__plantInHand__ = false;
    this.waitTime = 0;
    var speechRecognition = new webkitSpeechRecognition();
    this.SpecialTime = false; //防抖
    this.binded = false;

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "cmn-Hans-CN";
    speechRecognition.start();
    speechRecognition.onresult = function (event) {
      // 保持监听
      // 输出最后一句话
      var last = event.results.length - 1;
      var lastTranscript = event.results[last][0].transcript;
      if (true) {
        var speech = document.getElementById("speech");
        speech.innerHTML = lastTranscript;
        // 正则表达式
        const req =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+豌豆射手/;
        if (req.test(lastTranscript)) {
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (
            land.plant == null &&
            window.gameData.sun >= 100 &&
            land.type == 1
          ) {
            // 种植
            land.plant = new PeaShooter(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
            window.gameData.sun -= 100;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("sunNumber").text = window.gameData.sun;
            // 禁用卡片
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("PeaShooterCard")
              .removeAllEventListeners();
            this.binded = false;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("PeaShooterCard")
              .addEventListener("tick", this.tick.bind(this));
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("PeaShooterCard").alpha = 0.5;
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
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 100) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("PeaShooterCard")
                      .addEventListener("click", this.click.bind(this));
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("PeaShooterCard").alpha = 1;
                  }
                  this.waitTime = 0;
                }
              }.bind(this),
              600
            );
          }
        }

        const req6 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+双向日葵/;
        if (
          req6.test(lastTranscript) &&
          this.SpecialTime == false &&
          window.gameData.cardList[4].waitTime == 0
        ) {
          this.SpecialTime = true;
          setTimeout(
            function () {
              this.SpecialTime = false;
            }.bind(this),
            6000
          );
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new TwinSunflower(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
            window.gameData.sun -= 150;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("sunNumber").text = window.gameData.sun;
            // 禁用卡片
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("TwinSunflowerCard")
              .removeAllEventListeners();
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("TwinSunflowerCard").alpha = 0.5;
            // 添加倒计时
            var time = 10;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("TwinSunflowerCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("TwinSunflowerCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 150) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("TwinSunflowerCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[4].click.bind(
                          window.gameData.cardList[4]
                        )
                      );
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("TwinSunflowerCard").alpha = 1;
                  }
                  this.waitTime = 0;
                }
              }.bind(this),
              600
            );
          }

          return;
        }
        const req2 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+向日葵/;
        if (req2.test(lastTranscript)) {
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new SunFlower(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
            window.gameData.sun -= 50;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("sunNumber").text = window.gameData.sun;
            // 禁用卡片
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("SunFlowerCard")
              .removeAllEventListeners();

            window.stage
              .getChildByName("uiContainer")
              .getChildByName("SunFlowerCard").alpha = 0.5;
            // 添加倒计时
            var time = 10;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("SunFlowerCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("SunFlowerCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 50) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("SunFlowerCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[1].click.bind(
                          window.gameData.cardList[1]
                        )
                      );

                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("SunFlowerCard").alpha = 1;
                  }
                  this.waitTime = 0;
                }
              }.bind(this),
              600
            );
          }
        }

        const req3 = /收集太阳/;
        if (req3.test(lastTranscript)) {
          // 销毁所有太阳
          window.gameData.sun += window.gameData.sunOnland * 25;
          window.stage
            .getChildByName("uiContainer")
            .getChildByName("sunNumber").text = window.gameData.sun;
          window.gameData.sunOnland = 0;
          while (
            window.stage
              .getChildByName("gameContainer")
              .getChildByName("sun") != null
          ) {
            // 销毁太阳
            window.stage
              .getChildByName("gameContainer")
              .removeChild(
                window.stage
                  .getChildByName("gameContainer")
                  .getChildByName("sun")
              );
          }
        }

        const req4 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+樱桃+[\u4e00-\u9fa5]/;
        if (
          req4.test(lastTranscript) &&
          this.SpecialTime == false &&
          window.gameData.cardList[2].waitTime == 0
        ) {
          this.SpecialTime = true;
          setTimeout(
            function () {
              this.SpecialTime = false;
            }.bind(this),
            6000
          );
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new CherryBomb(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;

            land.plant.startBomb();

            window.gameData.sun -= 150;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("sunNumber").text = window.gameData.sun;
            // 禁用卡片
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("CherryBombCard")
              .removeAllEventListeners();
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("CherryBombCard").alpha = 0.5;
            // 添加倒计时
            var time = 20;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("CherryBombCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("CherryBombCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 150) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("CherryBombCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[2].click.bind(
                          window.gameData.cardList[2]
                        )
                      );
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("CherryBombCard").alpha = 1;
                  }
                  this.waitTime = 0;
                }
              }.bind(this),
              600
            );
          }
        }

        const req5 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+坚果/;
        if (
          req5.test(lastTranscript) &&
          this.SpecialTime == false &&
          window.gameData.cardList[3].waitTime == 0
        ) {
          this.SpecialTime = true;
          setTimeout(
            function () {
              this.SpecialTime = false;
            }.bind(this),
            6000
          );
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new WallNut(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
            window.gameData.sun -= 50;
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("sunNumber").text = window.gameData.sun;
            // 禁用卡片
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("WallNutCard")
              .removeAllEventListeners();
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("WallNutCard").alpha = 0.5;
            // 添加倒计时
            var time = 25;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("WallNutCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("WallNutCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 50) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("WallNutCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[3].click.bind(
                          window.gameData.cardList[3]
                        )
                      );
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("WallNutCard").alpha = 1;
                  }
                  this.waitTime = 0;
                }
              }.bind(this),
              600
            );
          }
        }

        const req7 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+机枪射手/;
        if (
          req7.test(lastTranscript) &&
          this.SpecialTime == false &&
          window.gameData.cardList[4].waitTime == 0
        ) {
          this.SpecialTime = true;
          setTimeout(
            function () {
              this.SpecialTime = false;
            }.bind(this),
            6000
          );
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new GatlingPea(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
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
              .getChildByName("GatlingPeaCard").alpha = 0.5;
            // 添加倒计时
            var time = 10;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("GatlingPeaCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("GatlingPeaCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 250) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("GatlingPeaCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[5].click.bind(
                          window.gameData.cardList[5]
                        )
                      );
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

        const req8 =
          /在第[一二三四五12345]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]+双发射手/;
        if (
          req8.test(lastTranscript) &&
          this.SpecialTime == false &&
          window.gameData.cardList[5].waitTime == 0
        ) {
          this.SpecialTime = true;
          setTimeout(
            function () {
              this.SpecialTime = false;
            }.bind(this),
            6000
          );
          // 匹配行列
          const row = lastTranscript.match(/第[一二三四五12345]+行/);
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五12345]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant == null) {
            // 种植
            land.plant = new Repeater(
              land.x + land.width / 2,
              land.y + land.height / 2
            );
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
            window.gameData.sun -= 150;
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
              .getChildByName("RepeaterCard").alpha = 0.5;
            // 添加倒计时
            var time = 10;
            this.waitTime = 60;
            var timeText = new createjs.Text(time, "20px Arial", "#000");
            timeText.x =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("RepeaterCard").x + 40;
            timeText.y =
              window.stage
                .getChildByName("uiContainer")
                .getChildByName("RepeaterCard").y + 25;
            window.stage.getChildByName("uiContainer").addChild(timeText);
            var timer = setInterval(
              function () {
                time--;
                timeText.text = time;
                if (time == 0) {
                  clearInterval(timer);
                  window.stage
                    .getChildByName("uiContainer")
                    .removeChild(timeText);
                  if (window.gameData.sun >= 150) {
                    window.stage
                      .getChildByName("uiContainer")
                      .getChildByName("RepeaterCard")
                      .addEventListener(
                        "click",
                        window.gameData.cardList[6].click.bind(
                          window.gameData.cardList[6]
                        )
                      );
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

        // 铲除植物
        const req9 =
          /[\u4e00-\u9fa5]除第[一二三四五六七八九123456789]+行第[一二三四五六七八九123456789]+列[\u4e00-\u9fa5]/;

        if (req9.test(lastTranscript)) {
          // 匹配行列
          const row = lastTranscript.match(
            /第[一二三四五六七八九123456789]+行/
          );
          const col = lastTranscript.match(
            /第[一二三四五六七八九123456789]+列/
          );
          // 转换为数字
          const rowNumber = row[0].match(/[一二三四五六七八九123456789]+/)[0];
          const colNumber = col[0].match(/[一二三四五六七八九123456789]+/)[0];
          // 找到对应的土地
          const land = window.gameData.land[rowNumber - 1][colNumber - 1];
          // 判断土地是否为空
          if (land.plant != null) {
            // 移除植物
            window.stage
              .getChildByName("plantContainer")
              .removeChild(land.plant.peaShooter);
            land.plant = null;
            window.gameData.land[rowNumber - 1][colNumber - 1] = land;
          }
        }
      }
    }.bind(this);

    window.speech = speechRecognition;
  }

  __init__(x, y) {
    // 生成卡片
    var card = new createjs.Bitmap(window.loader.getResult("PeaShooterCard"));
    card.x = x;
    card.y = y;
    card.name = "PeaShooterCard";
    window.stage.getChildByName("uiContainer").addChild(card);

    // 卡片点击事件
    card.addEventListener("click", this.click.bind(this));
    card.addEventListener("tick", this.tick.bind(this));

    this.card = card;

    // 添加需要的太阳数量
    var text = new createjs.Text("100", "16px Arial", "#000000");
    text.x = x + 65;
    text.y = y + 45;
    window.stage.getChildByName("plantContainer").addChild(text);
  }

  tick() {
    // 保持语音识别始终运行

    if (window.gameData.sun >= 100 && this.waitTime <= 0) {
      if ((this.binded = false)) {
        this.binded = true;
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("PeaShooterCard")
          .addEventListener("click", this.click.bind(this));
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("PeaShooterCard").alpha = 1;
      }
    } else {
      if (window.gameData.sun < 100) {
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("PeaShooterCard")
          .removeAllEventListeners("click");
        window.stage
          .getChildByName("uiContainer")
          .getChildByName("PeaShooterCard").alpha = 0.5;
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
            .getChildByName("vituralPeaShooter")
        );
    } else {
      // 生成射手,并跟随鼠标
      var PeaShooterInHand = new PeaShooter(e.stageX, e.stageY);
      window.stage
        .getChildByName("plantContainer")
        .addChild(PeaShooterInHand.peaShooter);

      // 鼠标移动事件
      window.stage.addEventListener(
        "stagemousemove",
        this.mousemove.bind(this, PeaShooterInHand)
      );

      this.peaShooter = PeaShooterInHand;

      this.__plantInHand__ = true;
    }
  }

  mousemove(PeaShooterInHand, e) {
    // 跟随鼠标移动
    PeaShooterInHand.peaShooter.x = e.stageX;
    PeaShooterInHand.peaShooter.y = e.stageY;

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
          .getChildByName("vituralPeaShooter")
      ) {
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralPeaShooter").x = minLand.center.x;
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralPeaShooter").y = minLand.center.y;
      } else {
        // 生成一个新的射手，但是半透明
        var vituralPeaShooter = new PeaShooter(
          minLand.center.x,
          minLand.center.y
        );
        vituralPeaShooter.peaShooter.alpha = 0.5;
        vituralPeaShooter.peaShooter.name = "vituralPeaShooter";
        window.stage
          .getChildByName("plantContainer")
          .addChild(vituralPeaShooter.peaShooter);

        vituralPeaShooter.peaShooter.addEventListener(
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
            .getChildByName("vituralPeaShooter")
        );
    }
  }

  plantPlant() {
    // 种植物
    // 在指定位置生成一个豌豆射手
    var peaShooter = new PeaShooter(
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralPeaShooter").x,
      window.stage
        .getChildByName("plantContainer")
        .getChildByName("vituralPeaShooter").y
    );
    // 删除虚拟射手
    window.stage
      .getChildByName("plantContainer")
      .removeChild(
        window.stage
          .getChildByName("plantContainer")
          .getChildByName("vituralPeaShooter")
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

    window.gameData.sun -= 100;
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("sunNumber").text = window.gameData.sun;
    // 禁用卡片
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("PeaShooterCard")
      .removeAllEventListeners();
    this.binded = false;
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("PeaShooterCard")
      .addEventListener("tick", this.tick.bind(this));
    window.stage
      .getChildByName("uiContainer")
      .getChildByName("PeaShooterCard").alpha = 0.5;
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
          if (window.gameData.sun >= 100) {
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("PeaShooterCard")
              .addEventListener("click", this.click.bind(this));
            window.stage
              .getChildByName("uiContainer")
              .getChildByName("PeaShooterCard").alpha = 1;
          }
          this.waitTime = 0;
        }
      }.bind(this),
      600
    );
  }
}

export { PeaShooterCard };
