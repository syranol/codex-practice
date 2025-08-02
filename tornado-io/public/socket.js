const socket = io();
let myId = null;

socket.on('init', data => {
  myId = data.id;
});

socket.on('state', state => {
  if (window.updateState) {
    window.updateState(state);
  }
});

socket.on('dead', () => {
  alert('You were absorbed!');
  location.reload();
});

function sendMove(vec) {
  socket.emit('move', vec);
}

window.network = { sendMove, getId: () => myId };
