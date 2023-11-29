import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class PrivateMessages {
  constructor(
    private_message_uuid,
    private_message_room_id,
    private_message_from,
    private_message_to,
    private_message,
    private_message_file
  ) {
    this.private_message_uuid = private_message_uuid;
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
                        private_message_uuid,
                        private_message_room_id,
                        private_message_from,
                        private_message_to,
                        private_message,
                        private_message_file
                     ) VALUES (?, ?, ?, ?, ?, ?);`;
      const privateMessageValues = [
        this.private_message_uuid,
        this.private_message_room_id,
        this.private_message_from,
        this.private_message_to,
        this.private_message,
        this.private_message_file,
      ];
      const [data, _] = await conn.query(sql, privateMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message ---");
    }
  }

  static async deletePrivateMessage(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `UPDATE private_messages SET private_message_is_deleted = ?
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message ---");
    }
  }

  static async getAllPrivateMessages(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_messages
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all private messages ---");
    }
  }

  static async getPrivateMessage(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_messages
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message ---");
    }
  }
}
