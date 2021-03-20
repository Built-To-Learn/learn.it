const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
//module.exports = app;

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());

//use ejs renderer in order to pass data html files
app.engine('html', require('ejs').renderFile);

// auth and api routes
app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

const githubURL = process.env.GITHUB_CLIENT_ID
  ? `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  : null;

app.get('/', (req, res) =>
  res.render(path.join(__dirname, '..', 'public/index.html'), { githubURL })
);

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use('*', (req, res) => {
  res.render(path.join(__dirname, '..', 'public/index.html'), { githubURL });
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer);

module.exports = httpServer;

let broadcaster;
roomManager = {};
io.sockets.on('error', (e) => console.log(e));
io.sockets.on('connection', (socket) => {
  socket.on('broadcaster', (room) => {
    broadcaster = socket.id;
    if (!roomManager[room]) {
      console.log('setting boradcaster');
      roomManager[room] = socket.id;
      socket.join(room);
      socket.to(room).emit('broadcaster');
    }
  });
  socket.on('watcher', (room, name) => {
    socket.join(room);
    if (roomManager[room]) {
      socket.to(roomManager[room]).emit('watcher', socket.id, name);
    }
  });
  socket.on('offer', (id, message) => {
    socket.to(id).emit('offer', socket.id, message);
  });
  socket.on('answer', (id, message) => {
    socket.to(id).emit('answer', socket.id, message);
  });
  socket.on('candidate', (id, message) => {
    socket.to(id).emit('candidate', socket.id, message);
  });
  socket.on('disconnect', () => {
    const values = Object.values(roomManager);
    if (values.includes(socket.id)) {
      const idx = values.indexOf(socket.id);
      const keys = Object.keys(roomManager);
      console.log('deleting manager');
      // keys[idx] is the room
      delete roomManager[keys[idx]];
    }
    socket.broadcast.emit('disconnectPeer', socket.id);
  });
  socket.on('renew', (room) => {
    socket.to(room).emit('broadcaster');
  });

  socket.on('breakout_broadcaster', (id, type, room) => {
    socket.join(room);
    socket.to(room).emit('breakout_broadcaster', socket.id, type);
  });

  socket.on('breakout_offer', (id, message, type) => {
    console.log('offer', id);
    socket.to(id).emit('breakout_offer', socket.id, message, type);
  });
  socket.on('breakout_answer', (id, message) => {
    socket.to(id).emit('breakout_answer', socket.id, message);
  });
  socket.on('breakout_candidate', (id, message) => {
    console.log('candidate', id);
    socket.to(id).emit('breakout_candidate', socket.id, message);
  });

  socket.on('breakout_disconnected', (room) => {
    console.log('breakout disconnect hit');
    socket.to(room).emit('breakout_disconnectPeer', socket.id);
    socket.leave(room);
  });

  socket.on('breakout', (room, rooms) => {
    Object.keys(rooms).forEach((key) => {
      socket.to(key).emit('joinBreakout', `${room}-${rooms[key].group}`);
    });
  });

  socket.on('breakout_returnToMain', (room) => {
    const mainRoom = room.slice(0, room.lastIndexOf('-'));
    console.log('mainRoom', mainRoom);
    for (let i = 1; i <= 3; i++) {
      socket.to(`${mainRoom}-${i}`).emit('breakout_returnToMain', mainRoom);
    }
  });

  socket.on('joinChat', (room) => {
    socket.join(room);
  });
  socket.on('newMessage', (message, room) => {
    console.log(message, room);
    socket.to(room).emit('newMessage', message);
  });
});
