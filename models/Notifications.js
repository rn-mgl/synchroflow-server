import conn from "../db/connection.js";

export class Notifications {
  constructor() {}

  static async getNotifications(userID, associateInvite, messageNotification, taskDeadline, taskUpdate) {
    try {
      const sql = `SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "main task invite" AS purpose, mt.main_task_title AS title, mti.date_invited AS notif_date
                    FROM main_task_invites AS mti

                    INNER JOIN main_tasks AS mt
                    ON mti.main_task_fk_id = mt.main_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = mti.invited_by

                    WHERE '${taskUpdate}' = '1' AND 
                    invited_associate = '${userID}'
                    
                    UNION
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "sub task invite" AS purpose, st.sub_task_title AS title, stc.date_joined AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON stc.sub_task_fk_id = st.sub_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = st.sub_task_by 

                    WHERE '${taskUpdate}' = '1' AND 
                    stc.collaborator_id = '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "associate invite" AS purpose, "associate request" AS title, ai.date_invited AS notif_date
                    FROM associate_invites AS ai

                    INNER JOIN users AS u_from
                    ON u_from.user_id = ai.associate_invite_from 

                    WHERE '${associateInvite}' = '1' AND 
                    ai.associate_invite_to = '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "group member" AS purpose, gmr.room_name AS title, gmm.date_added AS notif_date
                    FROM group_message_rooms AS gmr

                    INNER JOIN group_message_members AS gmm
                    ON gmm.message_room_fk_id = gmr.message_room_id
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = gmr.created_by

                    WHERE '${associateInvite}' = '1' AND 
                    gmm.member_fk_id = '${userID}'
                    AND gmr.created_by <> '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "private message" AS purpose,
                    CASE
                        WHEN pm.message IS NULL THEN pm.message_file ELSE pm.message
                    END AS title, pm.date_sent AS notif_date
                    FROM private_messages AS pm
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = pm.message_from

                    WHERE '${messageNotification}' = '1' AND 
                    pm.message_to = '${userID}'

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

                    WHERE '${messageNotification}' = '1' AND 
                    '${userID}' IN (
                      SELECT gmm.member_fk_id FROM group_message_members AS gmm
                      WHERE gmm.message_room_fk_id = gmr.message_room_id
                    ) AND 
                    gm.message_from <> '${userID}'

                    GROUP BY gm.message_from

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created main task deadline" AS purpose, mt.main_task_title AS title, mt.main_task_end_date AS notif_date
                    FROM main_tasks AS mt
                    
                    INNER JOIN users AS u
                    ON u.user_id = mt.main_task_by

                    WHERE '${taskDeadline}' = '1' AND 
                    mt.main_task_by = '${userID}' AND
                    CAST(mt.main_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated main task deadline" AS purpose, mt.main_task_title AS title, mt.main_task_end_date AS notif_date
                    FROM main_task_collaborators AS mtc

                    INNER JOIN main_tasks AS mt
                    ON mt.main_task_id = mtc.main_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = mtc.collaborator_id	

                    WHERE '${taskDeadline}' = '1' AND 
                    mtc.collaborator_id = '${userID}' AND
                    CAST(mt.main_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "created sub task deadline" AS purpose, st.sub_task_title AS title, st.sub_task_end_date AS notif_date
                    FROM sub_tasks AS st
                    
                    INNER JOIN users AS u
                    ON u.user_id = st.sub_task_by

                    WHERE '${taskDeadline}' = '1' AND 
                    st.sub_task_by = '${userID}' AND
                    CAST(st.sub_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "collaborated sub task deadline" AS purpose, st.sub_task_title AS title, st.sub_task_end_date AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON st.sub_task_id = stc.sub_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = stc.collaborator_id	

                    WHERE '${taskDeadline}' = '1' AND 
                    stc.collaborator_id = '${userID}' AND
                    CAST(st.sub_task_end_date AS DATE) = CURDATE()

                    UNION 
                    
                    SELECT u.image AS from_image, u.name AS name, u.surname AS surname, 
                    "assigned sub task" AS purpose, st.sub_task_title AS title, stc.date_joined AS notif_date
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON st.sub_task_id = stc.sub_task_fk_id
                    
                    INNER JOIN users AS u
                    ON u.user_id = stc.collaborator_id	

                    WHERE '${taskUpdate}' = '1' AND 
                    stc.collaborator_id = '${userID}'
                    
                    ORDER BY notif_date DESC;`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get notifications ---");
    }
  }
}
