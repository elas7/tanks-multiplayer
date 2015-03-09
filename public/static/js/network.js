(function ($) {

    var socket = io();
    var room = location.pathname.split('/').pop();

    socket.on('created', function(room) {
        console.log('created room', room);
        isInitiator = true;
    });

    socket.on('joined', function(room) {
        console.log('joined room', room);
        connect();
    });

    socket.on('join', function (room){
        console.log('Another peer joined our room ' + room);
        connect();
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

}(jQuery));


