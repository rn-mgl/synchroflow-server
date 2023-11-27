import conn from "../db/connection.js";

export class SubTasks {
  constructor(
    sub_task_uuid,
    sub_task_by,
    main_task_fk_id,
    sub_task_title,
    sub_task_subtitle,
    sub_task_description,
    sub_task_priority,
    sub_task_start_date,
    sub_task_end_date
  ) {
    this.sub_task_uuid = sub_task_uuid;
    this.sub_task_by = sub_task_by;
    this.main_task_fk_id = main_task_fk_id;
    this.sub_task_title = sub_task_title;
    this.sub_task_subtitle = sub_task_subtitle;
    this.sub_task_description = sub_task_description;
    this.sub_task_priority = sub_task_priority;
    this.sub_task_start_date = sub_task_start_date;
    this.sub_task_end_date = sub_task_end_date;
  }

  async createSubTask() {
    try {
      const sql = `INSERT INTO sub_tasks
                  ( 
                    sub_task_uuid,
                    sub_task_by,
                    main_task_fk_id,
                    sub_task_title,
                    sub_task_subtitle,
                    sub_task_description,
                    sub_task_priority,
                    sub_task_start_date,
                    sub_task_end_date
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const subTaskValues = [
        this.sub_task_uuid,
        this.sub_task_by,
        this.main_task_fk_id,
        this.sub_task_title,
        this.sub_task_subtitle,
        this.sub_task_description,
        this.sub_task_priority,
        this.sub_task_start_date,
        this.sub_task_end_date,
      ];

      const [data, _] = await conn.query(sql, subTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- create sub task ---");
    }
  }

  static async updateSubTask(
    sub_task_title,
    sub_task_subtitle,
    sub_task_description,
    sub_task_priority,
    sub_task_status,
    sub_task_start_date,
    sub_task_end_date,
    selector,
    value
  ) {
    try {
      const sql = `UPDATE sub_tasks 
                  SET 
                    sub_task_title= ?,
                    sub_task_subtitle= ?,
                    sub_task_description= ?,
                    sub_task_priority= ?,
                    sub_task_status= ?,
                    sub_task_start_date= ?,
                    sub_task_end_date= ?
                  WHERE ${selector} = ?;`;
      const subTaskValues = [
        sub_task_title,
        sub_task_subtitle,
        sub_task_description,
        sub_task_priority,
        sub_task_status,
        sub_task_start_date,
        sub_task_end_date,
        value,
      ];
      const [data, _] = await conn.query(sql, subTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- update sub task ---");
    }
  }

  static async getSubTask(selector, value) {
    try {
      const sql = `SELECT * FROM sub_tasks
                  WHERE ${selector} = ?;`;
      const subTaskValues = [value];
      const [data, _] = await conn.query(sql, subTaskValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get sub task ---");
    }
  }

  static async getAllSubTasks(selector, value) {
    try {
      const sql = `SELECT * FROM sub_tasks AS st
                  INNER JOIN main_tasks AS mt
                  ON st.main_task_fk_id = mt.main_task_id
                  WHERE ${selector} = ?;`;
      const subTaskValues = [value];
      const [data, _] = await conn.query(sql, subTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all sub tasks ---");
    }
  }

  static async deleteSubTask(selector, value) {
    try {
      const sql = `DELETE FROM sub_tasks
                  WHERE ${selector} = ?;`;
      const subTaskValues = [value];
      const [data, _] = await conn.query(sql, subTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete sub task ---");
    }
  }
}
