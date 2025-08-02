const TornadoPlayer = require('../public/player.js');

describe('TornadoPlayer component', () => {
  test('grow increases mass and radius', () => {
    const player = new TornadoPlayer({
      id: '1', x: 0, y: 0, mass: 10, radius: Math.sqrt(10) * 5, color: '#fff', name: 'Test'
    });
    const oldRadius = player.radius;
    player.grow(15);
    expect(player.mass).toBe(25);
    expect(player.radius).toBeCloseTo(Math.sqrt(25) * 5);
    expect(player.radius).toBeGreaterThan(oldRadius);
  });
});
