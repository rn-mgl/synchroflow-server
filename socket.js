export const sockets = (socket) => {
  socket.emit("room_rejoin");

  socket.on("connect_to_uuid", (args) => {
    socket.join(args?.uuid);
  });

  socket.on("rejoin_user_uuid", (args) => {
    if (args.room) {
      socket.join(args.room);
      console.log(socket.rooms);
    }
  });

  socket.on("associate_invite", (args) => {
    socket.to(args.room).emit("update_associate_invite");
  });

  socket.on("disconnect_associate", (args) => {
    socket.to(args.room).emit("update_associates");
  });

  socket.on("remove_associate_invite", (args) => {
    socket.to(args.room).emit("remove_associate_invite", { args });
  });

  socket.on("accept_associate_invite", (args) => {
    socket.to(args.room).emit("update_associates");
  });
};
