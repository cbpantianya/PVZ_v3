class CherryBomb {
    constructor(x, y) {

        this.blood = 6
        this.waitBlood = 0

        this.__init__(x, y)
    }

    __init__(x, y) {
        // 生成射手
        var peaShooterSheet = new createjs.SpriteSheet({
            "images": [window.loader.getResult("CherryBomb")],
            "frames": { "width": 112, "height": 81, "count": 7, "regX": 0, "regY": 0, "spacing": 0, "margin": 0 },
            "animations": {
                "boom": [0, 6, null, 0.8],
            }
        });
        this.peaShooter = new createjs.Sprite(peaShooterSheet, "boom");
        // 不播放动画
        this.peaShooter.gotoAndStop(0)
        this.peaShooter.x = x
        this.peaShooter.y = y
        this.peaShooter.regX = 56
        this.peaShooter.regY = 40
        window.stage.getChildByName("gameContainer").addChild(this.peaShooter)
        this.attackRange = 700
        this.waitAttack = 0
        // 血量监测
        this.peaShooter.addEventListener("tick", this.tick.bind(this))
    }
    bloodJ() {
        // 不动作
    }

    attack() {
        // 不动作
    }

    tick() {
        // 不动作
    }

    startBomb() {
        // 爆炸
        this.peaShooter.gotoAndPlay("boom")
        setTimeout(function () {
            // 在该位置生成一张图片
            var img = new createjs.Bitmap(window.loader.getResult("CherryBombBoom"))
            img.x = this.peaShooter.x - 100
            img.y = this.peaShooter.y - 100
            window.stage.getChildByName("gameContainer").addChild(img)
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
            setTimeout(function () {
                // 删除图片
                window.stage.getChildByName("gameContainer").removeChild(img)
            }, 1000)

        }.bind(this), 500)

        // 告诉附近的僵尸爆炸
        window.zombieList.forEach(e => {
            if (Math.abs(e.zombie.x - this.peaShooter.x) < 200) {

                (function (item) {
                    setTimeout(function () {

                        e.boom();

                        setTimeout(function () {
                            window.stage.getChildByName("gameContainer").removeChild(item.zombie)
                            window.zombieList.splice(window.zombieList.indexOf(item), 1)
                        }, 2000)

                    }, 1000)
                })(e)



            }
        });
    }
}




class CherryBombCard {
    constructor(x, y) {
        this.__plantInHand__ = false;
        this.waitTime = 0
        this.__init__(x, y)
    }

    __init__(x, y) {
        // 生成卡片
        var card = new createjs.Bitmap(window.loader.getResult("CherryBombCard"))
        card.x = x
        card.y = y
        card.name = "CherryBombCard"
        window.stage.getChildByName("uiContainer").addChild(card)

        // 卡片点击事件
        card.addEventListener("click", this.click.bind(this))
        card.addEventListener("tick", this.tick.bind(this))

        console.log(window.gameData.land)
        this.card = card
    }

    tick() {
        if (window.gameData.sun >= 50 && this.waitTime <= 0) {
            window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").addEventListener('click', this.click.bind(this))
            window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").alpha = 1
            //console.log("可以点击")
        } else {
            if (window.gameData.sun < 50) {

                window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").removeEventListener('click', this.click.bind(this))
                window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").alpha = 0.5
            }

        }
    }

    click(e) {

        if (this.__plantInHand__) {
            // 删除射手
            window.stage.getChildByName("gameContainer").removeChild(this.peaShooter.peaShooter)
            this.__plantInHand__ = false
            // 删除虚拟射手
            window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower"))
        } else {
            // 生成射手,并跟随鼠标
            var PeaShooterInHand = new CherryBomb(e.stageX, e.stageY)
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
            if (window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower")) {
                window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower").x = minLand.center.x
                window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower").y = minLand.center.y
            } else {
                // 生成一个新的射手，但是半透明
                var vituralPeaShooter = new CherryBomb(minLand.center.x, minLand.center.y)
                vituralPeaShooter.peaShooter.alpha = 0.5
                vituralPeaShooter.peaShooter.name = "vituralSunFlower"
                window.stage.getChildByName("gameContainer").addChild(vituralPeaShooter.peaShooter)

                vituralPeaShooter.peaShooter.addEventListener('click', this.plantPlant.bind(this))
            }
        } else {
            window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralPeaShooter"))
        }



    }

    plantPlant() {
        // 种植物
        // 在指定位置生成一个豌豆射手
        var peaShooter = new CherryBomb(window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower").x, window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower").y)
        window.stage.getChildByName("gameContainer").addChild(peaShooter.peaShooter)
        // 删除虚拟射手
        window.stage.getChildByName("gameContainer").removeChild(window.stage.getChildByName("gameContainer").getChildByName("vituralSunFlower"))
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

        peaShooter.startBomb();

        window.gameData.sun -= 50
        window.stage.getChildByName("uiContainer").getChildByName("sunNumber").text = window.gameData.sun
        // 禁用卡片
        window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").removeAllEventListeners()
        window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").addEventListener('tick', this.tick.bind(this))
        window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").alpha = 0.5
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
                    window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").addEventListener('click', this.click.bind(this))
                    window.stage.getChildByName("uiContainer").getChildByName("CherryBombCard").alpha = 1
                }
                this.waitTime = 0
            }

        }.bind(this), 600)

    }
}

export { CherryBombCard }