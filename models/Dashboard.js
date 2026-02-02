import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Dashboard {
  constructor() {}

  static async getDashboardData(userID) {
    try {
      const tasks = `SELECT 
                  -- Ongoing  Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  WHERE t.task_by = ? 
                  AND t.status = 'ongoing')
                  +
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  INNER JOIN task_collaborators AS tc 
                        ON t.task_id = tc.task_fk_id
                  WHERE tc.collaborator_fk_id = ?
                  AND t.status = 'ongoing')
                  AS ongoingTasksCount,

                  -- Done  Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  WHERE t.task_by = ? 
                  AND t.status = 'done')
                  +
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  INNER JOIN task_collaborators AS tc 
                        ON t.task_id = tc.task_fk_id
                  WHERE tc.collaborator_fk_id = ?
                  AND t.status = 'done')
                  AS doneTasksCount,

                  -- Late  Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  WHERE t.task_by = ? 
                  AND t.status = 'late')
                  +
                  (SELECT COUNT(DISTINCT t.task_id)
                  FROM tasks AS t
                  INNER JOIN task_collaborators AS tc 
                        ON t.task_id = tc.task_fk_id
                  WHERE tc.collaborator_fk_id = ?
                  AND t.status = 'late')
                  AS lateTasksCount`;

      const weeklyTasks = `SELECT DAYOFWEEK(t.end_date) AS day,
                        COUNT(t.task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN tasks AS t
                        ON u.user_id = t.task_by
                        WHERE u.user_id = ?
                        AND t.end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND t.end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(t.end_date)

                        UNION ALL

                        SELECT DAYOFWEEK(t.end_date) AS day,
                              COUNT(t.task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN task_collaborators AS tc
                        ON u.user_id = tc.collaborator_fk_id
                        LEFT JOIN tasks AS t
                        ON tc.task_fk_id = t.task_id
                        WHERE u.user_id = ?
                        AND t.end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND t.end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(t.end_date);`;

      const tasksValues = new Array(6).fill(userID);
      const weeklyTaskValues = new Array(2).fill(userID);

      const [tasksCount, _tasks] = await conn.execute(tasks, tasksValues);
      const [weekTasksCount, _weeklyTasks] = await conn.execute(
        weeklyTasks,
        weeklyTaskValues,
      );

      return { tasksCount: tasksCount[0], weekTasksCount };
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
