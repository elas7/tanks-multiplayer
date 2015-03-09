(function() {
    'use strict';

    var Tank = function (index, game, player) {

        this.cursor = {
            left:false,
            right:false,
            up:false,
            fire:false
        };

        this.input = {
            left:false,
            right:false,
            up:false,
            fire:false
        };

        var x = 0;
        var y = 0;

        this.game = game;
        this.health = 30;
        this.player = player;
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(100, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        this.fireRate = 1000;
        this.nextFire = 0;
        this.alive = true;
        this.currentSpeed =0;

        this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
        this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
        this.turret = game.add.sprite(x, y, 'enemy', 'turret');

        this.shadow.anchor.set(0.5);
        this.tank.anchor.set(0.5);
        this.turret.anchor.set(0.3, 0.5);

        this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

        this.tank.id = index;
        game.physics.enable(this.tank, Phaser.Physics.ARCADE);
        this.tank.body.immovable = false;
        this.tank.body.collideWorldBounds = true;
        this.tank.body.bounce.setTo(1, 1);

        this.tank.angle = 0;

        game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);

    };

    Tank.prototype.damage = function() {

        this.health -= 1;
        if (this.health <= 0)
        {
            this.kill();
            return true;
        }
        return false;

    };

    Tank.prototype.update = function() {

        this.shadow.x = this.tank.x;
        this.shadow.y = this.tank.y;
        this.shadow.rotation = this.tank.rotation;

        this.turret.x = this.tank.x;
        this.turret.y = this.tank.y;

        for (var i in this.input) {
            this.cursor[i] = this.input[i];
        }

        if (this.cursor.left)
        {
            this.tank.angle -= 4;
        }
        else if (this.cursor.right)
        {
            this.tank.angle += 4;
        }
        if (this.cursor.up)
        {
            //  The speed we'll travel at
            this.currentSpeed = 300;
            this.tank.animations.play('move');
        }
        else
        {
            if (this.currentSpeed > 0)
            {
                this.currentSpeed -= 4;
            }
            // Disable animation if the the tank is about to stop
            if (this.currentSpeed < 10) {
                this.tank.animations.stop();
            }
        }
        if (this.cursor.fire)
        {
            this.fire({x:this.cursor.tx, y:this.cursor.ty});
        }

        if (this.currentSpeed > 0)
        {
            game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
        }
        //else
        //{
        //    game.physics.arcade.velocityFromRotation(this.tank.rotation, 0, this.tank.body.velocity);
        //}

    };

    Tank.prototype.fire = function(target) {
        if (!this.alive) return;
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, 500);
        }
    };

    Tank.prototype.kill = function() {
        this.alive = false;
        this.tank.kill();
        this.turret.kill();
        this.shadow.kill();
    };

    window['tanks'] = window['tanks'] || {};
    window['tanks'].Tank = Tank;

}());