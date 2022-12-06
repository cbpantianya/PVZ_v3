import { GameData } from "./Storage/Storage.js";
import { GameStart } from "./GameStart/GameStart.js";
import { GameChoose } from "./GameChoose/GameChoose.js";
import { GameAll } from "./GameAll/GameAll.js";
import { Game001 } from "./Game001/Game001.js";

function loadAssets() {
  var manifest = [
    { src: "../assets/imgs/StartGameBG.png", id: "StartGameBG" },
    { src: "../assets/imgs/ChooseGameBG.png", id: "ChooseGameBG" },
    {
      src: "../assets/imgs/SelectorScreenStartAdventur.png",
      id: "SelectorScreenStartAdventur",
    },
    { src: "../assets/imgs/BackGroundS/BG5S.jpg", id: "BG5S" },
    { src: "../assets/imgs/BackGroundS/BG1S.jpg", id: "BG1S" },
    { src: "../assets/imgs/BackGroundS/BG0S.jpg", id: "BG0S" },
    { src: "../assets/imgs/SodRoll.png", id: "SodRoll" },
    { src: "../assets/imgs/SodRollCap.png", id: "SodRollCap" },
    { src: "../assets/imgs/Zombies/Zombie/ZombieWalk1.png", id: "ZombieWalk" },
    { src: "../assets/imgs/Zombies/Zombie/ZombieDie.png", id: "ZombieDie" },
    { src: "../assets/imgs/Cards/PeaShooter.png", id: "PeaShooterCard" },
    { src: "../assets/imgs/Cards/PeaShooterG.png", id: "PeaShooterCardG" },
    {
      src: "../assets/imgs/Plants/PeaShooter/PeaShooter.png",
      id: "PeaShooter",
    },
    { src: "../assets/imgs/Plants/PB1.gif", id: "PB1" },
    { src: "../assets/imgs/Zombies/Zombie/ZombieEat.png", id: "ZombieEat" },
    { src: "../assets/imgs/SunBack.png", id: "SunBoard" },
    { src: "../assets/imgs/Sun.png", id: "Sun" },
    { src: "../assets/imgs/ZombiesWon.png", id: "ZombieWon" },
    { src: "../assets/imgs/Cards/SunFlower.png", id: "SunFlowerCard" },
    { src: "../assets/imgs/Plants/SunFlower/SunFlower.png", id: "SunFlower" },
    { src: "../assets/imgs/Cards/CherryBomb.png", id: "CherryBombCard" },
    {
      src: "../assets/imgs/Plants/CherryBomb/CherryBomb.png",
      id: "CherryBomb",
    },
    { src: "../assets/imgs/Plants/CherryBomb/Boom.gif", id: "CherryBombBoom" },
    {
      src: "../assets/imgs/Zombies/Zombie/ZombieBoomDie.png",
      id: "ZombieBoomDie",
    },
    { src: "../assets/imgs/Cards/WallNut.png", id: "WallNutCard" },
    { src: "../assets/imgs/Plants/WallNut/WallNut.png", id: "WallNut" },
    { src: "../assets/imgs/Plants/WallNut/WallNut1.png", id: "WallNut1" },
    { src: "../assets/imgs/Plants/WallNut/WallNut2.png", id: "WallNut2" },
    { src: "../assets/imgs/LawnMower.gif", id: "LawnMower" },
    { src: "../assets/sounds/MainBGM.mp3", id: "MainBGM" },
  ];
  var loader = new createjs.LoadQueue();
  loader.loadManifest(manifest);
  loader.on("complete", handleComplete);
  window.loader = loader;
}

function main() {
  var canvas = document.getElementById("canvas");
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.interval = 1000 / 31;

  // 获取容器并初始化舞台
  window.stage = new createjs.Stage(canvas);
  stage.enableMouseOver(20);

  // 新建容器，用于处理背景图片
  var bgContainer = new createjs.Container();
  window.stage.addChild(bgContainer);
  bgContainer.name = "bgContainer";

  // 新建容器，用于处理游戏UI
  var uiContainer = new createjs.Container();
  window.stage.addChild(uiContainer);
  uiContainer.name = "uiContainer";

  var plantContainer = new createjs.Container();
  window.stage.addChild(plantContainer);
  plantContainer.name = "plantContainer";

  // 新建容器，用于处理游戏内容
  var gameContainer = new createjs.Container();
  stage.addChild(gameContainer);
  gameContainer.name = "gameContainer";

  // 添加舞台刷新
  createjs.Ticker.on("tick", window.stage);
  new GameStart();

  var speechRecognition = new webkitSpeechRecognition();

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "cmn-Hans-CN";
  speechRecognition.start();
  speechRecognition.onresult = function (event) {
    // 获取最后一句话
    var last = event.results.length - 1;
    var lastTranscript = event.results[last][0].transcript;
    var speech = document.getElementById("speech");
    speech.innerHTML = lastTranscript;
    // 如果语句结束
    if (event.results[last].isFinal) {
      if (lastTranscript == "开始游戏") {
        new GameChoose();
      } else if (lastTranscript == "返回") {
        new GameStart();
      } else if (lastTranscript == "开始冒险") {
        new Game001();
        speechRecognition.stop();
      }
    }
  };

  window.speech = speechRecognition;

  return;
}

function handleComplete() {
  var startGameButton = document.getElementById("start-button");
  startGameButton.onclick = function () {
    var mainBGM = window.loader.getResult("MainBGM");
    mainBGM.loop = true;
    mainBGM.volume = 0.5;
    mainBGM.play();

    // 移除main-mask
    var mainMask = document.getElementById("main-mask");
    mainMask.remove();
  };
  main();
}

// 获取资源
loadAssets();
