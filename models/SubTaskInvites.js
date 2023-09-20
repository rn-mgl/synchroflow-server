import conn from "../db/connection.js";

export class SubTaskInvites {
  constructor(sub_task_invite_uuid, sub_task_id, invited_by, invited_associate, sub_task_invite_message) {
    this.sub_task_invite_uuid = sub_task_invite_uuid;
    this.sub_task_id = sub_task_id;
    this.invited_by = invited_by;
    this.invited_associate = invited_associate;
    this.sub_task_invite_message = sub_task_invite_message;
  }

  async createSubTaskInvite() {
    try {
      const sql = `INSERT INTO sub_task_invites
                  (
                    sub_task_invite_uuid, 
                    sub_task_id, 
                    invited_by, 
                    invited_associate, 
                    sub_task_invite_message
                  ) VALUES (?, ?, ?, ?, ?);`;
      const subTaskInviteValues = [
        this.sub_task_invite_uuid,
        this.sub_task_id,
        this.invited_by,
        this.invited_associate,
        this.sub_task_invite_message,
      ];
      const [data, _] = await conn.query(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task invite ---");
    }
  }

  static async deleteSubTaskInvite(selector, value) {
    try {
      const sql = `DELETE FROM sub_task_invites
                  WHERE '${selector}' = ?`;
      const subTaskInviteValues = [value];
      const [data, _] = await conn.query(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task invite ---");
    }
  }

  static async updateSubTaskInviteStatus(sub_task_invite_status, selector, value) {
    try {
      const sql = `UPDATE sub_task_invites SET sub_task_invite_status = ?
                  WHERE '${selector}' = ?`;
      const subTaskInviteValues = [sub_task_invite_status, value];
      const [data, _] = await conn.query(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- update sub task invite ---");
    }
  }

  static async getAllSubTaskInvites(selector, value) {
    try {
      const sql = `SELECT * FROM sub_task_invites
                  WHERE '${selector}' = ?`;
      const subTaskInviteValues = [value];
      const [data, _] = await conn.query(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- getll all sub task invite ---");
    }
  }

  static async getSubTaskInvite(selector, value) {
    try {
      const sql = `SELECT * FROM sub_task_invites
                  WHERE '${selector}' = ?`;
      const subTaskInviteValues = [value];
      const [data, _] = await conn.query(sql, subTaskInviteValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- getll all sub task invite ---");
    }
  }
}
