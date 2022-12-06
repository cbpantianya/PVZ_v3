// 游戏数据存储类，用于数据共享与游戏数据重置
class GameData {
  // 构造函数
  constructor() {
    this.__init__();
  }

  // 数据初始化与赋值
  __init__() {
    this.level = 1; // 当前关卡
    this.land = []; // 地图数据
    this.sun = 3000; // 当前阳光数
    this.sunOnland = 0;
    this.plantInhand = false;
  }

  // 重置游戏数据
  reset() {
    this.__init__();
  }

  // 生成地皮数据，只接受单数1/3/5
  generateLand(nums) {
    this.land = [];
    for (let i = 0; i < 5; i++) {
      this.land.push([]);
      if (nums == 5) {
        for (let j = 0; j < 9; j++) {
          this.land[i].push(
            new LandUnit(j * 80 + 140, i * 100 + 80, 80, 100, 1, null, i)
          );
        }
      } else if (nums == 3) {
        if (i == 0 || i == 4) {
          for (let j = 0; j < 9; j++) {
            this.land[i].push(new LandUnit(j * 80, i * 80, 80, 80, 0, null));
          }
        } else {
          for (let j = 0; j < 9; j++) {
            this.land[i].push(new LandUnit(j * 80, i * 80, 80, 80, 1, null));
          }
        }
      } else if (nums == 1) {
        if (i == 0 || i == 1 || i == 3 || i == 4) {
          for (let j = 0; j < 9; j++) {
            this.land[i].push(
              new LandUnit(j * 80 + 140, i * 100 + 80, 80, 100, 0, null, i)
            );
          }
        } else {
          for (let j = 0; j < 9; j++) {
            this.land[i].push(
              new LandUnit(j * 80 + 140, i * 100 + 80, 80, 100, 1, null, i)
            );
          }
        }
      }
    }
  }
}

export { GameData };

// 一小块地皮的数据存储
class LandUnit {
  constructor(
    x, // x左上角坐标
    y, // y左上角坐标
    width, // 宽度
    height, // 高度
    type, // 类型
    plant, // 植物, null表示无植物
    colunm
  ) {
    // 成员变量
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.center = {
      x: x + width / 2,
      y: y + height / 2,
    };

    this.type = type;
    this.plant = plant;
    this.colunm = colunm;
  }
}
