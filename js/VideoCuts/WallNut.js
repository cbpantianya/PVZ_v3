

class WallNut {
    constructor(x, y) {

        this.blood = 50
        this.waitBlood = 0

        this.__init__(x, y)
    }

    __init__(x, y) {
        // 生成射手
        var peaShooterSheet = new createjs.SpriteSheet({
            "images": [window.loader.getResult("WallNut")],
            "frames": { "width": 65, "height": 73, "count": 16, "regX": 0, "regY": 0, "spacing": 0, "margin": 0 },
            "animations": {
                "shoot": [0, 15, "shoot", 0.5]
            }
        });
        this.peaShooter = new createjs.Sprite(peaShooterSheet, "shoot");
        this.peaShooter.x = x
        this.peaShooter.y = y
        this.peaShooter.regX = 35
        this.peaShooter.regY = 35
        window.stage.getChildByName("gameContainer").addChild(this.peaShooter)
        this.attackRange = 700
        this.waitAttack = 0
        // 血量监测
        this.peaShooter.addEventListener("tick", this.tick.bind(this))
    }
    bloodJ() {
        if (this.waitBlood == 10) {
            console.log('血量减少')
            this.waitBlood = 0
            this.blood -= 1
        }
        this.waitBlood++
    }

    attack() {
        //不动作
    }

    tick() {
        if (this.blood <= 0) {
            this.peaShooter.alpha = 0.5
            // 移除监听并销毁自己
            this.peaShooter.removeEventListener("tick", this.tick.bind(this))
            window.stage.getChildByName("gameContainer").removeChild(this.peaShooter)
            window.gameData.land.forEach(e => {
                e.forEach(e => {
                    if (e.plant == this) {
                        e.plant = null
                    }
                });
            });
            console.log(window.gameData.land)
            console.log("豌豆射手死了")
            // 告诉附近的僵尸可以移动了
            window.zombieList.forEach(e => {
                if (Math.abs(e.zombie.x - this.peaShooter.x) < 200) {
                    e.isMove = true
                    e.zombie.gotoAndPlay("walk")
                }
            });

        }
    }
}

class WallNutCard {
    constructor(x, y) {
        this.__plantInHand__ = false;
        this.waitTime = 0
        this.__init__(x, y)
    }

    __init__(x, y) {
        // 生成卡片
        var card = new createjs.Bitmap(window.loader.getResult("WallNutCard"))
        card.x = x
        card.y = y
        card.name = "WallNutCard"
        window.stage.getChildByName("uiContainer").addChild(card)

        // 卡片点击事件
        card.addEventListener("click", this.click.bind(this))
        card.addEventListener("tick", this.tick.bind(this))

        console.log(window.gameData.land)
        this.card = card
    }

    tick() {
        if (window.gameData.sun >= 50 && this.waitTime <= 0) {
            window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").addEventListener('click', this.click.bind(this))
            window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").alpha = 1
            //console.log("可以点击")
        } else {
            if (window.gameData.sun < 50) {

                window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").removeEventListener('click', this.click.bind(this))
                window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").alpha = 0.5
            }

        }
    }

    click(e) {

        if (this.__plantInHand__) {
            // 删除射手
            window.stage.getChildByName("gameContainer").removeChild(this.peaShooter.peaShooter)
            this.__plantInHand__ = false
            // 删除虚拟射手
            window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut"))
        } else {
            // 生成射手,并跟随鼠标
            var PeaShooterInHand = new WallNut(e.stageX, e.stageY)
            window.stage.getChildByName("gameContainer").addChild(PeaShooterInHand.peaShooter)

            // 鼠标移动事件
            window.stage.addEventListener("stagemousemove", this.mousemove.bind(this, PeaShooterInHand))

            this.peaShooter = PeaShooterInHand

            this.__plantInHand__ = true
        }


    }

    mousemove(PeaShooterInHand, e) {
        // 跟随鼠标移动
        PeaShooterInHand.peaShooter.x = e.stageX
        PeaShooterInHand.peaShooter.y = e.stageY

        // 寻找最近的地皮

        var minDistance = 100000
        var minLand = null
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 9; j++) {
                if (window.gameData.land[i][j].type == 1 && window.gameData.land[i][j].plant == null) {
                    var distance = Math.sqrt(Math.pow(window.gameData.land[i][j].center.x - e.stageX, 2) + Math.pow(window.gameData.land[i][j].center.y - e.stageY, 2))
                    if (distance < minDistance) {
                        minDistance = distance
                        minLand = window.gameData.land[i][j]
                    }
                }

            }
        }

        if (minDistance <= 50 && this.__plantInHand__) {

            // 通过name场上是否存在虚拟射手
            if (window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut")) {
                window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut").x = minLand.center.x
                window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut").y = minLand.center.y
            } else {
                // 生成一个新的射手，但是半透明
                var vituralPeaShooter = new WallNut(minLand.center.x, minLand.center.y)
                vituralPeaShooter.peaShooter.alpha = 0.5
                vituralPeaShooter.peaShooter.name = "vituralWallNut"
                window.stage.getChildByName("gameContainer").addChild(vituralPeaShooter.peaShooter)

                vituralPeaShooter.peaShooter.addEventListener('click', this.plantPlant.bind(this))
            }
        } else {
            window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut"))
        }



    }

    plantPlant() {
        // 种植物
        // 在指定位置生成一个豌豆射手
        var peaShooter = new WallNut(window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut").x, window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut").y)
        window.stage.getChildByName("gameContainer").addChild(peaShooter.peaShooter)
        // 删除虚拟射手
        window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralWallNut"))
        // 删除射手
        window.stage.getChildByName("gameContainer").removeChild(this.peaShooter.peaShooter)
        this.__plantInHand__ = false
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 9; j++) {
                if (window.gameData.land[i][j].center.x == peaShooter.peaShooter.x && window.gameData.land[i][j].center.y == peaShooter.peaShooter.y) {
                    window.gameData.land[i][j].plant = peaShooter
                }
            }
        }

        window.gameData.sun -= 50
        window.stage.getChildByName("uiContainer").getChildByName("sunNumber").text = window.gameData.sun
        // 禁用卡片
        window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").removeAllEventListeners()
        window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").addEventListener('tick', this.tick.bind(this))
        window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").alpha = 0.5
        // 添加倒计时
        var time = 10
        this.waitTime = 60
        var timeText = new createjs.Text(time, "20px Arial", "#000")
        timeText.x = this.card.x + 40
        timeText.y = this.card.y + 25
        window.stage.getChildByName("uiContainer").addChild(timeText)
        var timer = setInterval(function () {
            time--
            timeText.text = time
            if (time == 0) {
                clearInterval(timer)
                window.stage.getChildByName("uiContainer").removeChild(timeText)
                if (window.gameData.sun >= 50) {
                    window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").addEventListener('click', this.click.bind(this))
                    window.stage.getChildByName("uiContainer").getChildByName("WallNutCard").alpha = 1
                }
                this.waitTime = 0
            }

        }.bind(this), 600)

    }
}

export { WallNutCard, WallNut }