import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class AssociateInvites {
  constructor(associate_invite_uuid, associate_invite_from, associate_invite_to) {
    this.associate_invite_uuid = associate_invite_uuid;
    this.associate_invite_from = associate_invite_from;
    this.associate_invite_to = associate_invite_to;
  }

  async createAssociateInvite() {
    try {
      const sql = `INSERT INTO associate_invites 
                  (associate_invite_uuid, associate_invite_from, associate_invite_to) 
                  VALUES (?, ?, ?);`;
      const whereValues = [this.associate_invite_uuid, this.associate_invite_from, this.associate_invite_to];
      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
    }
  }

  static async updateAssociateInviteStatus(associate_invite_status, whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE associate_invites SET associate_invite_status = ?
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.query(sql, associate_invite_status, whereValues);
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

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
    }
  }

  static async getAllSentAssociateInvites(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associate_invites AS ai
                    INNER JOIN users AS u
                    ON ai.associate_invite_to = u.user_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associate invites ---");
    }
  }

  static async getAllReceivedAssociateInvites(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associate_invites AS ai
                    INNER JOIN users AS u
                    ON ai.associate_invite_from = u.user_id
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
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

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get associate invites ---");
    }
  }
}
