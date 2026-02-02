import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class TaskCollaborators {
  constructor(task_collaborator_uuid, task_fk_id, collaborator_fk_id) {
    this.task_collaborator_uuid = task_collaborator_uuid;
    this.task_fk_id = task_fk_id;
    this.collaborator_fk_id = collaborator_fk_id;
  }

  async createTaskCollaborator() {
    try {
      const sql = `INSERT INTO task_collaborators
                     (
                        task_collaborator_uuid, 
                        task_fk_id, 
                        collaborator_fk_id
                     ) VALUES (?, ?, ?);`;
      const taskCollaboratorValues = [
        this.task_collaborator_uuid,
        this.task_fk_id,
        this.collaborator_fk_id,
      ];
      const [data, _] = await conn.execute(sql, taskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create task collaborator ---");
      return [];
    }
  }

  static async deleteTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete task collaborator ---");
      return [];
    }
  }

  static async getTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get task collaborator ---");
      return [];
    }
  }

  static async getAllTaskCollaborators(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT u.name, u.surname, u.image, u.user_uuid,
                    mtc.task_collaborator_uuid

                    FROM task_collaborators AS mtc

                    INNER JOIN tasks AS mt
                    ON mtc.task_fk_id = t.task_id

                    INNER JOIN users AS u
                    ON mtc.collaborator_fk_id = u.user_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all task collaborators ---");
      return [];
    }
  }
}
