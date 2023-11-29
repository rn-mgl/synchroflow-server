import conn from "../db/connection.js";

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
      const [data, _] = await conn.query(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message  member ---");
    }
  }

  static async deleteGroupMessageMember(whereConditions, whereValues) {
    try {
      const sql = `DELETE FROM group_message_members
                    WHERE ${whereConditions} = ?;`;
      const groupMessageMemberValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message  member ---");
    }
  }

  static async getAllGroupMessageMembers(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${whereConditions} = ?;`;
      const groupMessageMemberValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group message members ---");
    }
  }

  static async getGroupMessageMember(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${whereConditions} = ?;`;
      const groupMessageMemberValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageMemberValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get group message  member ---");
    }
  }
}
