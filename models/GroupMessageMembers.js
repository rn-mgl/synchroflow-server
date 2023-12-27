import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class GroupMessageMembers {
  constructor(message_member_uuid, member_id, message_room_id) {
    this.message_member_uuid = message_member_uuid;
    this.member_id = member_id;
    this.message_room_id = message_room_id;
  }

  async createGroupMessageMember() {
    try {
      const sql = `INSERT INTO group_message_members
                    (
                        message_member_uuid,
                        member_fk_id,
                        message_room_fk_id
                    ) VALUES (?, ?, ?);`;
      const groupMessageMemberValues = [this.message_member_uuid, this.member_id, this.message_room_id];
      const [data, _] = await conn.query(sql, groupMessageMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message  member ---");
    }
  }

  static async deleteGroupMessageMember(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM group_message_members
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message  member ---");
    }
  }

  static async getAllGroupMessageMembers(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group message members ---");
    }
  }

  static async getGroupMessageMember(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get group message  member ---");
    }
  }
}
