import conn from "../db/connection";

export class GroupMessageMembers {
  constructor(group_message_member_uuid, member_id, group_message_room_id) {
    this.group_message_member_uuid = group_message_member_uuid;
    this.member_id = member_id;
    this.group_message_room_id = group_message_room_id;
  }

  async createGroupMessageMember() {
    try {
      const sql = `INSERT INTO group_message_members
                    (
                        group_message_member_uuid,
                        member_id,
                        group_message_room_id
                    ) VALUES (?, ?, ?);`;
      const groupMessageMemberValues = [this.group_message_member_uuid, this.member_id, this.group_message_room_id];
      const [data, _] = await conn.execute(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message  member ---");
    }
  }

  static async deleteGroupMessageMember(selector, value) {
    try {
      const sql = `DELETE FROM group_message_members
                    WHERE ${selector} = ?;`;
      const groupMessageMemberValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message  member ---");
    }
  }

  static async getAllGroupMessageMembers(selector, value) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${selector} = ?;`;
      const groupMessageMemberValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group message members ---");
    }
  }

  static async getGroupMessageMember(selector, value) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${selector} = ?;`;
      const groupMessageMemberValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageMemberValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get group message  member ---");
    }
  }
}
