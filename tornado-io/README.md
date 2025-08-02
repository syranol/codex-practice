# Tornado.io

Real-time multiplayer game where you control a growing tornado. Built with Node.js, socket.io, and HTML5 Canvas.

## Setup

```bash
npm install
npm start
```

Open <http://localhost:3000> in your browser.

## How to Play

- **Desktop**: Move your mouse to steer your tornado.
- **Mobile**: Drag on the screen to control direction.
- Absorb debris and smaller tornadoes to grow. Larger tornadoes move slower.

## File Overview

- `server.js` - Express server and game logic.
- `public/index.html` - Game client and instructions.
- `public/style.css` - Styles for canvas and HUD.
- `public/socket.js` - Handles socket.io communication.
- `public/player.js` - TornadoPlayer class for rendering.
- `public/game.js` - Canvas rendering and game logic.

## Future Improvements

- Custom tornado skins
- Powerups
- Sound effects
- Game-over menu and restart logic
