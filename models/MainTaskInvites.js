import conn from "../db/connection.js";

export class MainTaskInvites {
  constructor(main_task_invite_uuid, main_task_fk_id, invited_by, invited_associate, main_task_invite_message) {
    this.main_task_invite_uuid = main_task_invite_uuid;
    this.main_task_fk_id = main_task_fk_id;
    this.invited_by = invited_by;
    this.invited_associate = invited_associate;
    this.main_task_invite_message = main_task_invite_message;
  }

  async createMainTaskInvite() {
    try {
      const sql = `INSERT INTO main_task_invites
                  (
                    main_task_invite_uuid, 
                    main_task_fk_id, 
                    invited_by, 
                    invited_associate, 
                    main_task_invite_message
                  ) VALUES (?, ?, ?, ?, ?);`;
      const mainTaskInviteValues = [
        this.main_task_invite_uuid,
        this.main_task_fk_id,
        this.invited_by,
        this.invited_associate,
        this.main_task_invite_message,
      ];
      const [data, _] = await conn.query(sql, mainTaskInviteValues);
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
      const [data, _] = await conn.query(sql, mainTaskInviteValues);
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
      const [data, _] = await conn.query(sql, mainTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task invite ---");
    }
  }

  static async getMainTaskInvite(selector, value) {
    try {
      const sql = `SELECT * FROM main_task_invites
                    WHERE ${selector} = ?;`;
      const mainTaskInviteValues = [value];
      const [data, _] = await conn.query(sql, mainTaskInviteValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get main task invite ---");
    }
  }

  static async getAllMainTaskInvites(selector, value) {
    try {
      const sql = `SELECT * FROM main_task_invites
                    WHERE ${selector} = ?;`;
      const mainTaskInviteValues = [value];
      const [data, _] = await conn.query(sql, mainTaskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all main task invites ---");
    }
  }

  static async getAllAssociatesToInvite(selector, value) {
    try {
      const sql = `SELECT u.name, u.surname, u.image, u.user_uuid

                  FROM associates AS a

                  INNER JOIN users AS u
                  ON u.user_id = a.associate_is

                  LEFT JOIN main_task_invites AS mti
                  ON mti.invited_associate = a.associate_is

                  WHERE ${selector} = ?
                  AND mti.main_task_invite_id IS NULL;`;
      const mainAssociatestToInviteValues = [value];
      const [data, _] = await conn.query(sql, mainAssociatestToInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates to invite ---");
    }
  }
}
