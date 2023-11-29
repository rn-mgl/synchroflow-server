import conn from "../db/connection.js";

export class GroupMessageRooms {
  constructor(group_message_room, group_message_name) {
    this.group_message_room = group_message_room;
    this.group_message_name = group_message_name;
  }

  async createGroupMessageRoom() {
    try {
      const sql = `INSERT INTO group_message_rooms
                    (
                        group_message_room, 
                        group_message_name
                    ) VALUES (?, ?);`;
      const groupMessageRoomValues = [this.group_message_room, this.group_message_name];
      const [data, _] = await conn.query(sql, groupMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message room ---");
    }
  }

  static async deleteGroupMessageRoom(whereConditions, whereValues) {
    try {
      const sql = `DELETE FROM group_message_rooms
                    WHERE ${whereConditions} = ?;`;
      const groupMessageRoomValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message room ---");
    }
  }

  static async updateGroupMessageName(group_message_name, whereConditions, whereValues) {
    try {
      const sql = `UPDATE group_message_rooms SET group_message_name = ?
                    WHERE ${whereConditions} = ?;`;
      const groupMessageRoomValues = [group_message_name, whereValues];
      const [data, _] = await conn.query(sql, groupMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message room ---");
    }
  }

  static async getAllGroupMessageRooms(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_rooms AS gmr
                    INNER JOIN group_message_members AS gmm
                    ON gmr.group_message_room_id = gmm.group_message_room_id
                    WHERE ${whereConditions} = ?;`;
      const groupMessageRoomValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageRoomValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all group message rooms ---");
    }
  }

  static async getGroupMessageRoom(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM group_message_rooms
                    WHERE ${whereConditions} = ?;`;
      const groupMessageRoomValues = [whereValues];
      const [data, _] = await conn.query(sql, groupMessageRoomValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get group message room ---");
    }
  }
}
