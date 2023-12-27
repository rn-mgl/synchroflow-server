import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class PrivateMessageRooms {
  constructor(message_room) {
    this.message_room = message_room;
  }

  async createPrivateMessageRoom() {
    try {
      const sql = `INSERT INTO private_message_rooms
                    (
                        message_room
                    ) VALUES (?);`;
      const privateMessageRoomValues = [this.message_room];
      const [data, _] = await conn.query(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message room ---");
    }
  }

  static async deletePrivateMessageRoom(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM private_message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message room ---");
    }
  }

  static async getAllPrivateMessageRooms(userId) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr

                    INNER JOIN private_message_members AS pmm
                    ON pmr.message_room_id = pmm.message_room_fk_id

                    INNER JOIN users AS u
                    ON pmm.member_fk_id = u.user_id

                    LEFT JOIN private_messages AS pm
                    ON pmr.message_room_id = pm.message_room_fk_id

                    WHERE member_fk_id <> '${userId}'

                    AND pm.message_id = (
                      SELECT MAX(pm2.message_id) from private_messages AS pm2
                      WHERE pm2.message_from = '${userId}'
                      OR pm2.message_to = '${userId}'
                      );`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get all private message room ---");
    }
  }

  static async getPrivateMessageRoomMessages(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr
                    INNER JOIN private_messages AS pm
                    ON pmr.message_room_id = pm.message_room_fk_id
                    WHERE ${whereConditions} = ?
                    ORDER BY pm.date_sent DESC;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get private message room ---");
    }
  }

  static async getPrivateMessageRoom(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM private_message_rooms
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message room ---");
    }
  }
}
