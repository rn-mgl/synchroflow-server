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
                    ) VALUES (?, ?, ?, ?, ?)`;

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

  static async getAllMessageRooms(memberID, roomType) {
    try {
      let query = "";
      let values = [];

      switch (roomType) {
        case "private":
          // get my private rooms
          // get private rooms of the current user
          const myPrivateRooms = `SELECT message_room_id FROM message_rooms
                            
                            INNER JOIN room_members
                            ON room_fk_id = message_room_id
                            
                            WHERE member_fk_id = ?
                            AND room_type = "private";`;

          const [rooms, roomFields] = await conn.execute(myPrivateRooms, [
            memberID,
          ]);

          const myAssociates = `SELECT associate_is FROM associates WHERE associate_of = ?`;
          const associatedToMe = `SELECT associate_of FROM associates WHERE associate_is = ?`;

          const [associateIs, associateFields1] = await conn.execute(
            myAssociates,
            [memberID],
          );

          const [associateOf, associateFields2] = await conn.execute(
            associatedToMe,
            [memberID],
          );

          const associates = [
            ...associateIs.map((a) => a.associate_is),
            ...associateOf.map((a) => a.associate_of),
          ];

          const extractedAssociates = associates.length ? associates : ["_"];

          const preparedAssociates = extractedAssociates
            .map((a) => "?")
            .join(", ");

          const extractedRooms = rooms.length
            ? rooms.map((room) => room.message_room_id)
            : ["_"]; // cast dummy value for empty array

          const preparedRooms = extractedRooms.map((room) => "?").join(", ");

          // use the private rooms of the current user to get their counterpart (associate's details)
          query = `SELECT u.image AS room_image, CONCAT(u.name, " ", u.surname) AS room_name, 
                    mr.message_room, mr.created_by
                    FROM message_rooms AS mr

                    INNER JOIN room_members AS rm
                    ON mr.message_room_id = rm.room_fk_id

                    INNER JOIN users AS u
                    ON u.user_id = rm.member_fk_id

                    WHERE mr.message_room_id IN (${preparedRooms})
                    AND room_type = "private"
                    AND member_fk_id IN (${preparedAssociates})
                    AND u.user_id != ?;`;

          values = [...extractedRooms, ...extractedAssociates, memberID];

          break;

        case "group":
          query = `SELECT mr.message_room, mr.created_by, mr.room_image, mr.room_name
                    FROM message_rooms AS mr

                    INNER JOIN room_members AS rm
                    ON mr.message_room_id = rm.room_fk_id

                    INNER JOIN users AS u
                    ON u.user_id = rm.member_fk_id

                    WHERE member_fk_id = ?
                    AND room_type = "group";`;

          values = [memberID];

          break;
      }

      const [data, _] = await conn.execute(query, values);

      return data;
    } catch (error) {
      console.log(error + "--- get all message rooms ---");
      return [];
    }
  }

  static async getMessageRoomMessages(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT u.image, u.name, u.surname, m.date_sent, 
                  m.message, m.message_file, m.message_file_type, m.sender, m.message_uuid
                  FROM message_rooms AS mr

                  INNER JOIN messages AS m
                  ON mr.message_room_id = m.room_fk_id

                  INNER JOIN users as u
                  ON m.sender = u.user_id

                  WHERE ${mappedWhereConditions}
                  ORDER BY m.date_sent DESC;`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get message room ---");
      return [];
    }
  }

  static async getMessageRoom(roomUUID, roomType, userID) {
    try {
      const sql = `SELECT message_room_id, message_room,

                    CASE WHEN room_type = "private" 
                      THEN (
                        SELECT CONCAT(u.name, " ", u.surname) AS name
                        FROM room_members AS rm

                        INNER JOIN users AS u
                        ON rm.member_fk_id = u.user_id

                        WHERE mr.message_room_id = room_fk_id
                        AND u.user_id != ?
                      ) 
                    ELSE room_name END AS room_name, 

                    CASE WHEN room_type = "private" 
                      THEN (
                        SELECT u.image AS image
                        FROM room_members AS rm

                        INNER JOIN users AS u
                        ON rm.member_fk_id = u.user_id

                        WHERE mr.message_room_id = room_fk_id
                        AND u.user_id != ?
                      ) 
                    ELSE room_image END AS room_image, 

                    room_type, 

                    created_by 

                    FROM message_rooms AS mr

                    WHERE message_room = ? AND room_type = ?;`;

      const [data, _] = await conn.execute(sql, [
        userID,
        userID,
        roomUUID,
        roomType,
      ]);
      return data;
    } catch (error) {
      console.log(error + "--- get message room ---");
      return [];
    }
  }

  static async getPrivateRoomByMembers(userID, associateID) {
    try {
      const sql = `SELECT mr.message_room_id,
                     COALESCE(COUNT(rm.member_fk_id), 0) AS total_members
                     FROM message_rooms AS mr
  
                     INNER JOIN room_members AS rm
                     ON mr.message_room_id = rm.room_fk_id
                     
                     WHERE member_fk_id IN (?, ?)
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
}
