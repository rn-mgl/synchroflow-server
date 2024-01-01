import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class UserSettings {
  constructor(user_settings_uuid, user_fk_id) {
    this.user_settings_uuid = user_settings_uuid;
    this.user_fk_id = user_fk_id;
  }

  async createUserSettings() {
    try {
      const sql = `INSERT INTO user_settings (user_settings_uuid, user_fk_id) 
                  VALUES (?, ?);`;
      const userSettingsValues = [this.user_settings_uuid, this.user_fk_id];
      const [data, _] = await conn.query(sql, userSettingsValues);
      return data;
    } catch (error) {
      console.log(error + "--- create user settings ---");
    }
  }

  static async updateUserSettings(
    userSettingsID,
    notificationSound,
    messageNotification,
    taskUpdate,
    taskDeadline,
    associateInvite
  ) {
    try {
      const sql = `UPDATE user_settings 
                    SET
                        notification_sound = ?,
                        message_notification = ?,
                        task_update = ?,
                        task_deadline = ?,
                        associate_invite = ?
                    WHERE user_settings_id = '${userSettingsID}'; `;
      const userSettingsUpdateValues = [
        notificationSound,
        messageNotification,
        taskUpdate,
        taskDeadline,
        associateInvite,
      ];
      const [data, _] = await conn.query(sql, userSettingsUpdateValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user settings ---");
    }
  }

  static async getUserSettings(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `SELECT * FROM user_settings AS us
                  INNER JOIN users AS u
                  ON us.user_fk_id = u.user_id
                  WHERE ${mappedWhereConditions};`;
      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get user settings ---");
    }
  }
}
