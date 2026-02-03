import conn from "../db/connection.js";
import { tasksFilterKey } from "../utils/filterUtils.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Tasks {
  constructor(
    task_uuid,
    task_by,
    parent_task,
    banner,
    title,
    subtitle,
    description,
    priority,
    start_date,
    end_date,
  ) {
    this.task_uuid = task_uuid;
    this.task_by = task_by;
    this.parent_task = parent_task;
    this.banner = banner;
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.priority = priority;
    this.start_date = start_date;
    this.end_date = end_date;
  }

  async createTask() {
    try {
      const sql = `INSERT INTO tasks
                  ( task_uuid,
                    task_by,
                    parent_task,
                    banner,
                    title,
                    subtitle,
                    description,
                    priority,
                    start_date,
                    end_date
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const taskValues = [
        this.task_uuid,
        this.task_by,
        this.parent_task,
        this.banner,
        this.title,
        this.subtitle,
        this.description,
        this.priority,
        this.start_date,
        this.end_date,
      ];

      const [data, _] = await conn.query(sql, taskValues);
      return data;
    } catch (error) {
      console.log(error + "--- create task ---");
      return [];
    }
  }

  static async updateTask(
    taskBanner,
    taskTitle,
    taskSubtitle,
    taskDescription,
    taskStatus,
    taskPriority,
    taskStartDate,
    taskEndDate,
    taskId,
  ) {
    try {
      const sql = `UPDATE tasks 
                  SET 
                    banner= ?,
                    title= ?,
                    subtitle= ?,
                    description= ?,
                    priority= ?,
                    status= ?,
                    start_date= ?,
                    end_date= ?
                  WHERE task_id = ?;`;
      const updateTaskValues = [
        taskBanner,
        taskTitle,
        taskSubtitle,
        taskDescription,
        taskPriority,
        taskStatus,
        taskStartDate,
        taskEndDate,
        taskId,
      ];
      const [data, _] = await conn.query(sql, updateTaskValues);
      return data;
    } catch (error) {
      console.log(error + "--- update task ---");
      return [];
    }
  }

  static async getTask(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM tasks AS t
                  INNER JOIN users AS u ON
                  t.task_by = u.user_id
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get task ---");
      return [];
    }
  }

  static async getAllTasks(
    whereConditions,
    whereValues,
    sortFilter = "title",
    searchFilter = "",
    searchCategory = "title",
  ) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    const sortValue = tasksFilterKey[sortFilter];
    const searchCategoryValue = tasksFilterKey[searchCategory];

    try {
      const sql = `SELECT * FROM tasks AS t
                  LEFT JOIN task_collaborators AS tc
                  ON t.task_id = tc.task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND ${searchCategoryValue} LIKE ?
                  GROUP BY t.task_id
                  ORDER BY t.${sortValue};`;

      const [data, _] = await conn.query(sql, [
        ...whereValues,
        `%${searchFilter}%`,
      ]);

      return data;
    } catch (error) {
      console.log(error + "--- get all tasks ---");
      return [];
    }
  }

  static async getAllTasksToday(
    whereConditions,
    whereValues,
    sortFilter,
    searchFilter,
    searchCategory,
  ) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    const sortValue = tasksFilterKey[sortFilter];
    const searchCategoryValue = tasksFilterKey[searchCategory];

    try {
      const sql = `SELECT * FROM tasks AS t
                  LEFT JOIN task_collaborators AS tc
                  ON t.task_id = tc.task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND ${searchCategoryValue} LIKE ?
                  AND CAST(t.end_date AS DATE) = CURDATE()
                  GROUP BY t.task_id
                  ORDER BY t.${sortValue};`;

      const [data, _] = await conn.query(sql, [
        ...whereValues,
        `%${searchFilter}%`,
      ]);

      return data;
    } catch (error) {
      console.log(error + "--- get all tasks ---");
      return [];
    }
  }

  static async getAllMyUpcomingTasks(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM tasks AS t
                  LEFT JOIN task_collaborators AS tc
                  ON t.task_id = tc.task_fk_id
                  WHERE ${mappedWhereConditions}
                  AND CAST(t.end_date AS DATE) > CURDATE()
                  GROUP BY t.task_id
                  ORDER BY t.end_date;`;

      const [data, _] = await conn.query(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get all upcoming tasks ---");
      return [];
    }
  }

  static async deleteTask(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM tasks
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete task ---");
      return [];
    }
  }
}
