import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class GroupMessages {
  constructor(group_message_room_id, group_message_uuid, group_message_from, group_message, group_message_file) {
    this.group_message_room_id = group_message_room_id;
    this.group_message_uuid = group_message_uuid;
    this.group_message_from = group_message_from;
    this.group_message = group_message;
    this.group_message_file = group_message_file;
    this.group_message_file_type = group_message_file_type;
  }

  async createGroupMessage() {
    try {
      const sql = `INSERT INTO group_messages
                     (
                        group_message_room_id,
                        group_message_uuid,
                        group_message_from,
                        group_message,
                        group_message_file,
                        group_message_file_type
                     ) VALUES (?, ?, ?, ?, ?)`;
      const groupMessageValues = [
        this.group_message_room_id,
        this.group_message_uuid,
        this.group_message_from,
        this.group_message,
        this.group_message_file,
        this.group_message_file_type,
      ];
      const [data, _] = await conn.query(sql, groupMessageValues);
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

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message ---");
    }
  }

  static async getAllGroupMessages(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_messages AS gm
                    INNER JOIN group_message_rooms AS gmr
                    ON gm.group_message_room_id = gmr.group_message_room_id
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group messages ---");
    }
  }

  static async getGroupMessage(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_messages
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get group message ---");
    }
  }
}
