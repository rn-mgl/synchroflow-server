import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class AssociateInvites {
  constructor(
    associate_invite_uuid,
    associate_invite_from,
    associate_invite_to,
  ) {
    this.associate_invite_uuid = associate_invite_uuid;
    this.associate_invite_from = associate_invite_from;
    this.associate_invite_to = associate_invite_to;
  }

  async createAssociateInvite() {
    try {
      const sql = `INSERT INTO associate_invites 
                  (associate_invite_uuid, associate_invite_from, associate_invite_to) 
                  VALUES (?, ?, ?);`;
      const whereValues = [
        this.associate_invite_uuid,
        this.associate_invite_from,
        this.associate_invite_to,
      ];
      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
      return [];
    }
  }

  static async updateAssociateInviteStatus(
    associate_invite_status,
    whereConditions,
    whereValues,
  ) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE associate_invites SET associate_invite_status = ?
                    WHERE ${mappedWhereConditions}`;

      const values = [associate_invite_status, ...whereValues];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- update associate invite ---");
      return [];
    }
  }

  static async deleteAssociateInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `DELETE FROM associate_invites
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
      return [];
    }
  }

  static async getAllSentAssociateInvites(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT u_to.user_uuid as invited_user_uuid, u_to.image AS invited_image, u_to.name AS invited_name, u_to.surname AS invited_surname, u_to.email AS invited_email,
                    u_from.user_uuid as from_user_uuid, u_from.image AS from_image, u_from.name AS from_name, u_from.surname AS from_name, u_from.email AS from_email,
                    associate_invite_uuid, u_from.user_id AS from_user, u_to.user_id AS invited_user

                    FROM associate_invites AS ai

                    INNER JOIN users AS u_to
                    ON ai.associate_invite_to = u_to.user_id

                    INNER JOIN users AS u_from
                    ON ai.associate_invite_from = u_from.user_id

                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associate invites ---");
      return [];
    }
  }

  static async getAllReceivedAssociateInvites(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT u_to.user_uuid as invited_user_uuid, u_to.image AS invited_image, u_to.name AS invited_name, u_to.surname AS invited_surname, u_to.email AS invited_email,
                    u_from.user_uuid as from_user_uuid, u_from.image AS from_image, u_from.name AS from_name, u_from.surname AS from_name, u_from.email AS from_email,
                    associate_invite_uuid

                    FROM associate_invites AS ai

                    INNER JOIN users AS u_to
                    ON ai.associate_invite_to = u_to.user_id

                    INNER JOIN users AS u_from
                    ON ai.associate_invite_from = u_from.user_id

                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associate invites ---");
      return [];
    }
  }

  static async getAllAvailableAssociates(userId) {
    try {
      const sql = `SELECT u.user_uuid, u.name, u.surname, u.email, u.image, u.role, u.status, u.user_id
  
                      FROM users AS u
  
                      WHERE u.user_id != ? AND
                      
                      u.user_id NOT IN (
                        SELECT associate_of FROM associates WHERE associate_is = ?
                      ) AND 

                      u.user_id NOT IN (
                        SELECT associate_is FROM associates WHERE associate_of = ?
                      ) AND

                      u.user_id NOT IN (
                        SELECT associate_invite_from FROM associate_invites WHERE associate_invite_to = ?
                      ) AND 

                      u.user_id NOT IN (
                        SELECT associate_invite_to FROM associate_invites WHERE associate_invite_from = ?
                      );`;

      const values = [userId, userId, userId, userId, userId];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get available associates ---");
      return [];
    }
  }

  static async getAssociateInvite(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associate_invites
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get associate invites ---");
      return [];
    }
  }
}
