import conn from "../db/connection.js";

export class PrivateMessageMembers {
  constructor(private_message_member_uuid, member_id, private_message_room_id) {
    this.private_message_member_uuid = private_message_member_uuid;
    this.member_id = member_id;
    this.private_message_room_id = private_message_room_id;
  }

  async createPrivateMessageMember() {
    try {
      const sql = `INSERT INTO private_message_members
                    (
                        private_message_member_uuid,
                        member_id,
                        private_message_room_id
                    ) VALUES (?, ?, ?);`;
      const privateMessageMemberValues = [
        this.private_message_member_uuid,
        this.member_id,
        this.private_message_room_id,
      ];
      const [data, _] = await conn.query(sql, privateMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message  member ---");
    }
  }

  static async deletePrivateMessageMember(selector, value) {
    try {
      const sql = `DELETE FROM private_message_members
                    WHERE ${selector} = ?;`;
      const privateMessageMemberValues = [value];
      const [data, _] = await conn.query(sql, privateMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message  member ---");
    }
  }

  static async getAllPrivateMessageMembers(selector, value) {
    try {
      const sql = `SELECT * FROM private_message_members
                    WHERE ${selector} = ?;`;
      const privateMessageMemberValues = [value];
      const [data, _] = await conn.query(sql, privateMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all private message members ---");
    }
  }

  static async getPrivateMessageMember(selector, value) {
    try {
      const sql = `SELECT * FROM private_message_members
                    WHERE ${selector} = ?;`;
      const privateMessageMemberValues = [value];
      const [data, _] = await conn.query(sql, privateMessageMemberValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message  member ---");
    }
  }
}
