import conn from "../db/connection.js";

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
    try {
      const sql = `DELETE FROM sub_task_collaborators
                WHERE ${whereConditions} = ?;`;
      const subTaskCollaboratorValues = [whereValues];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task collaborator ---");
    }
  }

  static async getSubTaskCollaborator(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM sub_task_collaborators
                WHERE ${whereConditions} = ?;`;
      const subTaskCollaboratorValues = [whereValues];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get sub task collaborator ---");
    }
  }

  static async getAllSubTaskCollaborators(whereConditions, whereValues) {
    try {
      const sql = `SELECT u.name, u.surname, u.user_uuid, u.image
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON stc.sub_task_fk_id = st.sub_task_id

                    LEFT JOIN main_task_collaborators AS mtc
                    ON st.main_task_fk_id = mtc.main_task_fk_id

                    LEFT JOIN users AS u
                    ON u.user_id = stc.collaborator_id
                    
                    WHERE ${whereConditions} = ?;`;
      const subTaskCollaboratorValues = [whereValues];
      const [data, _] = await conn.query(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all sub task collaborators ---");
    }
  }
}
