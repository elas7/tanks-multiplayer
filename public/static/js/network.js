(function () {

    var socket = io();
    var room = location.pathname.split('/').pop();

    // on creating room, set ID and start game
    socket.on('created', function(message) {
        console.log('created room', message['room']);
        console.log('Your id is', message['id']);
        window['tanks']['myId'] = message['id'];
        window['tanks'].startGame();
    });

    // on joining a room, set ID and start game
    socket.on('joined', function(message) {
        console.log('joined room', message['room']);
        console.log('Your id is ', message['id']);
        window['tanks']['myId'] = message['id'];
        window['tanks'].startGame();
    });

    socket.on('join', function (message){
        console.log('Another peer joined our room ' + message['room']);
    });

    socket.on('enemy data', function (data){
        console.log('Received enemy data');
        window['tanks'].Game.prototype.spawnEnemies(data);
    });

    socket.on('message', function(message) {
        console.log('message from peer:', message);
        if (message.type === 'offer') {
            // set remote description and answer
            pc.setRemoteDescription(new RTCSessionDescription(message));
            pc.createAnswer(gotDescription, handleError);
        } else if (message.type === 'answer') {
            // set remote description
            pc.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate') {
            // add ice candidate
            pc.addIceCandidate(
                new RTCIceCandidate({
                    sdpMLineIndex: message.mlineindex,
                    candidate: message.candidate
                })
            );
        }
    });

    function sendMessage(message){
        console.log('sending message: ', message);
        socket.emit('message', room, message);
    }

    window['tanks'].requestEnemyData = function() {
        console.log('request enemy data for room', room);
        socket.emit('request enemy data', room);
    };

    window['tanks'].handleInput = function(input) {
        console.log('handle input');
        socket.emit('handle input', room, input);
    };


    // connect to room based on URL
    console.log('Joining with key:', room);
    socket.emit('create or join', room);

}());


