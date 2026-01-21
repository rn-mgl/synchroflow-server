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
      const sql = `SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "main task invite" AS purpose, mt.main_task_title AS title, mti.date_invited AS notif_date
                    FROM main_task_invites AS mti

                    INNER JOIN main_tasks AS mt
                    ON mti.main_task_fk_id = mt.main_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = mti.invited_by

                    WHERE ? = '1' AND 
                    invited_associate = ?
                    
                    UNION
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "sub task invite" AS purpose, st.sub_task_title AS title, stc.date_joined AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON stc.sub_task_fk_id = st.sub_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = st.sub_task_by 

                    WHERE ? = '1' AND 
                    stc.collaborator_fk_id = ?
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "associate invite" AS purpose, "associate request" AS title, ai.date_invited AS notif_date
                    FROM associate_invites AS ai

                    INNER JOIN users AS u_from
                    ON u_from.user_id = ai.associate_invite_from 

                    WHERE ? = '1' AND 
                    ai.associate_invite_to = ?
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "group member" AS purpose, gmr.room_name AS title, gmm.date_added AS notif_date
                    FROM group_message_rooms AS gmr

                    INNER JOIN group_message_members AS gmm
                    ON gmm.message_room_fk_id = gmr.message_room_id
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = gmr.created_by

                    WHERE ? = '1' AND 
                    gmm.member_fk_id = ?
                    AND gmr.created_by <> ?
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "private message" AS purpose,
                    CASE
                        WHEN pm.message IS NULL THEN pm.message_file ELSE pm.message
                    END AS title, pm.date_sent AS notif_date
                    FROM private_messages AS pm
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = pm.message_from

                    WHERE ? = '1' AND 
                    pm.message_to = ?

                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "group message" AS purpose,
                    CASE
                        WHEN gm.message IS NULL THEN gm.message_file ELSE gm.message
                    END AS title, gm.date_sent AS notif_date
                    FROM group_messages AS gm
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = gm.message_from

                    INNER JOIN group_message_rooms AS gmr
                    ON gm.message_room_fk_id = gmr.message_room_id

                    WHERE ? = '1' AND 
                    ? IN (
                      SELECT gmm.member_fk_id FROM group_message_members AS gmm
                      WHERE gmm.message_room_fk_id = gmr.message_room_id
                    ) AND 
                    gm.message_from <> ?

                    GROUP BY gm.message_from

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created main task deadline" AS purpose, mt.main_task_title AS title, mt.main_task_end_date AS notif_date
                    FROM main_tasks AS mt
                    
                    INNER JOIN users AS u
                    ON u.user_id = mt.main_task_by

                    WHERE ? = '1' AND 
                    mt.main_task_by = ? AND
                    CAST(mt.main_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated main task deadline" AS purpose, mt.main_task_title AS title, mt.main_task_end_date AS notif_date
                    FROM main_task_collaborators AS mtc

                    INNER JOIN main_tasks AS mt
                    ON mt.main_task_id = mtc.main_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = mtc.collaborator_fk_id	

                    WHERE ? = '1' AND 
                    mtc.collaborator_fk_id = ? AND
                    CAST(mt.main_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created sub task deadline" AS purpose, st.sub_task_title AS title, st.sub_task_end_date AS notif_date
                    FROM sub_tasks AS st
                    
                    INNER JOIN users AS u
                    ON u.user_id = st.sub_task_by

                    WHERE ? = '1' AND 
                    st.sub_task_by = ? AND
                    CAST(st.sub_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated sub task deadline" AS purpose, st.sub_task_title AS title, st.sub_task_end_date AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON st.sub_task_id = stc.sub_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = stc.collaborator_fk_id	

                    WHERE ? = '1' AND 
                    stc.collaborator_fk_id = ? AND
                    CAST(st.sub_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "assigned sub task" AS purpose, st.sub_task_title AS title, stc.date_joined AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON st.sub_task_id = stc.sub_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = stc.collaborator_fk_id	

                    WHERE ? = '1' AND 
                    stc.collaborator_fk_id = ?
                    
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
