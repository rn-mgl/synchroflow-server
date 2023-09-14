import conn from "../db/connection";

export class MainTaskInvites {
  constructor(
    main_task_invite_uuid,
    main_task_id,
    invited_by,
    invited_associate,
    main_task_invite_message,
    main_task_invite_status
  ) {
    this.main_task_invite_uuid = main_task_invite_uuid;
    this.main_task_id = main_task_id;
    this.invited_by = invited_by;
    this.invited_associate = invited_associate;
    this.main_task_invite_message = main_task_invite_message;
    this.main_task_invite_status = main_task_invite_status;
  }

  async createMainTaskInvite() {
    try {
      const sql = `INSERT INTO main_task_invites
                  (
                    main_task_invite_uuid, 
                    main_task_id, 
                    invited_by, 
                    invited_associate, 
                    main_task_invite_message, 
                    main_task_invite_status
                  ) VALUES (?, ?, ?, ?, ?, ?);`;
      const mainTaskInviteValues = [
        this.main_task_invite_uuid,
        this.main_task_id,
        this.invited_by,
        this.invited_associate,
        this.main_task_invite_message,
        this.main_task_invite_status,
      ];
      const [data, _] = await conn.execute(sql, mainTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create main task invite ---");
    }
  }

  static async deleteMainTaskInvite(selector, value) {
    try {
      const sql = `DELETE FROM main_task_invites
                  WHERE '${selector}' = ?`;
      const mainTaskInviteValues = [value];
      const [data, _] = await conn.execute(sql, mainTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task invite ---");
    }
  }

  static async updateMainTaskInviteStatus(main_task_invite_status, selector, value) {
    try {
      const sql = `UPDATE main_task_invites SET main_task_invite_status = ?
                  WHERE '${selector}' = ?`;
      const mainTaskInviteValues = [main_task_invite_status, value];
      const [data, _] = await conn.execute(sql, mainTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task invite ---");
    }
  }
}
