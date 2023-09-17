import conn from "../db/connection.js";

export class Associates {
  constructor(associate_uuid, associate_of, associate_is) {
    this.associate_uuid = associate_uuid;
    this.associate_of = associate_of;
    this.associate_is = associate_is;
  }

  async createAssociate() {
    try {
      const sql = `INSERT INTO associates (associate_uuid, associate_of, associate_is) 
                    VALUES (?, ?, ?);`;
      const associateValues = [this.associate_uuid, this.associate_of, this.associate_is];
      const [data, _] = await conn.execute(sql, associateValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
    }
  }

  static async deleteAssociate(selector, value) {
    try {
      const sql = `DELETE FROM associates
                    WHERE ${selector} = ?`;
      const associateValues = [value];
      const [data, _] = await conn.execute(sql, associateValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
    }
  }

  static async getAllAssociates(selector, value) {
    try {
      const sql = `SELECT * FROM associates
                    WHERE ${selector} = ?`;
      const associateValues = [value];
      const [data, _] = await conn.execute(sql, associateValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
    }
  }

  static async getAssociate(selector, value) {
    try {
      const sql = `SELECT * FROM associates
                    WHERE ${selector} = ?`;
      const associateValues = [value];
      const [data, _] = await conn.execute(sql, associateValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get associate ---");
    }
  }
}
