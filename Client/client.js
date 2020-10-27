//const { write } = require("fs");

let socket = new WebSocket('ws://'+window.location.hostname+':8080/');//'+window.location.host+'/'//new WebSocket("wss://javascript.info/article/websocket/demo/hello");
//let socket = new WebSocket('ws:///');

socket.onopen = function(e) {
  socket.send("My name is John");
};

socket.onmessage = function(event) {
   //"[message] Data received from server: ${event.data}";
   Write(event.data);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    Write(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    Write('[close] Connection died');
  }
};

socket.onerror = function(error) {
    Write(`[error] ${error.message}`);
};

function TalkToServer()
{
    let input = document.getElementById("userinput").value;
    document.getElementById("userinput").value = "";
    socket.send(input);
}

function Write(str)
{
    var li = document.createElement('li');
    li.innerText = str;
    document.getElementById("chat").appendChild(li);
}