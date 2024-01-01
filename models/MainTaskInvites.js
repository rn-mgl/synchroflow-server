import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

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

  static async deleteMainTaskInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM main_task_invites
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- delete main task invite ---");
    }
  }

  static async updateMainTaskInviteStatus(main_task_invite_status, whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE main_task_invites SET main_task_invite_status = ?
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereConditions);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task invite ---");
    }
  }

  static async getMainTaskInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM main_task_invites
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get main task invite ---");
    }
  }

  static async getAllMainTaskInvites(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM main_task_invites AS mti
                    INNER JOIN users AS u
                    ON mti.invited_associate = u.user_id
                    INNER JOIN main_tasks AS mt
                    ON mti.main_task_fk_id = mt.main_task_id
                    WHERE ${whereConditions} = ?;`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all main task invites ---");
    }
  }

  static async getAllAssociatesToInvite(userId, mainTaskId) {
    try {
      const sql = `SELECT * FROM associates AS a

                  INNER JOIN users AS u
                  ON (u.user_id = a.associate_of AND a.associate_of <> '${userId}')
                  OR (u.user_id = a.associate_is AND a.associate_is <> '${userId}')

                  WHERE (a.associate_is = '${userId}' OR a.associate_of = '${userId}')
                  AND a.associate_is NOT IN (
                    SELECT invited_associate FROM main_task_invites
                    WHERE main_task_fk_id = '${mainTaskId}'
                  )
                  AND a.associate_of NOT IN (
                    SELECT invited_associate FROM main_task_invites
                    WHERE main_task_fk_id = '${mainTaskId}'
                  )
                  AND a.associate_is NOT IN (
                    SELECT collaborator_id FROM main_task_collaborators
                    WHERE main_task_fk_id = '${mainTaskId}'
                  )
                  AND a.associate_of NOT IN (
                    SELECT collaborator_id FROM main_task_collaborators
                    WHERE main_task_fk_id = '${mainTaskId}'
                  ) ;`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates to invite ---");
    }
  }
}
