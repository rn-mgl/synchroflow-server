import conn from "../db/connection.js";
import { mainTasksFilterKey } from "../utils/filterUtils.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

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
    mainTaskBanner,
    mainTaskTitle,
    mainTaskSubtitle,
    mainTaskDescription,
    mainTaskStatus,
    mainTaskPriority,
    mainTaskStartDate,
    mainTaskEndDate,
    mainTaskId
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
                  WHERE main_task_id = '${mainTaskId}';`;
      const updateTaskValues = [
        mainTaskBanner,
        mainTaskTitle,
        mainTaskSubtitle,
        mainTaskDescription,
        mainTaskPriority,
        mainTaskStatus,
        mainTaskStartDate,
        mainTaskEndDate,
      ];
      const [data, _] = await conn.query(sql, updateTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- update main task ---");
    }
  }

  static async getMainTask(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM main_tasks AS mt
                  INNER JOIN users AS u ON
                  mt.main_task_by = u.user_id
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get main task ---");
    }
  }

  static async getAllMainTasks(whereConditions, whereValues, sortFilter, searchFilter, searchCategory) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    const sortValue = mainTasksFilterKey[sortFilter];
    const searchCategoryValue = mainTasksFilterKey[searchCategory];

    try {
      const sql = `SELECT * FROM main_tasks AS mt
                  LEFT JOIN main_task_collaborators AS mtc
                  ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND ${searchCategoryValue} LIKE '%${searchFilter}%'
                  GROUP BY mt.main_task_id
                  ORDER BY mt.${sortValue};`;

      const [data, _] = await conn.query(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get all main tasks ---");
    }
  }

  static async getAllMainTasksToday(whereConditions, whereValues, sortFilter, searchFilter, searchCategory) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    const sortValue = mainTasksFilterKey[sortFilter];
    const searchCategoryValue = mainTasksFilterKey[searchCategory];

    try {
      const sql = `SELECT * FROM main_tasks AS mt
                  LEFT JOIN main_task_collaborators AS mtc
                  ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND ${searchCategoryValue} LIKE '%${searchFilter}%'
                  AND CAST(mt.main_task_end_date AS DATE) = CURDATE()
                  GROUP BY mt.main_task_id
                  ORDER BY mt.${sortValue};`;

      const [data, _] = await conn.query(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get all main tasks ---");
    }
  }

  static async getAllMyUpcomingMainTasks(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM main_tasks AS mt
                  LEFT JOIN main_task_collaborators AS mtc
                  ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND CAST(mt.main_task_end_date AS DATE) > CURDATE()
                  GROUP BY mt.main_task_id
                  ORDER BY mt.main_task_end_date;`;

      const [data, _] = await conn.query(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get all upcoming main tasks ---");
    }
  }

  static async deleteMainTask(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM main_tasks
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete main task ---");
    }
  }
}
