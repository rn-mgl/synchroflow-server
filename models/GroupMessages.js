import conn from "../db/connection";

export class GroupMessages {
  constructor(group_message_room_id, group_message_from, group_message, group_message_file, group_message_is_deleted) {
    this.group_message_room_id = group_message_room_id;
    this.group_message_from = group_message_from;
    this.group_message = group_message;
    this.group_message_file = group_message_file;
    this.group_message_is_deleted = group_message_is_deleted;
  }

  async createGroupMessage() {
    try {
      const sql = `INSERT INTO group_messages
                     (
                        group_message_room_id,
                        group_message_from,
                        group_message,
                        group_message_file,
                        group_message_is_deleted
                     ) VALUES (?, ?, ?, ?, ?)`;
      const groupMessageValues = [
        this.group_message_room_id,
        this.group_message_from,
        this.group_message,
        this.group_message_file,
        this.group_message_is_deleted,
      ];
      const [data, _] = await conn.execute(sql, groupMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message ---");
    }
  }

  static async deleteGroupMessage(selector, value) {
    try {
      const sql = `DELETE FROM group_messages
                    WHERE ${selector} = ?;`;
      const groupMessageValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message ---");
    }
  }

  static async getAllGroupMessages(selector, value) {
    try {
      const sql = `SELECT * FROM group_messages
                    WHERE ${selector} = ?;`;
      const groupMessageValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group messages ---");
    }
  }
}
