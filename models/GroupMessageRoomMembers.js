import conn from "../db/connection";

export class GroupMessageRoomMembers {
  constructor(group_message_member_uuid, member_id, group_message_room_id) {
    this.group_message_member_uuid = group_message_member_uuid;
    this.member_id = member_id;
    this.group_message_room_id = group_message_room_id;
  }

  async createGroupMessageRoomMember() {
    try {
      const sql = `INSERT INTO group_message_members
                    (
                        group_message_member_uuid,
                        member_id,
                        group_message_room_id
                    ) VALUES (?, ?, ?);`;
      const groupMessageRoomMemberValues = [this.group_message_member_uuid, this.member_id, this.group_message_room_id];
      const [data, _] = await conn.execute(sql, groupMessageRoomMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- create group message room member ---");
    }
  }

  async deleteGroupMessageRoomMember(selector, value) {
    try {
      const sql = `DELETE FROM group_message_members
                    WHERE ${selector} = ?;`;
      const groupMessageRoomMemberValues = [value];
      const [data, _] = await conn.execute(sql, groupMessageRoomMemberValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete group message room member ---");
    }
  }
}
