const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  // console.log('new connection');

  socket.on('new user', (user) => {
    const buff = {name: user, since: new Date()};
    users.push(buff);
    io.emit('new user', users);
  });
  socket.on('remove user', (user) => {
    let i = -1;
    users.forEach((user2, index) => {
      if (user2.name === user) {
        i = index;
      }
    });
    if (i !== -1) {
      users.splice(i,1);
    }
    io.emit('new user', users);
  })
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
