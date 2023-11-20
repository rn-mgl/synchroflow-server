import conn from "../db/connection.js";

export class MainTaskCollaborators {
  constructor(main_task_collaborator_uuid, main_task_id, collaborator_id) {
    this.main_task_collaborator_uuid = main_task_collaborator_uuid;
    this.main_task_id = main_task_id;
    this.collaborator_id = collaborator_id;
  }

  async createMainTaskCollaborator() {
    try {
      const sql = `INSERT INTO main_task_collaborators
                     (
                        main_task_collaborator_uuid, 
                        main_task_id, 
                        collaborator_id
                     ) VALUES (?, ?, ?);`;
      const mainTaskCollaboratorValues = [this.main_task_collaborator_uuid, this.main_task_id, this.collaborator_id];
      const [data, _] = await conn.query(sql, mainTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create main task collaborator ---");
    }
  }

  static async deleteMainTaskCollaborator(selector, value) {
    try {
      const sql = `DELETE FROM main_task_collaborators
                WHERE ${selector} = ?;`;
      const mainTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, mainTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task collaborator ---");
    }
  }

  static async getMainTaskCollaborator(selector, value) {
    try {
      const sql = `SELECT * FROM main_task_collaborators
                WHERE ${selector} = ?;`;
      const mainTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, mainTaskCollaboratorValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get main task collaborator ---");
    }
  }

  static async getAllMainTaskCollaborators(selector, value) {
    try {
      const sql = `SELECT * FROM main_task_collaborators AS mtc
                    INNER JOIN main_tasks AS mt
                    ON mtc.main_task_fk_id = mt.main_task_id
                    INNER JOIN users AS u
                    ON mtc.collaborator_id = u.user_id
                    WHERE ${selector} = ?;`;
      const mainTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, mainTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all main task collaborators ---");
    }
  }
}
