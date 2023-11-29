import conn from "../db/connection.js";

class Dashboard {
  constructor() {}

  static async getDashboardData(whereValues) {
    try {
      const sqlMainTask = `SELECT * FROM main_tasks AS mt
                            WHERE mt.main_task_by = ?;`;
      const mainTaskValues = [whereValues];
      const [mainTaskData, _mt] = await conn.query(sqlMainTask, mainTaskValues);

      return { mainTaskData };
    } catch (error) {
      console.log(error);
    }
  }
}
