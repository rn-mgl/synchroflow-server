const socketEmits = (socket) => {
  socket.emit("room_rejoin");
};

const socketOns = (socket) => {
  socket.on("connect_to_uuid", (args) => {
    socket.join(args?.uuid);
  });

  socket.on("associate_invite", (args) => {
    socket.to(args.room).emit("update_associate_invite");
  });

  socket.on("rejoin_user_uuid", (args) => {
    if (args.room) {
      socket.join(args.room);
    }
  });
};

export const sockets = (socket) => {
  socketOns(socket);
  socketEmits(socket);
};
