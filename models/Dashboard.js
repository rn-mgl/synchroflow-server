import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Dashboard {
  constructor() {}

  static async getDashboardData(userID) {
    try {
      const tasks = `SELECT 
                  -- Ongoing Main Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  WHERE mt.main_task_by = ? 
                  AND mt.main_task_status = 'ongoing')
                  +
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  INNER JOIN main_task_collaborators AS mtc 
                        ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE mtc.collaborator_fk_id = ?
                  AND mt.main_task_status = 'ongoing')
                  AS ongoingMainTasksCount,

                  -- Done Main Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  WHERE mt.main_task_by = ? 
                  AND mt.main_task_status = 'done')
                  +
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  INNER JOIN main_task_collaborators AS mtc 
                        ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE mtc.collaborator_fk_id = ?
                  AND mt.main_task_status = 'done')
                  AS doneMainTasksCount,

                  -- Late Main Tasks (owned or collaborated)
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  WHERE mt.main_task_by = ? 
                  AND mt.main_task_status = 'late')
                  +
                  (SELECT COUNT(DISTINCT mt.main_task_id)
                  FROM main_tasks AS mt
                  INNER JOIN main_task_collaborators AS mtc 
                        ON mt.main_task_id = mtc.main_task_fk_id
                  WHERE mtc.collaborator_fk_id = ?
                  AND mt.main_task_status = 'late')
                  AS lateMainTasksCount,

                  -- Ongoing Sub Tasks (collaborated only)
                  (SELECT COUNT(DISTINCT st.sub_task_id)
                  FROM sub_tasks AS st
                  INNER JOIN sub_task_collaborators AS stc 
                        ON st.sub_task_id = stc.sub_task_fk_id
                  WHERE st.sub_task_by <> ? 
                  AND stc.collaborator_fk_id = ?
                  AND st.sub_task_status = 'ongoing')
                  AS ongoingSubTasksCount,

                  -- Done Sub Tasks (collaborated only)
                  (SELECT COUNT(DISTINCT st.sub_task_id)
                  FROM sub_tasks AS st
                  INNER JOIN sub_task_collaborators AS stc 
                        ON st.sub_task_id = stc.sub_task_fk_id
                  WHERE st.sub_task_by <> ? 
                  AND stc.collaborator_fk_id = ?
                  AND st.sub_task_status = 'done')
                  AS doneSubTasksCount,

                  -- Late Sub Tasks (collaborated only)
                  (SELECT COUNT(DISTINCT st.sub_task_id)
                  FROM sub_tasks AS st
                  INNER JOIN sub_task_collaborators AS stc 
                        ON st.sub_task_id = stc.sub_task_fk_id
                  WHERE st.sub_task_by <> ? 
                  AND stc.collaborator_fk_id = ?
                  AND st.sub_task_status = 'late')
                  AS lateSubTasksCount`;

      const weeklyTasks = `SELECT DAYOFWEEK(mt.main_task_end_date) AS day,
                        COUNT(mt.main_task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN main_tasks AS mt
                        ON u.user_id = mt.main_task_by
                        WHERE u.user_id = ?
                        AND mt.main_task_end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND mt.main_task_end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(mt.main_task_end_date)

                        UNION ALL

                        SELECT DAYOFWEEK(st.sub_task_end_date) AS day,
                              COUNT(st.sub_task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN sub_tasks AS st
                        ON u.user_id = st.sub_task_by
                        WHERE u.user_id = ?
                        AND st.sub_task_end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND st.sub_task_end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(st.sub_task_end_date)

                        UNION ALL

                        SELECT DAYOFWEEK(mt.main_task_end_date) AS day,
                              COUNT(mt.main_task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN main_task_collaborators AS mtc
                        ON u.user_id = mtc.collaborator_fk_id
                        LEFT JOIN main_tasks AS mt
                        ON mtc.main_task_fk_id = mt.main_task_id
                        WHERE u.user_id = ?
                        AND mt.main_task_end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND mt.main_task_end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(mt.main_task_end_date)

                        UNION ALL

                        SELECT DAYOFWEEK(st.sub_task_end_date) AS day,
                              COUNT(st.sub_task_id) AS taskCount
                        FROM users AS u
                        LEFT JOIN sub_task_collaborators AS stc
                        ON u.user_id = stc.collaborator_fk_id
                        LEFT JOIN sub_tasks AS st
                        ON stc.sub_task_fk_id = st.sub_task_id
                        WHERE u.user_id = ?
                        AND st.sub_task_end_date >= CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY
                        AND st.sub_task_end_date <  CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY + INTERVAL 7 DAY
                        GROUP BY DAYOFWEEK(st.sub_task_end_date);`;

      const tasksValues = new Array(12).fill(userID);
      const weeklyTaskValues = new Array(4).fill(userID);

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
