import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class PrivateMessages {
  constructor(message_uuid, message_room_fk_id, message_from, message_to, message, message_file, message_file_type) {
    this.message_uuid = message_uuid;
    this.message_room_fk_id = message_room_fk_id;
    this.message_from = message_from;
    this.message_to = message_to;
    this.message = message;
    this.message_file = message_file;
    this.message_file_type = message_file_type;
  }

  async createPrivateMessage() {
    try {
      const sql = `INSERT INTO private_messages
                     (
                        message_uuid,
                        message_room_fk_id,
                        message_from,
                        message_to,
                        message,
                        message_file,
                        message_file_type
                     ) VALUES (?, ?, ?, ?, ?, ?, ?);`;
      const privateMessageValues = [
        this.message_uuid,
        this.message_room_fk_id,
        this.message_from,
        this.message_to,
        this.message,
        this.message_file,
        this.message_file_type,
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

  static async getLatestPrivateMessage(messageRoomID) {
    try {
      const sql = `SELECT * FROM private_messages AS pm

                    INNER JOIN private_message_rooms AS pmr
                    ON pmr.message_room_id = pm.message_room_fk_id

                    WHERE message_room_fk_id = '${messageRoomID}'
                    AND pm.message_id = (
                      SELECT MAX(pm2.message_id) FROM private_messages AS pm2
                      WHERE pm2.message_room_fk_id = '${messageRoomID}'
                    );`;

      const [data, _] = await conn.execute(sql);
      return data[0];
    } catch (error) {
      console.log(error + "--- get latest private message ---");
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
