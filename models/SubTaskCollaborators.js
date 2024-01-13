import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class SubTaskCollaborators {
  constructor(sub_task_collaborator_uuid, sub_task_fk_id, collaborator_id) {
    this.sub_task_collaborator_uuid = sub_task_collaborator_uuid;
    this.sub_task_fk_id = sub_task_fk_id;
    this.collaborator_id = collaborator_id;
  }

  async createSubTaskCollaborator() {
    try {
      const sql = `INSERT INTO sub_task_collaborators
                     (
                        sub_task_collaborator_uuid, 
                        sub_task_fk_id, 
                        collaborator_id
                     ) VALUES (?, ?, ?);`;
      const subTaskCollaboratorValues = [this.sub_task_collaborator_uuid, this.sub_task_fk_id, this.collaborator_id];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task collaborator ---");
    }
  }

  static async deleteSubTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `DELETE FROM sub_task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task collaborator ---");
    }
  }

  static async getSubTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM sub_task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get sub task collaborator ---");
    }
  }

  static async getAllSubTaskCollaborators(subTaskID, mainTaskID) {
    try {
      const sql = `SELECT u.name, u.surname, u.user_uuid, u.image,
                    stc.sub_task_collaborator_uuid,
                    CASE WHEN
                      stc.sub_task_collaborator_id IS NULL THEN 0 ELSE 1
                    END AS is_sub_task_collaborator
                    FROM main_task_collaborators AS mtc

                    INNER JOIN main_tasks AS mt
                    ON mt.main_task_id = '${mainTaskID}'
                    
                    INNER JOIN sub_tasks AS st
                    ON st.sub_task_id = '${subTaskID}'
                    
                    INNER JOIN users AS u
                    ON mtc.collaborator_id = u.user_id
                    
                    LEFT JOIN sub_task_collaborators AS stc
                    ON st.sub_task_id = stc.sub_task_fk_id
                    AND stc.collaborator_id = u.user_id
                    
                    WHERE mtc.main_task_fk_id = '${mainTaskID}';`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get all sub task collaborators ---");
    }
  }
}
