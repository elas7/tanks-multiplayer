(function () {
    'use strict';

    var Boot = function (id) {
        this.id = id;
    };

    Boot.prototype = {

        preload: function () {
            this.load.atlas('tank', 'static/img/tanks.png', 'static/img/tanks.json');
            this.load.atlas('enemy', 'static/img/enemy-tanks.png', 'static/img/tanks.json');
            this.load.image('logo', 'static/img/logo.png');
            this.load.image('bullet', 'static/img/bullet.png');
            this.load.image('earth', 'static/img/scorched_earth.png');
            this.load.spritesheet('kaboom', 'static/img/explosion.png', 64, 64, 23);
        },

        create: function () {
            // Add settings here

            this.game.state.start('game');
        }
    };

    window['tanks'] = window['tanks'] || {};
    window['tanks'].Boot = Boot;

}());

