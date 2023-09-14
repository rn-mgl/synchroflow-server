import db from "../db/connection";

export class SubTaskInvites {
  constructor(
    sub_task_invite_uuid,
    sub_task_id,
    invited_by,
    invited_associate,
    sub_task_invite_message,
    sub_task_invite_status
  ) {
    this.sub_task_invite_uuid = sub_task_invite_uuid;
    this.sub_task_id = sub_task_id;
    this.invited_by = invited_by;
    this.invited_associate = invited_associate;
    this.sub_task_invite_message = sub_task_invite_message;
    this.sub_task_invite_status = sub_task_invite_status;
  }

  async createMainTaskInvite() {
    try {
      const sql = `INSERT INTO sub_task_invites
                  (
                    sub_task_invite_uuid, 
                    sub_task_id, 
                    invited_by, 
                    invited_associate, 
                    sub_task_invite_message, 
                    sub_task_invite_status
                  ) VALUES (?, ?, ?, ?, ?, ?);`;
      const subTaskInviteValues = [
        this.sub_task_invite_uuid,
        this.sub_task_id,
        this.invited_by,
        this.invited_associate,
        this.sub_task_invite_message,
        this.sub_task_invite_status,
      ];
      const [data, _] = await db.execute(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task invite ---");
    }
  }

  static async deleteMainTaskInvite(selector, value) {
    try {
      const sql = `DELETE FROM sub_task_invites
                  WHERE '${selector}' = ?`;
      const subTaskInviteValues = [value];
      const [data, _] = await db.execute(sql, subTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task invite ---");
    }
  }
}
