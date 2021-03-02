const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var nicknames      = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });



  socket.on('nickname', function (data, callback) {
    if (nicknames.indexOf(data) != -1 ){
      callback(false);
    } else {
      callback(true);
      nicknames.push(data);
      socket.nickname = data;
      io.sockets.emit('nicknames', nicknames);
      console.log('Los usuarios conectados son: ' + nicknames);
    }
  });

  socket.on('disconnect', () => {
    if (!socket.nickname)
      return;
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
    }
    console.log('Los usuarios conectados son: ' + nicknames);
  });


 

  socket.on('user mensaje', (msg) => {
    io.emit('user mensaje', {
      nick: socket.nickname,
      message: msg.msg,
      color: msg.color,
      negrita: msg.negrita
    });
  });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});



