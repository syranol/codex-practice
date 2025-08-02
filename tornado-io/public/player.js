class TornadoPlayer {
  constructor({ id, x, y, mass, radius, color, name }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.mass = mass;
    this.radius = radius;
    this.color = color;
    this.name = name;
  }

  grow(amount) {
    this.mass += amount;
    this.radius = Math.sqrt(this.mass) * 5;
  }

  render(ctx, camera, canvas) {
    const x = this.x - camera.x + canvas.width / 2;
    const y = this.y - camera.y + canvas.height / 2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x, y - this.radius - 10);
  }
}

window.TornadoPlayer = TornadoPlayer;
