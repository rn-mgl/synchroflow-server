import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

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
      const [data, _] = await conn.query(sql, associateValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
    }
  }

  static async deleteAssociate(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `DELETE FROM associates
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
    }
  }

  static async getAllAssociates(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associates AS a
                    INNER JOIN users AS u 
                    ON a.associate_is = u.user_id
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
    }
  }

  static async getAllRecentAssociates(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associates AS a
                    INNER JOIN users AS u 
                    ON a.associate_is = u.user_id
                    WHERE ${mappedWhereConditions}
                    AND CAST(date_associated AS DATE) > CAST(DATE_SUB(NOW(), INTERVAL 5 DAY) AS DATE);`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
    }
  }

  static async getAssociate(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM associates
                    WHERE ${whereConditions} = ?`;

      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get associate ---");
    }
  }
}
