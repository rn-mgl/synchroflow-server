import conn from "../db/connection.js";
import { messagesFilterKey } from "../utils/filterUtils.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class GroupMessageRooms {
  constructor(message_room, room_name, room_image, created_by) {
    this.message_room = message_room;
    this.room_name = room_name;
    this.room_image = room_image;
    this.created_by = created_by;
  }

  async createGroupMessageRoom() {
    try {
      const sql = `INSERT INTO group_message_rooms
                    (
                        message_room, 
                        room_name,
                        room_image,
                        created_by
                    ) VALUES (?, ?, ?, ?)`;

      const groupMessageRoomValues = [
        this.message_room,
        this.room_name,
        this.room_image,
        this.created_by,
      ];
      const [data, _] = await conn.execute(sql, groupMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message room ---");
      return [];
    }
  }

  static async deleteGroupMessageRoom(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `DELETE FROM group_message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message room ---");
      return [];
    }
  }

  static async updateGroupMessageName(roomName, roomImage, roomID) {
    try {
      const sql = `UPDATE group_message_rooms 
                    SET 
                      room_name = ?, 
                      room_image = ?
                    WHERE message_room_id = ?;`;

      const groupMessageUpdateValues = [roomName, roomImage, roomID];

      const [data, _] = await conn.execute(sql, groupMessageUpdateValues);
      return data;
    } catch (error) {
      console.log(error + "--- update group message room ---");
      return [];
    }
  }

  static async updateGroupMessageCreator(roomID, creatorID) {
    try {
      const sql = `UPDATE group_message_rooms 
                    SET 
                      created_by = ?
                    WHERE message_room_id = ?;`;

      const groupMessageUpdateValues = [creatorID, roomID];

      const [data, _] = await conn.execute(sql, groupMessageUpdateValues);
      return data;
    } catch (error) {
      console.log(error + "--- update group message room ---");
      return [];
    }
  }

  static async getAllGroupMessageRooms(memberID, searchFilter) {
    try {
      const sql = `SELECT * FROM group_message_rooms AS gmr

                    INNER JOIN group_message_members AS gmm
                    ON gmr.message_room_id = gmm.message_room_fk_id

                    INNER JOIN users AS u
                    ON gmm.member_fk_id = u.user_id

                    LEFT JOIN group_messages AS gm
                    ON gmr.message_room_id = gm.message_room_fk_id
                    AND gm.message_id = (
                      SELECT MAX(gm2.message_id) from group_messages AS gm2
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
      console.log(error + "--- get all group message rooms ---");
      return [];
    }
  }

  static async getGroupMessageRoomMessages(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM group_message_rooms AS pmr
                  INNER JOIN group_messages AS pm
                  ON pmr.message_room_id = pm.message_room_fk_id
                  WHERE ${mappedWhereConditions}
                  ORDER BY pm.date_sent DESC;`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get group message room ---");
      return [];
    }
  }

  static async getGroupMessageRoom(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT * FROM group_message_rooms
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get group message room ---");
      return [];
    }
  }
}
