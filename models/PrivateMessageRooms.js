import conn from "../db/connection";

export class PrivateMessageRooms {
  constructor(private_message_room, member_id) {
    this.private_message_room = private_message_room;
    this.member_id = member_id;
  }

  async createPrivateMessageRoom() {
    try {
      const sql = `INSERT INTO private_message_rooms
                    (
                        private_message_room, 
                        member_id
                    ) VALUES (?, ?);`;
      const privateMessageRoomValues = [this.private_message_room, this.member_id];
      const [data, _] = await conn.execute(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message room ---");
    }
  }

  static async deletePrivateMessageRoom(selector, value) {
    try {
      const sql = `DELETE FROM private_message_rooms
                    WHERE ${selector} = ?;`;
      const privateMessageRoomValues = [value];
      const [data, _] = await conn.execute(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message room ---");
    }
  }
}
