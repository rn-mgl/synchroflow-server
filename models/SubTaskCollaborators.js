import conn from "../db/connection.js";

export class SubTaskCollaborators {
  constructor(sub_task_collaborator_uuid, sub_task_id, collaborator_id) {
    this.sub_task_collaborator_uuid = sub_task_collaborator_uuid;
    this.sub_task_id = sub_task_id;
    this.collaborator_id = collaborator_id;
  }

  async createSubTaskCollaborator() {
    try {
      const sql = `INSERT INTO sub_task_collaborators
                     (
                        sub_task_collaborator_uuid, 
                        sub_task_id, 
                        collaborator_id
                     ) VALUES (?, ?, ?);`;
      const subTaskCollaboratorValues = [this.sub_task_collaborator_uuid, this.sub_task_id, this.collaborator_id];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task collaborator ---");
    }
  }

  static async deleteSubTaskCollaborator(selector, value) {
    try {
      const sql = `DELETE FROM sub_task_collaborators
                WHERE ${selector} = ?;`;
      const subTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task collaborator ---");
    }
  }

  static async getSubTaskCollaborator(selector, value) {
    try {
      const sql = `SELECT * FROM sub_task_collaborators
                WHERE ${selector} = ?;`;
      const subTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get sub task collaborator ---");
    }
  }

  static async getAllSubTaskCollaborators(selector, value) {
    try {
      const sql = `SELECT * FROM sub_task_collaborators AS stc
                    INNER JOIN sub_tasks AS st
                    ON stc.sub_task_id = st.sub_task_id
                    WHERE ${selector} = ?;`;
      const subTaskCollaboratorValues = [value];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all sub task collaborators ---");
    }
  }
}
