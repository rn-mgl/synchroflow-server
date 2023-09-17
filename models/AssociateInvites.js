import conn from "../db/connection.js";

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
      const associateInviteValues = [this.associate_invite_uuid, this.associate_invite_from, this.associate_invite_to];
      const [data, _] = await conn.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
    }
  }

  static async updateAssociateInviteStatus(associate_invite_status, selector, value) {
    try {
      const sql = `UPDATE associate_invites SET associate_invite_status = ?
                    WHERE ${selector} = ?`;
      const associateInviteValues = [associate_invite_status, value];
      const [data, _] = await conn.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- update associate invite ---");
    }
  }

  static async deleteAssociateInvite(selector, value) {
    try {
      const sql = `DELETE FROM associate_invites
                    WHERE ${selector} = ?`;
      const associateInviteValues = [value];
      const [data, _] = await conn.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
    }
  }

  static async getAllAssociateInvites(selector, value) {
    try {
      const sql = `SELECT * FROM associate_invites
                    WHERE ${selector} = ?;`;
      const associateInviteValues = [value];
      const [data, _] = await conn.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associate invites ---");
    }
  }

  static async getAssociateInvite(selector, value) {
    try {
      const sql = `SELECT * FROM associate_invites
                    WHERE ${selector} = ?;`;
      const associateInviteValues = [value];
      const [data, _] = await conn.execute(sql, associateInviteValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get associate invites ---");
    }
  }
}
