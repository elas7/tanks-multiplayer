(function() {
    'use strict';

    var ns = window['tanks'];

    window['game'] = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    game.state.add('boot', ns.Boot);
    game.state.add('game', ns.Game);

    window['tanks'].startGame = function() {
        console.log('starting game');
        game.state.start('boot');
    };

}());