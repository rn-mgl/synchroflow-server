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

  static async getAllMainTaskCollaborators(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT u.name, u.surname, u.image, u.user_uuid,
                    tc.task_collaborator_uuid

                    FROM task_collaborators AS tc

                    INNER JOIN users AS u
                    ON tc.collaborator_fk_id = u.user_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all task collaborators ---");
      return [];
    }
  }

  static async getAllSubTaskCollaborators(subTaskID, mainTaskID) {
    try {
      const sql = `SELECT u.name, u.surname, u.user_uuid, u.image,
                    stc.task_collaborator_uuid,
                    CASE WHEN
                      stc.task_collaborator_uuid IS NULL THEN 0 ELSE 1
                    END AS is_task_collaborator
                    
                    FROM task_collaborators AS tc
                    
                    INNER JOIN users AS u
                    ON tc.collaborator_fk_id = u.user_id
                    
                    LEFT JOIN task_collaborators AS stc
                    ON stc.task_fk_id = ?
                    AND stc.collaborator_fk_id = u.user_id
                    
                    WHERE tc.task_fk_id = ?;`;

      const values = [subTaskID, mainTaskID];
      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get all sub task collaborators ---");
      return [];
    }
  }
}
