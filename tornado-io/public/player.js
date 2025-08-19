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

    ctx.save();
    const gradient = ctx.createRadialGradient(
      x - this.radius / 3,
      y - this.radius / 3,
      this.radius / 10,
      x,
      y,
      this.radius
    );
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, x, y - this.radius - 10);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TornadoPlayer;
} else {
  window.TornadoPlayer = TornadoPlayer;
}
