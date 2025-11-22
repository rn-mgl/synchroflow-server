import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class AssociateInvites {
  constructor(
    associate_invite_uuid,
    associate_invite_from,
    associate_invite_to
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
    }
  }

  static async updateAssociateInviteStatus(
    associate_invite_status,
    whereConditions,
    whereValues
  ) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE associate_invites SET associate_invite_status = ?
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.execute(
        sql,
        associate_invite_status,
        whereValues
      );
      return data;
    } catch (error) {
      console.log(error + "--- update associate invite ---");
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
    }
  }

  static async getAllSentAssociateInvites(whereConditions, whereValues) {
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
    }
  }
}
