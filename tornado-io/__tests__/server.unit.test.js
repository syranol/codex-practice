const { getRadius, distance, spawnPlayer, randomColor, WORLD_SIZE } = require('../server');

describe('server utility functions', () => {
  test('getRadius computes sqrt(mass)*5', () => {
    expect(getRadius(25)).toBe(25);
  });

  test('distance computes Euclidean distance', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 3, y: 4 };
    expect(distance(a, b)).toBe(5);
  });

  test('spawnPlayer generates player within world bounds', () => {
    const player = spawnPlayer('test');
    expect(player.id).toBe('test');
    expect(player.mass).toBe(10);
    expect(player.radius).toBe(getRadius(10));
    expect(player.x).toBeGreaterThanOrEqual(0);
    expect(player.x).toBeLessThanOrEqual(WORLD_SIZE);
    expect(player.y).toBeGreaterThanOrEqual(0);
    expect(player.y).toBeLessThanOrEqual(WORLD_SIZE);
  });

  test('randomColor returns valid color', () => {
    const color = randomColor();
    const colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'];
    expect(colors).toContain(color);
  });
});
