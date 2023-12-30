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

                    WHERE pmr.message_room_id IN (
                      SELECT pmm2.message_room_fk_id 
                      FROM private_message_members AS pmm2
                      WHERE pmm2.message_room_fk_id = pmr.message_room_id
                      AND pmm2.member_fk_id = '${userId}'
                    )

                    AND pmm.member_fk_id <> '${userId}';`;

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

  static async getPrivateMessageRoomExistingMembers(userID, associateID) {
    try {
      const sql = `SELECT pmr.message_room_id,
                   COUNT(pmm.member_fk_id) AS total_members
                   FROM private_message_rooms AS pmr

                   INNER JOIN private_message_members AS pmm
                   ON pmr.message_room_id = pmm.message_room_fk_id
                   
                   WHERE pmm.member_fk_id IN ('${userID}', '${associateID}')
                   GROUP BY pmr.message_room_id
                   HAVING total_members = 2;`;

      const [data, _] = await conn.execute(sql);

      return data[0];
    } catch (error) {
      console.log(error + "--- get private message room existing members ---");
    }
  }

  static async getPrivateMessageRoomMainData(userID, messageRoom) {
    try {
      const sql = `SELECT * FROM private_message_rooms AS pmr

                  INNER JOIN private_message_members AS pmm
                  ON pmr.message_room_id = pmm.message_room_fk_id

                  INNER JOIN users AS u
                  ON pmm.member_fk_id = u.user_id

                  WHERE pmm.member_fk_id <> '${userID}'
                  AND pmr.message_room = '${messageRoom}';`;

      const [data, _] = await conn.execute(sql);
      return data[0];
    } catch (error) {
      console.log(error + "--- get private message room ---");
    }
  }
}
