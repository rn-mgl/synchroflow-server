import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Messages {
  constructor(
    room_fk_id,
    message_uuid,
    sender,
    message,
    message_file,
    message_file_type,
  ) {
    this.room_fk_id = room_fk_id;
    this.message_uuid = message_uuid;
    this.sender = sender;
    this.message = message;
    this.message_file = message_file;
    this.message_file_type = message_file_type;
  }

  async createMessage() {
    try {
      const sql = `INSERT INTO messages
                     (
                        message_room_fk_id,
                        message_uuid,
                        sender,
                        message,
                        message_file,
                        message_file_type
                     ) VALUES (?, ?, ?, ?, ?, ?)`;
      const messageValues = [
        this.room_fk_id,
        this.message_uuid,
        this.sender,
        this.message,
        this.message_file,
        this.message_file_type,
      ];
      const [data, _] = await conn.execute(sql, messageValues);
      return data;
    } catch (error) {
      console.log(error + "--- create message ---");
      return [];
    }
  }

  static async deleteMessage(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE messages SET message_is_deleted = ?
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete message ---");
      return [];
    }
  }

  static async getAllMessages(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM messages AS m
                    INNER JOIN message_rooms AS mr
                    ON m.room_fk_id = mr.room_fk_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all messages ---");
      return [];
    }
  }

  static async getLatestMessage(messageRoomID) {
    try {
      const sql = `SELECT * FROM messages AS m

                    INNER JOIN message_rooms AS mr
                    ON mr.room_fk_id = m.message_room_fk_id

                    WHERE message_room_fk_id = ?
                    AND m.message_id = (
                      SELECT MAX(m2.message_id) FROM messages AS m2
                      WHERE m2.message_room_fk_id = ?
                    );`;
      const values = [messageRoomID, messageRoomID];
      const [data, _] = await conn.execute(sql, values);

      return data;
    } catch (error) {
      console.log(error + "--- get latest message ---");
      return [];
    }
  }

  static async getMessage(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM messages
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get message ---");
      return [];
    }
  }
}
