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
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM group_message_members AS gmm
                    INNER JOIN users AS u
                    ON gmm.member_fk_id = u.user_id
                    INNER JOIN group_message_rooms AS gmr
                    ON gmm.message_room_fk_id = gmr.message_room_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group message members ---");
    }
  }

  static async getPossibleGroupMembers(messageRoomID, userID) {
    try {
      const sql = `SELECT * FROM associates AS a

                    INNER JOIN users AS u
                    ON a.associate_of = u.user_id
                    OR a.associate_is = u.user_id
                    
                    WHERE u.user_id NOT IN (
                      SELECT gmm.member_fk_id FROM group_message_members AS gmm
                      INNER JOIN group_message_rooms AS gmr
                      ON gmm.message_room_fk_id = gmr.message_room_id
                      WHERE gmr.message_room_id = '${messageRoomID}' 
                    ) 
                    AND u.user_id <> '${userID}';`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get possible group message members ---");
    }
  }

  static async getGroupMessageMember(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM group_message_members
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get group message  member ---");
    }
  }
}
