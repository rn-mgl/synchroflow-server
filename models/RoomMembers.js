import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class RoomMembers {
  constructor(member_uuid, member_fk_id, room_fk_id) {
    this.member_uuid = member_uuid;
    this.member_fk_id = member_fk_id;
    this.room_fk_id = room_fk_id;
  }

  async createRoomMember() {
    try {
      const sql = `INSERT INTO room_members
                    (
                        message_member_uuid,
                        member_fk_id,
                        message_room_fk_id
                    ) VALUES (?, ?, ?);`;
      const roomMemberValues = [
        this.message_member_uuid,
        this.member_fk_id,
        this.room_fk_id,
      ];
      const [data, _] = await conn.execute(sql, roomMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create message  member ---");
      return [];
    }
  }

  static async deleteRoomMember(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM room_members
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete message  member ---");
      return [];
    }
  }

  static async getAllRoomMembers(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM room_members AS mm
                    INNER JOIN users AS u
                    ON mm.member_fk_id = u.user_id
                    INNER JOIN message_rooms AS mr
                    ON mm.message_room_fk_id = mr.room_fk_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all message members ---");
      return [];
    }
  }

  static async getPossibleMembers(messageRoomID, userID) {
    try {
      const sql = `SELECT * FROM associates AS a

                    INNER JOIN users AS u
                    ON a.associate_of = u.user_id
                    OR a.associate_is = u.user_id
                    
                    WHERE u.user_id NOT IN (
                      SELECT mm.member_fk_id FROM room_members AS mm
                      INNER JOIN message_rooms AS mr
                      ON mm.message_room_fk_id = mr.room_fk_id
                      WHERE mr.room_fk_id = ? 
                    ) 
                    AND u.user_id <> ?
                    GROUP BY u.user_id;`;

      const values = [messageRoomID, userID];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get possible message members ---");
      return [];
    }
  }

  static async getRoomMember(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM room_members
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get message  member ---");
      return [];
    }
  }
}
