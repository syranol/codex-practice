let players = {};
let debris = [];
let localId = null;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

window.updateState = function(state) {
  players = {};
  state.players.forEach(p => {
    players[p.id] = new TornadoPlayer(p);
  });
  debris = state.debris;
  if (!localId) localId = network.getId();
};

function updateLeaderboard() {
  const lb = document.getElementById('leaderboard');
  const top = Object.values(players).sort((a, b) => b.mass - a.mass).slice(0, 5);
  lb.innerHTML = '<strong>Leaderboard</strong><br>' + top.map(p => `${p.name}: ${Math.floor(p.mass)}`).join('<br>');
}

let lastTime = performance.now();
function updateFPS() {
  const now = performance.now();
  const fps = Math.round(1000 / (now - lastTime));
  lastTime = now;
  document.getElementById('fps').textContent = `FPS: ${fps}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const me = players[localId];
  if (me) {
    const camera = { x: me.x, y: me.y };

    debris.forEach(d => {
      const x = d.x - camera.x + canvas.width / 2;
      const y = d.y - camera.y + canvas.height / 2;
      ctx.save();
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#555';
      ctx.stroke();
      ctx.restore();
    });

    Object.values(players).forEach(p => {
      p.render(ctx, camera, canvas);
    });

    updateLeaderboard();
    updateFPS();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

let target = null;
function setTarget(x, y) {
  target = { x, y };
}

canvas.addEventListener('mousemove', e => {
  setTarget(e.clientX, e.clientY);
});

function handleTouch(e) {
  e.preventDefault();
  const t = e.touches[0];
  setTarget(t.clientX, t.clientY);
}
canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });

setInterval(() => {
  if (!target || !players[localId]) return;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dir = { x: target.x - centerX, y: target.y - centerY };
  network.sendMove(dir);
}, 33);
