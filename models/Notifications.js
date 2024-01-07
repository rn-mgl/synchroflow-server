import conn from "../db/connection.js";

export class Notifications {
  constructor() {}

  static async getNotifications(userID) {
    try {
      const sql = `SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "main task invite" AS purpose, mt.main_task_title AS title
                    FROM main_task_invites AS mti

                    INNER JOIN main_tasks AS mt
                    ON mti.main_task_fk_id = mt.main_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = mti.invited_by

                    WHERE invited_associate = '${userID}'
                    
                    UNION
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "sub task invite" AS purpose, st.sub_task_title AS title
                    FROM sub_task_collaborators AS stc

                    INNER JOIN sub_tasks AS st
                    ON stc.sub_task_fk_id = st.sub_task_id

                    INNER JOIN users AS u_from
                    ON u_from.user_id = st.sub_task_by 

                    WHERE stc.collaborator_id = '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "associate invite" AS purpose, "associate request" AS title
                    FROM associate_invites AS ai

                    INNER JOIN users AS u_from
                    ON u_from.user_id = ai.associate_invite_from 

                    WHERE ai.associate_invite_to = '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "group member" AS purpose, gmr.room_name AS title
                    FROM group_message_rooms AS gmr

                    INNER JOIN group_message_members AS gmm
                    ON gmm.message_room_fk_id = gmr.message_room_id
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = gmr.created_by

                    WHERE gmm.member_fk_id = '${userID}'
                    AND gmr.created_by <> '${userID}'
                    
                    UNION 
                    
                    SELECT u_from.image AS from_image, u_from.name AS name, u_from.surname AS surname, 
                    "private message" AS purpose,
                    CASE
                        WHEN pm.message IS NULL THEN pm.message_file ELSE pm.message
                    END AS title
                    FROM private_messages AS pm
                    
                    INNER JOIN users AS u_from
                    ON u_from.user_id = pm.message_from

                    WHERE pm.message_to = '${userID}';`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get notifications ---");
    }
  }
}
