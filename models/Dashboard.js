import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Dashboard {
  constructor() {}

  static async getDashboardData(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sqlMainTask = `SELECT * FROM main_tasks AS mt
                            WHERE ${mappedWhereConditions};`;

      const [mainTaskData, _mt] = await conn.query(sqlMainTask, whereValues);

      return { mainTaskData };
    } catch (error) {
      console.log(error);
    }
  }
}
