import conn from "../db/connection";

export class Associates {
  constructor(associate_uuid, associate_from, associate_to) {
    this.associate_uuid = associate_uuid;
    this.associate_from = associate_from;
    this.associate_to = associate_to;
  }

  async createAssociate() {
    try {
      const sql = `INSERT INTO associates (associate_uuid, associate_from, associate_to) 
                    VALUES (?, ?, ?);`;
      const associateValues = [this.associate_uuid, this.associate_from, this.associate_to];
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
}
