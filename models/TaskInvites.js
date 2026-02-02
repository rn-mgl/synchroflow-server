import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class TaskInvites {
  constructor(task_invite_uuid, task_fk_id, invite_from, invite_to, message) {
    this.task_invite_uuid = task_invite_uuid;
    this.task_fk_id = task_fk_id;
    this.invite_from = invite_from;
    this.invite_to = invite_to;
    this.message = message;
  }

  async createTaskInvite() {
    try {
      const sql = `INSERT INTO task_invites
                  (
                    task_invite_uuid, 
                    task_fk_id, 
                    invite_from, 
                    invite_to, 
                    message
                  ) VALUES (?, ?, ?, ?, ?);`;
      const taskInviteValues = [
        this.task_invite_uuid,
        this.task_fk_id,
        this.invite_from,
        this.invite_to,
        this.message,
      ];
      const [data, _] = await conn.execute(sql, taskInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create task invite ---");
      return [];
    }
  }

  static async deleteTaskInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM task_invites
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- delete task invite ---");
      return [];
    }
  }

  static async updateTaskInviteStatus(
    task_invite_status,
    whereConditions,
    whereValues,
  ) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE task_invites SET task_invite_status = ?
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereConditions);
      return data;
    } catch (error) {
      console.log(error + "--- delete task invite ---");
      return [];
    }
  }

  static async getTaskInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM task_invites
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get task invite ---");
      return [];
    }
  }

  static async getAllTaskInvites(whereConditions, whereValues) {
    try {
      const mappedWhereConditions = mapWhereConditions(whereConditions);

      const sql = `SELECT u_invited.user_uuid AS invited_user_uuid, u_invited.user_id AS invited_user, u_invited.name AS invited_name, u_invited.surname AS invited_surname, u_invited.email AS invited_email,
                    u_from.user_uuid AS from_user_uuid, u_from.user_id AS from_user, u_from.name AS from_name, u_from.surname AS from_surname, u_from.email AS from_email,
                    ti.task_invite_uuid, t.title, t.banner, t.priority, t.task_uuid, ti.message
      
                    FROM task_invites AS ti

                    INNER JOIN users AS u_invited
                    ON ti.invite_to = u_invited.user_id

                    INNER JOIN users AS u_from
                    ON ti.invite_from = u_from.user_id

                    INNER JOIN tasks AS t
                    ON ti.task_fk_id = t.task_id

                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get all task invites ---");
      return [];
    }
  }

  static async getAllAssociatesToInvite(userId, taskId, searchFilter) {
    try {
      const sql = `SELECT * FROM associates AS a

                  INNER JOIN users AS u
                  ON (u.user_id = a.associate_of AND a.associate_of <> ?)
                  OR (u.user_id = a.associate_is AND a.associate_is <> ?)

                  WHERE (a.associate_is = ? OR a.associate_of = ?)
                  AND a.associate_is NOT IN (
                    SELECT invite_to FROM task_invites
                    WHERE task_fk_id = ?
                  )
                  AND a.associate_of NOT IN (
                    SELECT invite_to FROM task_invites
                    WHERE task_fk_id = ?
                  )
                  AND a.associate_is NOT IN (
                    SELECT collaborator_fk_id FROM task_collaborators
                    WHERE task_fk_id = ?
                  )
                  AND a.associate_of NOT IN (
                    SELECT collaborator_fk_id FROM task_collaborators
                    WHERE task_fk_id = ?
                  )
                  AND (name LIKE ? OR surname LIKE ?) ;`;

      const values = [
        userId,
        userId,
        userId,
        userId,
        taskId,
        taskId,
        taskId,
        taskId,
        `%${searchFilter}%`,
        `%${searchFilter}%`,
      ];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates to invite ---");
      return [];
    }
  }
}
