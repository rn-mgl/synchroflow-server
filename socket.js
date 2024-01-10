const socketEmits = (socket) => {
  socket.emit("hello", { id: socket.id });
};

const socketOns = (socket) => {
  socket.on("connect to uuid", (args) => {
    socket.join(args?.uuid);
  });
};

export const sockets = (socket) => {
  console.log(socket.id);

  socketEmits(socket);

  socketOns(socket);
};
