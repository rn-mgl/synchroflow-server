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
      const [data, _] = await conn.execute(sql, privateMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create private message room ---");
      return [];
    }
  }

  static async deletePrivateMessageRoom(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM private_message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete private message room ---");
      return [];
    }
  }

  static async getAllPrivateMessageRooms(userId, searchFilter) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr

                    INNER JOIN private_message_members AS pmm
                    ON pmr.message_room_id = pmm.message_room_fk_id

                    INNER JOIN users AS u
                    ON pmm.member_fk_id = u.user_id

                    WHERE pmr.message_room_id IN (
                      SELECT pmm2.message_room_fk_id 
                      FROM private_message_members AS pmm2
                      WHERE pmm2.message_room_fk_id = pmr.message_room_id
                      AND pmm2.member_fk_id = ?
                    )

                    AND pmm.member_fk_id <> ?
                    AND (u.name LIKE ? 
                    OR u.surname LIKE ?);`;

      const values = [userId, userId, `%${searchFilter}%`, `%${searchFilter}%`];

      const [data, _] = await conn.execute(sql, values);

      return data;
    } catch (error) {
      console.log(error + "--- get all private message room ---");
      return [];
    }
  }

  static async getPrivateMessageRoomMessages(
    whereConditions,
    whereValues,
    limit = 20,
  ) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr

                    INNER JOIN private_messages AS pm
                    ON pmr.message_room_id = pm.message_room_fk_id

                    WHERE ${whereConditions} = ?
                    ORDER BY pm.date_sent DESC
                    LIMIT ?;`;

      const [data, _] = await conn.execute(sql, [...whereValues, limit]);

      return data;
    } catch (error) {
      console.log(error + "--- get private message room ---");
      return [];
    }
  }

  static async getPrivateMessageRoom(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM private_message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get private message room ---");
      return [];
    }
  }

  static async getPrivateMessageRoomExistingMembers(userID, associateID) {
    try {
      const sql = `SELECT pmr.message_room_id,
                   COALESCE(COUNT(pmm.member_fk_id), 0) AS total_members
                   FROM private_message_rooms AS pmr

                   INNER JOIN private_message_members AS pmm
                   ON pmr.message_room_id = pmm.message_room_fk_id
                   
                   WHERE pmm.member_fk_id IN (?, ?)
                   GROUP BY message_room_id
                   HAVING total_members = 2;`;

      const values = [userID, associateID];
      const [data, _] = await conn.execute(sql, values);

      return data;
    } catch (error) {
      console.log(error + "--- get private message room existing members ---");
      return [];
    }
  }

  static async getPrivateMessageRoomMainData(userID, messageRoom) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr

                  INNER JOIN private_message_members AS pmm
                  ON pmr.message_room_id = pmm.message_room_fk_id

                  INNER JOIN users AS u
                  ON pmm.member_fk_id = u.user_id

                  WHERE pmm.member_fk_id <> ?
                  AND pmr.message_room = ?;`;

      const values = [userID, messageRoom];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get private message room ---");
      return [];
    }
  }
}
