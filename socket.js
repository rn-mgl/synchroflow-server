export const sockets = (socket) => {
  // initializer
  socket.emit("room_rejoin");

  socket.on("connect_to_uuid", (args) => {
    socket.join(args?.uuid);
  });

  socket.on("rejoin_user_uuid", (args) => {
    if (args.room) {
      socket.join(args?.room);
      console.log(socket.rooms);
    }
  });

  // associates

  socket.on("associate_invite", (args) => {
    socket.to(args.room).emit("update_associate_invite");
  });

  socket.on("disconnect_associate", (args) => {
    socket.to(args.room).emit("update_associates");
  });

  // invites

  socket.on("remove_associate_invite", (args) => {
    socket.to(args.room).emit("remove_associate_invite", { args });
  });

  socket.on("accept_associate_invite", (args) => {
    socket.to(args.room).emit("update_associates");
  });

  // messages

  socket.on("send_message", (args) => {
    args.rooms.map((room) => {
      socket.to(room).emit("get_messages", { room });
    });
  });

  // group members
  socket.on("add_group_member", (args) => {
    socket.to(args.room).emit("get_group_rooms");
  });

  socket.on("remove_group_member", (args) => {
    console.log(args);
    socket.to(args.room).emit("reflect_remove_group_member", { room: args.room });
  });
};
