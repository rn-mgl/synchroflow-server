import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Dashboard {
  constructor() {}

  static async getDashboardData(userID) {
    try {
      const tasks = `SELECT COUNT(CASE WHEN mt.main_task_status = 'ongoing' THEN 1 ELSE NULL END) AS ongoingTasksCount, 
                    COUNT(CASE WHEN mt.main_task_status = 'done' THEN 1 ELSE NULL END) AS doneTasksCount,
                    COUNT(CASE WHEN mt.main_task_status = 'late' THEN 1 ELSE NULL END) AS lateTasksCount

                    FROM users AS u

                    LEFT JOIN main_tasks AS mt
                    ON u.user_id = mt.main_task_by

                    LEFT JOIN main_task_collaborators AS mtc
                    ON u.user_id = mtc.collaborator_id

                    LEFT JOIN sub_tasks AS st
                    ON u.user_id = st.sub_task_by

                    LEFT JOIN sub_task_collaborators AS stc
                    ON u.user_id = stc.collaborator_id
      
                    WHERE u.user_id = '${userID}';`;

      const weeklyTasks = `SELECT DAYOFWEEK(mt.main_task_end_date) AS day, COUNT(mt.main_task_id) AS taskCount
 
                    FROM users AS u

                    LEFT JOIN main_tasks AS mt
                    ON u.user_id = mt.main_task_by
      
                    WHERE u.user_id = '${userID}'
                    AND mt.main_task_end_date >= DATE_SUB(NOW(), INTERVAL WEEKDAY(NOW()) DAY)
                    AND mt.main_task_end_date < DATE_ADD(NOW(), INTERVAL 7 - WEEKDAY(NOW()) DAY)
                    GROUP BY DATE(main_task_end_date)
                    
                    UNION 

                    SELECT DAYOFWEEK(st.sub_task_end_date) AS day, COUNT(st.sub_task_id) AS taskCount
 
                    FROM users AS u

                    LEFT JOIN sub_tasks AS st
                    ON u.user_id = st.sub_task_by
      
                    WHERE u.user_id = '${userID}'
                    AND st.sub_task_end_date >= DATE_SUB(NOW(), INTERVAL WEEKDAY(NOW()) DAY)
                    AND st.sub_task_end_date < DATE_ADD(NOW(), INTERVAL 7 - WEEKDAY(NOW()) DAY)
                    GROUP BY DATE(sub_task_end_date)

                    UNION 

                    SELECT DAYOFWEEK(mt.main_task_end_date) AS day, COUNT(mt.main_task_id) AS taskCount
 
                    FROM users AS u

                    LEFT JOIN main_task_collaborators AS mtc
                    ON u.user_id = mtc.collaborator_id

                    LEFT JOIN main_tasks AS mt
                    ON mtc.main_task_fk_id = mt.main_task_id
      
                    WHERE u.user_id = '${userID}'
                    AND mt.main_task_end_date >= DATE_SUB(NOW(), INTERVAL WEEKDAY(NOW()) DAY)
                    AND mt.main_task_end_date < DATE_ADD(NOW(), INTERVAL 7 - WEEKDAY(NOW()) DAY)
                    GROUP BY DATE(main_task_end_date)
                    
                    UNION 

                    SELECT DAYOFWEEK(st.sub_task_end_date) AS day, COUNT(st.sub_task_id) AS taskCount
 
                    FROM users AS u

                    LEFT JOIN sub_task_collaborators AS stc
                    ON u.user_id = stc.collaborator_id

                    LEFT JOIN sub_tasks AS st
                    ON stc.sub_task_fk_id = st.sub_task_id
      
                    WHERE u.user_id = '${userID}'
                    AND st.sub_task_end_date >= DATE_SUB(NOW(), INTERVAL WEEKDAY(NOW()) DAY)
                    AND st.sub_task_end_date < DATE_ADD(NOW(), INTERVAL 7 - WEEKDAY(NOW()) DAY)
                    GROUP BY DATE(sub_task_end_date)`;

      const [tasksCount, _tasks] = await conn.execute(tasks);
      const [weekTasksCount, _weeklyTasks] = await conn.execute(weeklyTasks);

      return { tasksCount: tasksCount[0], weekTasksCount };
    } catch (error) {
      console.log(error);
    }
  }
}
