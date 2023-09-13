import db from "../db/connection";

export class AssociateInvites {
  constructor(associate_uuid, associate_invite_from, associate_invite_to, associate_invite_status) {
    this.associate_uuid = associate_uuid;
    this.associate_invite_from = associate_invite_from;
    this.associate_invite_to = associate_invite_to;
    this.associate_invite_status = associate_invite_status;
  }

  async createAssociateInvite() {
    try {
      const sql = `INSERT INTO associate_invites 
                  (associate_uuid, associate_invite_from, associate_invite_to, associate_invite_status) 
                  VALUES (?, ?, ?, ?);`;
      const associateInviteValues = [
        this.associate_uuid,
        this.associate_invite_from,
        this.associate_invite_to,
        this.associate_invite_status,
      ];
      const [data, _] = await db.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
    }
  }

  static async updateAssociateInviteStatus(status, selector, value) {
    try {
      const sql = `UPDATE associate_invites SET status = ?
                    WHERE ${selector} = ?`;
      const associateInviteValues = [status, value];
      const [data, _] = await db.execute(sql, associateInviteValues);
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
      const [data, _] = await db.execute(sql, associateInviteValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
    }
  }
}
