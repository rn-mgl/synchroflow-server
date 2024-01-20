import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class MainTaskCollaborators {
  constructor(main_task_collaborator_uuid, main_task_fk_id, collaborator_fk_id) {
    this.main_task_collaborator_uuid = main_task_collaborator_uuid;
    this.main_task_fk_id = main_task_fk_id;
    this.collaborator_fk_id = collaborator_fk_id;
  }

  async createMainTaskCollaborator() {
    try {
      const sql = `INSERT INTO main_task_collaborators
                     (
                        main_task_collaborator_uuid, 
                        main_task_fk_id, 
                        collaborator_fk_id
                     ) VALUES (?, ?, ?);`;
      const mainTaskCollaboratorValues = [
        this.main_task_collaborator_uuid,
        this.main_task_fk_id,
        this.collaborator_fk_id,
      ];
      const [data, _] = await conn.query(sql, mainTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create main task collaborator ---");
    }
  }

  static async deleteMainTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM main_task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task collaborator ---");
    }
  }

  static async getMainTaskCollaborator(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM main_task_collaborators
                WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get main task collaborator ---");
    }
  }

  static async getAllMainTaskCollaborators(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT u.name, u.surname, u.image, u.user_uuid,
                    mtc.main_task_collaborator_uuid

                    FROM main_task_collaborators AS mtc

                    INNER JOIN main_tasks AS mt
                    ON mtc.main_task_fk_id = mt.main_task_id

                    INNER JOIN users AS u
                    ON mtc.collaborator_fk_id = u.user_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all main task collaborators ---");
    }
  }
}
