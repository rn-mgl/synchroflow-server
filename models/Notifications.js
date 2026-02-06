import conn from "../db/connection.js";

export class Notifications {
  constructor() {}

  static async getNotifications(
    userID,
    associateInvite,
    messageNotification,
    taskDeadline,
    taskUpdate,
    limit = 10,
  ) {
    try {
      const sql = `SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "main task invite" AS purpose, t.title, ti.date_invited AS notif_date
                    FROM task_invites AS ti

                    INNER JOIN tasks AS t
                    ON ti.task_fk_id = t.task_id

                    INNER JOIN users AS u
                    ON u.user_id = ti.invite_from

                    WHERE ? = 1 AND 
                    invite_to = ? AND
                    t.parent_task IS NULL
                    
                    UNION
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "sub task invite" AS purpose, t.title, tc.date_joined AS notif_date
                    FROM task_collaborators AS tc

                    INNER JOIN tasks AS t
                    ON tc.task_fk_id = t.task_id

                    INNER JOIN users AS u
                    ON u.user_id = t.task_by 

                    WHERE ? = 1 AND 
                    tc.collaborator_fk_id = ? AND
                    t.parent_task IS NOT NULL
                    
                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "associate invite" AS purpose, "associate request" AS title, ai.date_invited AS notif_date
                    FROM associate_invites AS ai

                    INNER JOIN users AS u
                    ON u.user_id = ai.associate_invite_from 

                    WHERE ? = 1 AND 
                    ai.associate_invite_to = ?
                    
                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "group member" AS purpose, mr.room_name AS title, rm.date_added AS notif_date
                    FROM message_rooms AS mr

                    INNER JOIN room_members AS rm
                    ON rm.room_fk_id = mr.message_room_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = mr.created_by

                    WHERE ? = 1 AND 
                    rm.member_fk_id = ?
                    AND mr.created_by <> ?
                    AND mr.room_type = "group"
                    
                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "private message" AS purpose,
                    CASE
                        WHEN m.message IS NULL THEN m.message_file ELSE m.message
                    END AS title, m.date_sent AS notif_date
                    FROM messages AS m
                    
                    INNER JOIN users AS u
                    ON u.user_id = m.sender

                    INNER JOIN message_rooms AS mr
                    ON m.room_fk_id = mr.message_room_id

                    WHERE ? = 1 AND 
                    m.sender != ?
                    AND mr.room_type = "private"

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "group message" AS purpose,
                    CASE
                        WHEN m.message IS NULL THEN m.message_file ELSE m.message
                    END AS title, m.date_sent AS notif_date
                    FROM messages AS m
                    
                    INNER JOIN users AS u
                    ON u.user_id = m.sender

                    INNER JOIN message_rooms AS mr
                    ON m.room_fk_id = mr.message_room_id

                    WHERE ? = 1 AND 
                    ? IN (
                      SELECT rm.member_fk_id FROM room_members AS rm
                      WHERE rm.room_fk_id = mr.message_room_id
                    ) AND 
                    m.sender <> ?
                    AND mr.room_type = "group"

                    GROUP BY m.sender

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created main task deadline" AS purpose, t.title, t.end_date AS notif_date
                    FROM tasks AS t
                    
                    INNER JOIN users AS u
                    ON u.user_id = t.task_by

                    WHERE ? = 1 AND 
                    t.task_by = ? AND
                    CAST(t.end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated main task deadline" AS purpose, t.title, t.end_date AS notif_date
                    FROM task_collaborators AS tc

                    INNER JOIN tasks AS t
                    ON t.task_id = tc.task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = tc.collaborator_fk_id	

                    WHERE ? = 1 AND 
                    tc.collaborator_fk_id = ? AND
                    CAST(t.end_date AS DATE) = CURDATE() AND
                    t.parent_task IS NULL

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created sub task deadline" AS purpose, t.title, t.end_date AS notif_date
                    FROM tasks AS t
                    
                    INNER JOIN users AS u
                    ON u.user_id = t.task_by

                    WHERE ? = 1 AND 
                    t.task_by = ? AND
                    CAST(t.end_date AS DATE) = CURDATE() AND
                    t.parent_task IS NOT NULL

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated sub task deadline" AS purpose, t.title, t.end_date AS notif_date
                    FROM task_collaborators AS tc

                    INNER JOIN tasks AS t
                    ON t.task_id = tc.task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = tc.collaborator_fk_id	

                    WHERE ? = 1 AND 
                    tc.collaborator_fk_id = ? AND
                    CAST(t.end_date AS DATE) = CURDATE() AND
                    t.parent_task IS NOT NULL

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "assigned sub task" AS purpose, t.title, tc.date_joined AS notif_date
                    FROM task_collaborators AS tc

                    INNER JOIN tasks AS t
                    ON t.task_id = tc.task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = tc.collaborator_fk_id	

                    WHERE ? = 1 AND 
                    tc.collaborator_fk_id = ? AND
                    t.parent_task IS NOT NULL
                    
                    ORDER BY notif_date DESC
                    
                    LIMIT ?;`;

      const values = [
        taskUpdate,
        userID,
        taskUpdate,
        userID,
        associateInvite,
        userID,
        associateInvite,
        userID,
        userID,
        messageNotification,
        userID,
        messageNotification,
        userID,
        userID,
        taskDeadline,
        userID,
        taskDeadline,
        userID,
        taskDeadline,
        userID,
        taskDeadline,
        userID,
        taskUpdate,
        userID,
        limit,
      ];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get notifications ---");
      return [];
    }
  }
}
