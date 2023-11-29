import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

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

  static async deletePrivateMessageMember(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM private_message_members
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message  member ---");
    }
  }

  static async getAllPrivateMessageMembers(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_message_members
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all private message members ---");
    }
  }

  static async getPrivateMessageMember(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_message_members
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message  member ---");
    }
  }
}
