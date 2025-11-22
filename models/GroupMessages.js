import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class GroupMessages {
  constructor(
    message_room_id,
    message_uuid,
    message_from,
    message,
    message_file,
    message_file_type
  ) {
    this.message_room_id = message_room_id;
    this.message_uuid = message_uuid;
    this.message_from = message_from;
    this.message = message;
    this.message_file = message_file;
    this.message_file_type = message_file_type;
  }

  async createGroupMessage() {
    try {
      const sql = `INSERT INTO group_messages
                     (
                        message_room_fk_id,
                        message_uuid,
                        message_from,
                        message,
                        message_file,
                        message_file_type
                     ) VALUES (?, ?, ?, ?, ?, ?)`;
      const groupMessageValues = [
        this.message_room_id,
        this.message_uuid,
        this.message_from,
        this.message,
        this.message_file,
        this.message_file_type,
      ];
      const [data, _] = await conn.execute(sql, groupMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message ---");
    }
  }

  static async deleteGroupMessage(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE group_messages SET group_message_is_deleted = ?
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message ---");
    }
  }

  static async getAllGroupMessages(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_messages AS gm
                    INNER JOIN group_message_rooms AS gmr
                    ON gm.message_room_id = gmr.message_room_id
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group messages ---");
    }
  }

  static async getLatestGroupMessage(messageRoomID) {
    try {
      const sql = `SELECT * FROM group_messages AS gm

                    INNER JOIN group_message_rooms AS gmr
                    ON gmr.message_room_id = gm.message_room_fk_id

                    WHERE message_room_fk_id = '${messageRoomID}'
                    AND gm.message_id = (
                      SELECT MAX(gm2.message_id) FROM group_messages AS gm2
                      WHERE gm2.message_room_fk_id = '${messageRoomID}'
                    );`;

      const [data, _] = await conn.execute(sql);

      return data;
    } catch (error) {
      console.log(error + "--- get latest group message ---");
    }
  }

  static async getGroupMessage(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_messages
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get group message ---");
    }
  }
}
