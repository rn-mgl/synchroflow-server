import conn from "../db/connection.js";
import { messagesFilterKey } from "../utils/filterUtils.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class MessageRooms {
  constructor(message_room, room_name, room_image, room_type, created_by) {
    this.message_room = message_room;
    this.room_name = room_name;
    this.room_image = room_image;
    this.room_type = room_type;
    this.created_by = created_by;
  }

  async createMessageRoom() {
    try {
      const sql = `INSERT INTO message_rooms
                    (
                        message_room, 
                        room_name,
                        room_image,
                        room_type,
                        created_by
                    ) VALUES (?, ?, ?, ?)`;

      const messageRoomValues = [
        this.message_room,
        this.room_name,
        this.room_image,
        this.room_type,
        this.created_by,
      ];
      const [data, _] = await conn.execute(sql, messageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create message room ---");
      return [];
    }
  }

  static async deleteMessageRoom(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `DELETE FROM message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete message room ---");
      return [];
    }
  }

  static async updateMessageName(roomName, roomImage, roomID) {
    try {
      const sql = `UPDATE message_rooms 
                    SET 
                      room_name = ?, 
                      room_image = ?
                    WHERE message_room_id = ?;`;

      const messageUpdateValues = [roomName, roomImage, roomID];

      const [data, _] = await conn.execute(sql, messageUpdateValues);
      return data;
    } catch (error) {
      console.log(error + "--- update message room ---");
      return [];
    }
  }

  static async updateMessageCreator(roomID, creatorID) {
    try {
      const sql = `UPDATE message_rooms 
                    SET 
                      created_by = ?
                    WHERE message_room_id = ?;`;

      const messageUpdateValues = [creatorID, roomID];

      const [data, _] = await conn.execute(sql, messageUpdateValues);
      return data;
    } catch (error) {
      console.log(error + "--- update message room ---");
      return [];
    }
  }

  static async getAllMessageRooms(memberID, searchFilter) {
    try {
      const sql = `SELECT * FROM message_rooms AS gmr

                    INNER JOIN message_members AS gmm
                    ON gmr.message_room_id = gmm.message_room_fk_id

                    INNER JOIN users AS u
                    ON gmm.member_fk_id = u.user_id

                    LEFT JOIN messages AS gm
                    ON gmr.message_room_id = gm.message_room_fk_id
                    AND gm.message_id = (
                      SELECT MAX(gm2.message_id) from messages AS gm2
                      WHERE gmr.message_room_id = gm2.message_room_fk_id 
                    )

                    WHERE member_fk_id = ?
                    AND room_name LIKE ?;`;

      const [data, _] = await conn.execute(sql, [
        memberID,
        `%${searchFilter}%`,
      ]);

      return data;
    } catch (error) {
      console.log(error + "--- get all message rooms ---");
      return [];
    }
  }

  static async getMessageRoomMessages(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM message_rooms AS pmr
                  INNER JOIN messages AS pm
                  ON pmr.message_room_id = pm.message_room_fk_id
                  WHERE ${mappedWhereConditions}
                  ORDER BY pm.date_sent DESC;`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get message room ---");
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

  static async getMessageRoom(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get message room ---");
      return [];
    }
  }
}
