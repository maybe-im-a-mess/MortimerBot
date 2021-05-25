var socket = new WebSocket('ws://localhost:8181/', 'chat');
socket.onopen = function () {

    name = "name" + Math.floor(Math.random() * Math.floor(700));

    socket.send('{"type": "join", "name":" ' + name + '"}');
}
$('#sendBtn').on('click', function (e) {
    e.preventDefault();
    msg = $('#msg').val();
    request = $('<div class="chat-bubble-container">' + '<div class="chat-bubble msg-self">' + msg + '</div>' +
        '</div>');
    socket.send('{"type": "msg", "msg": "' + msg + '"}');
    $('#msg').val('');
});
socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    switch (data.type) {
        case 'msg':
            respond = $('<div class="chat-bubble-container">' + '<div class="chat-bubble msg-bot">' + data.msg + '</div>' +
                '</div>');
            if (data.name === "Mortimer") {
                $('#messages').append(respond);
            } else {
                $('#messages').append(request);
            }
            var objDiv = document.getElementById("chatForm");
            objDiv.scrollTop = objDiv.scrollHeight;
            break;
        case 'join':
            $('#users').empty();
            for (var i = 0; i < data.names.length; i++) {
                var user = $('<div>' + data.names[i] + '</div>');
                $('#users').append(user);
            }
            break;
    }
};

