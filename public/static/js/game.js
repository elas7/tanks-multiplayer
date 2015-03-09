(function() {
    'use strict';

    var EnemyTank = window['tanks'].EnemyTank;

    var land;

    var shadow;
    var tank;
    var turret;

    var enemies;
    var enemyBullets;
    var enemiesTotal = 0;
    var enemiesAlive = 0;
    var explosions;

    var logo;

    var currentSpeed = 0;
    var cursors;

    var bullets;
    var fireRate = 100;
    var nextFire = 0;

    var Game = function () {};

    Game.prototype.create = function () {

        //  Resize our game world to be a 2000 x 2000 square
        game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        land = game.add.tileSprite(0, 0, 800, 600, 'earth');
        land.fixedToCamera = true;

        //  The base of our tank
        tank = game.add.sprite(0, 0, 'tank', 'tank1');
        tank.anchor.setTo(0.5, 0.5);
        tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

        //  This will force it to decelerate and limit its speed
        game.physics.enable(tank, Phaser.Physics.ARCADE);
        tank.body.drag.set(0.2);
        tank.body.maxVelocity.setTo(400, 400);
        tank.body.collideWorldBounds = true;

        //  Finally the turret that we place on-top of the tank body
        turret = game.add.sprite(0, 0, 'tank', 'turret');
        turret.anchor.setTo(0.3, 0.5);

        //  The enemies bullet group
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(100, 'bullet');

        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 0.5);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  Create some baddies to waste :)
        enemies = [];

        enemiesTotal = 20;
        enemiesAlive = 20;

        for (var i = 0; i < enemiesTotal; i++)
        {
            enemies.push(new EnemyTank(i, game, tank, enemyBullets));
        }

        //  A shadow below our tank
        shadow = game.add.sprite(0, 0, 'tank', 'shadow');
        shadow.anchor.setTo(0.5, 0.5);

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

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

        game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

        enemiesAlive = 0;

        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].alive)
            {
                enemiesAlive++;
                game.physics.arcade.collide(tank, enemies[i].tank);
                game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }

        if (cursors.left.isDown)
        {
            tank.angle -= 4;
        }
        else if (cursors.right.isDown)
        {
            tank.angle += 4;
        }

        if (cursors.up.isDown)
        {
            //  The speed we'll travel at
            currentSpeed = 300;
        }
        else
        {
            if (currentSpeed > 0)
            {
                currentSpeed -= 4;
            }
        }

        if (currentSpeed > 0)
        {
            game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
        }

        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

        //  Position all the parts and align rotations
        shadow.x = tank.x;
        shadow.y = tank.y;
        shadow.rotation = tank.rotation;

        turret.x = tank.x;
        turret.y = tank.y;

        turret.rotation = game.physics.arcade.angleToPointer(turret);

        if (game.input.activePointer.isDown)
        {
            //  Boom!
            fire();
        }

    };

    function bulletHitPlayer (tank, bullet) {

        bullet.kill();

    }

    function bulletHitEnemy (tank, bullet) {

        bullet.kill();

        var destroyed = enemies[tank.name].damage();

        if (destroyed)
        {
            var explosionAnimation = explosions.getFirstExists(false);
            explosionAnimation.reset(tank.x, tank.y);
            explosionAnimation.play('kaboom', 30, false, true);
        }

    }

    function fire () {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstExists(false);

            bullet.reset(turret.x, turret.y);

            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
        }

    }

    Game.prototype.render = function () {

        // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
        game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

    };

    window['tanks'] = window['tanks'] || {};
    window['tanks'].Game = Game;

}());