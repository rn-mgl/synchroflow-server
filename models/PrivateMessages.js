import conn from "../db/connection";

export class PrivateMessages {
  constructor(
    private_message_room_id,
    private_message_from,
    private_message_to,
    private_message,
    private_message_file
  ) {
    this.private_message_room_id = private_message_room_id;
    this.private_message_from = private_message_from;
    this.private_message_to = private_message_to;
    this.private_message = private_message;
    this.private_message_file = private_message_file;
  }

  async createPrivateMessage() {
    try {
      const sql = `INSERT INTO private_messages
                     (
                        private_message_room_id,
                        private_message_from,
                        private_message_to,
                        private_message,
                        private_message_file
                     ) VALUES (?, ?, ?, ?, ?);`;
      const privateMessageValues = [
        this.private_message_room_id,
        this.private_message_from,
        this.private_message_to,
        this.private_message,
        this.private_message_file,
      ];
      const [data, _] = await conn.execute(sql, privateMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message ---");
    }
  }

  static async deletePrivateMessage(selector, value) {
    try {
      const sql = `DELETE FROM private_messages
                    WHERE ${selector} = ?;`;
      const privateMessageValues = [value];
      const [data, _] = await conn.execute(sql, privateMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message ---");
    }
  }

  static async getAllPrivateMessages(selector, value) {
    try {
      const sql = `SELECT * FROM private_messages
                    WHERE ${selector} = ?;`;
      const privateMessageValues = [value];
      const [data, _] = await conn.execute(sql, privateMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all private messages ---");
    }
  }
}
