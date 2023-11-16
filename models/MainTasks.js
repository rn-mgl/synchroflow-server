import conn from "../db/connection.js";

export class MainTasks {
  constructor(
    main_task_uuid,
    main_task_by,
    main_task_banner,
    main_task_title,
    main_task_subtitle,
    main_task_description,
    main_task_priority,
    main_task_start_date,
    main_task_end_date
  ) {
    this.main_task_uuid = main_task_uuid;
    this.main_task_by = main_task_by;
    this.main_task_banner = main_task_banner;
    this.main_task_title = main_task_title;
    this.main_task_subtitle = main_task_subtitle;
    this.main_task_description = main_task_description;
    this.main_task_priority = main_task_priority;
    this.main_task_start_date = main_task_start_date;
    this.main_task_end_date = main_task_end_date;
  }

  async createMainTask() {
    try {
      const sql = `INSERT INTO main_tasks
                  ( main_task_uuid,
                    main_task_by,
                    main_task_banner,
                    main_task_title,
                    main_task_subtitle,
                    main_task_description,
                    main_task_priority,
                    main_task_start_date,
                    main_task_end_date
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const mainTaskValues = [
        this.main_task_uuid,
        this.main_task_by,
        this.main_task_banner,
        this.main_task_title,
        this.main_task_subtitle,
        this.main_task_description,
        this.main_task_priority,
        this.main_task_start_date,
        this.main_task_end_date,
      ];

      const [data, _] = await conn.query(sql, mainTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- create main task ---");
    }
  }

  static async updateMainTask(
    main_task_banner,
    main_task_title,
    main_task_subtitle,
    main_task_description,
    main_task_priority,
    main_task_status,
    main_task_start_date,
    main_task_end_date,
    selector,
    value
  ) {
    try {
      const sql = `UPDATE main_tasks 
                  SET 
                    main_task_banner= ?,
                    main_task_title= ?,
                    main_task_subtitle= ?,
                    main_task_description= ?,
                    main_task_priority= ?,
                    main_task_status= ?,
                    main_task_start_date= ?,
                    main_task_end_date= ?
                  WHERE ${selector} = ?;`;
      const mainTaskValues = [
        main_task_banner,
        main_task_title,
        main_task_subtitle,
        main_task_description,
        main_task_priority,
        main_task_status,
        main_task_start_date,
        main_task_end_date,
        value,
      ];
      const [data, _] = await conn.query(sql, mainTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- update main task ---");
    }
  }

  static async getMainTask(selector, value) {
    try {
      const sql = `SELECT * FROM main_tasks
                  WHERE ${selector} = ?;`;
      const mainTaskValues = [value];
      const [data, _] = await conn.query(sql, mainTaskValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get main task ---");
    }
  }

  static async getAllMainTasks(selector, value) {
    try {
      const sql = `SELECT * FROM main_tasks AS mt
                  INNER JOIN main_task_collaborators AS mtc
                  ON mt.main_task_id = mtc.main_task_id
                  WHERE ${selector} = ?;`;
      const mainTaskValues = [value];
      const [data, _] = await conn.query(sql, mainTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all main tasks ---");
    }
  }

  static async deleteMainTask(selector, value) {
    try {
      const sql = `DELETE FROM main_tasks
                  WHERE ${selector} = ?;`;
      const mainTaskValues = [value];
      const [data, _] = await conn.query(sql, mainTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task ---");
    }
  }
}
