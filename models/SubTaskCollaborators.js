import conn from "../db/connection";

export class SubTaskCollaborators {
  constructor(sub_task_collaborator_uuid, sub_task_id, collaborator_id) {
    this.sub_task_collaborator_uuid = sub_task_collaborator_uuid;
    this.sub_task_id = sub_task_id;
    this.collaborator_id = collaborator_id;
  }

  async createMainTaskCollaborator() {
    try {
      const sql = `INSERT INTO sub_task_collaborators
                     (
                        sub_task_collaborator_uuid, 
                        sub_task_id, 
                        collaborator_id
                     ) VALUES (?, ?, ?);`;
      const subTaskCollaboratorValues = [this.sub_task_collaborator_uuid, this.sub_task_id, this.collaborator_id];
      const [data, _] = await conn.execute(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task collaborator ---");
    }
  }

  static async deleteMainTaskCollaborator(selector, value) {
    try {
      const sql = `DELETE FROM sub_task_collaborators
                WHERE ${selector} = ?;`;
      const subTaskCollaboratorValues = [value];
      const [data, _] = await conn.execute(sql, subTaskCollaboratorValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task collaborator ---");
    }
  }
}
