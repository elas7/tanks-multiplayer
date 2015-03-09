(function() {
    'use strict';

    var Tank = window['tanks'].Tank;

    var myId;

    var land;

    var shadow;
    var tank;
    var turret;

    var enemyBullets;
    var explosions;

    var logo;

    var cursors;

    var bullets;

    var player;
    var tanksList;

    var Game = function () {};

    Game.prototype.create = function () {

        //  Resize our game world to be a 2000 x 2000 square
        game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        land = game.add.tileSprite(0, 0, 800, 600, 'earth');
        land.fixedToCamera = true;

        myId = window['tanks'].myId;
        tanksList = {};
        player = new Tank(myId, game, tank);

        tanksList[myId] = player;

        window['tanks'].requestEnemyData();

        tank = player.tank;
        turret = player.turret;
        shadow = player.shadow;
        bullets = player.bullets;

        //  Explosion pool
        explosions = game.add.group();

        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }

        tank.bringToTop();
        turret.bringToTop();

        logo = game.add.sprite(0, 200, 'logo');
        logo.fixedToCamera = true;

        game.input.onDown.add(removeLogo, this);

        game.camera.follow(tank);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);

        cursors = game.input.keyboard.createCursorKeys();

    };

    function removeLogo () {

        game.input.onDown.remove(removeLogo, this);
        logo.kill();

    }

    Game.prototype.update = function() {

        // Added this because sometimes a spawned tank appears over the logo
        logo.bringToTop();

        player.input.left = cursors.left.isDown;
        player.input.right = cursors.right.isDown;
        player.input.up = cursors.up.isDown;
        player.input.fire = game.input.activePointer.isDown;
        player.input.tx = game.input.x+ game.camera.x;
        player.input.ty = game.input.y+ game.camera.y;

        player.turret.rotation = this.game.physics.arcade.angleToPointer(player.tank);

        game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

        for (var i in tanksList) {
            if (!tanksList[i]) {
                continue;
            }
            var curBullets = tanksList[i].bullets;
            var curTank = tanksList[i].tank;
            for (var j in tanksList) {
                if (!tanksList[j]) {
                    continue;
                }
                if (j!=i) {
                    var targetTank = tanksList[j].tank;
                    game.physics.arcade.overlap(curBullets, targetTank, bulletHitPlayer, null, this);

                }
                if (tanksList[j].alive) {
                    tanksList[j].update();
                }
            }
        }

    };

    function bulletHitPlayer (tank, bullet) {

        bullet.kill();

    }

    Game.prototype.render = function () {

        // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
        //game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

    };

    Game.prototype.spawnEnemies = function (arrayOfEnemies) {
        console.log('enemies', arrayOfEnemies);
        arrayOfEnemies.forEach(function(enemy) {
            // add if enemy is not already on tanksList
            if (!(enemy in tanksList)) {
                tanksList[enemy] = new Tank(enemy, game, tank);
            }
        });
        console.log('tanklist', tanksList)
    };

    window['tanks'] = window['tanks'] || {};
    window['tanks'].Game = Game;

}());