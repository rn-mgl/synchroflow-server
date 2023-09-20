import conn from "../db/connection.js";

export class PrivateMessageRooms {
  constructor(private_message_room) {
    this.private_message_room = private_message_room;
  }

  async createPrivateMessageRoom() {
    try {
      const sql = `INSERT INTO private_message_rooms
                    (
                        private_message_room
                    ) VALUES (?);`;
      const privateMessageRoomValues = [this.private_message_room];
      const [data, _] = await conn.query(sql, privateMessageRoomValues);
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
      const [data, _] = await conn.query(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message room ---");
    }
  }

  static async getAllPrivateMessageRooms(selector, value) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr
                    INNER JOIN private_message_members AS pmm
                    ON pmr.private_message_room_id = pmm.private_message_room_id
                    WHERE ${selector} = ?;`;
      const privateMessageRoomValues = [value];
      const [data, _] = await conn.query(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all private message room ---");
    }
  }

  static async getPrivateMessageRoom(selector, value) {
    try {
      const sql = `SELECT * FROM private_message_rooms
                    WHERE ${selector} = ?;`;
      const privateMessageRoomValues = [value];
      const [data, _] = await conn.query(sql, privateMessageRoomValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message room ---");
    }
  }
}
