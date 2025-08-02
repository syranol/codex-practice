const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const TICK_RATE = 1000 / 30;
const WORLD_SIZE = 2000;
const MAX_PLAYERS = 10;
const DEBRIS_COUNT = 100;

const players = {};
const debris = [];

function randomName() {
  const adjectives = ['Stormy', 'Whirling', 'Gusty', 'Blustery', 'Roaring'];
  const nouns = ['Tiger', 'Hawk', 'Eagle', 'Panther', 'Dragon'];
  const num = Math.floor(Math.random() * 100);
  return `${adjectives[Math.floor(Math.random()*adjectives.length)]}${nouns[Math.floor(Math.random()*nouns.length)]}${num}`;
}

function randomColor() {
  const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRadius(mass) {
  return Math.sqrt(mass) * 5;
}

function spawnPlayer(id) {
  const mass = 10;
  return {
    id,
    x: Math.random() * WORLD_SIZE,
    y: Math.random() * WORLD_SIZE,
    mass,
    radius: getRadius(mass),
    color: randomColor(),
    name: randomName(),
    dir: { x: 0, y: 0 }
  };
}

function spawnDebris() {
  for (let i = 0; i < DEBRIS_COUNT; i++) {
    debris.push({ id: i, x: Math.random() * WORLD_SIZE, y: Math.random() * WORLD_SIZE, mass: 1 });
  }
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

io.on('connection', socket => {
  if (Object.keys(players).length >= MAX_PLAYERS) {
    socket.emit('full');
    socket.disconnect();
    return;
  }
  const player = spawnPlayer(socket.id);
  players[socket.id] = player;
  socket.emit('init', { id: socket.id });

  socket.on('move', dir => {
    if (!player) return;
    player.dir = dir || { x: 0, y: 0 };
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

function gameLoop() {
  // move players
  Object.values(players).forEach(p => {
    const speed = 3 / Math.sqrt(p.mass);
    const length = Math.hypot(p.dir.x, p.dir.y) || 1;
    p.x += (p.dir.x / length) * speed;
    p.y += (p.dir.y / length) * speed;
    p.x = Math.max(0, Math.min(WORLD_SIZE, p.x));
    p.y = Math.max(0, Math.min(WORLD_SIZE, p.y));
  });

  // collisions with debris
  debris.forEach(d => {
    Object.values(players).forEach(p => {
      if (distance(p, d) < p.radius) {
        p.mass += d.mass;
        p.radius = getRadius(p.mass);
        d.x = Math.random() * WORLD_SIZE;
        d.y = Math.random() * WORLD_SIZE;
      }
    });
  });

  // player vs player
  const ids = Object.keys(players);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const p1 = players[ids[i]];
      const p2 = players[ids[j]];
      const dist = distance(p1, p2);
      if (dist < p1.radius && p1.mass > p2.mass) {
        p1.mass += p2.mass;
        p1.radius = getRadius(p1.mass);
        io.to(p2.id).emit('dead');
        delete players[p2.id];
      } else if (dist < p2.radius && p2.mass > p1.mass) {
        p2.mass += p1.mass;
        p2.radius = getRadius(p2.mass);
        io.to(p1.id).emit('dead');
        delete players[p1.id];
      }
    }
  }

  io.sockets.emit('state', { players: Object.values(players), debris });
}

function init() {
  spawnDebris();
  setInterval(gameLoop, TICK_RATE);
  return http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  init();
}

module.exports = {
  app,
  init,
  randomName,
  randomColor,
  getRadius,
  spawnPlayer,
  distance,
  WORLD_SIZE
};
