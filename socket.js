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
  socket.on("accept_associate_invite", (args) => {
    socket.to(args.room).emit("update_associates");
  });

  socket.on("remove_associate_invite", (args) => {
    socket.to(args.room).emit("reflect_remove_associate_invite", { args });
  });

  socket.on("accept_task_invite", (args) => {
    socket.to(args.invitedRoom).to(args.fromRoom).emit("reflect_remove_task_invite", { args });
    socket.to(args.invitedRoom).to(args.fromRoom).emit("update_tasks", { args });
  });

  socket.on("remove_task_invite", (args) => {
    socket.to(args.invitedRoom).to(args.fromRoom).emit("reflect_remove_task_invite", { args });
    socket.to(args.invitedRoom).to(args.fromRoom).emit("update_tasks", { args });
  });

  socket.on("send_main_task_invite", (args) => {
    args.rooms.map((room) => {
      socket.to(room).emit("reflect_send_main_task_invite");
    });
  });

  // messages
  socket.on("send_message", (args) => {
    args.rooms.map((room) => {
      socket.to(room).emit("get_messages", { room });
    });
  });

  //group
  socket.on("remove_group_member", (args) => {
    socket.to(args.room).emit("reflect_remove_group_member", { room: args.room });
  });

  socket.on("delete_group_room", (args) => {
    args.rooms.map((room) => {
      socket.to(room).emit("reflect_delete_group_room");
    });
  });

  // group members
  socket.on("add_group_member", (args) => {
    socket.to(args.room).emit("reflect_add_group_member");
  });

  socket.on("update_group_room", (args) => {
    args.rooms.map((room) => {
      socket.to(room).emit("reflect_update_group_room");
    });
  });
};
