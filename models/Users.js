import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Users {
  constructor(user_uuid, name, surname, email, password, image) {
    this.user_uuid = user_uuid;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.image = image;
  }

  async createUser() {
    try {
      const sql = `INSERT INTO users (user_uuid, name, surname, email, password, image) 
                  VALUES (?, ?, ?, ?, ?, ?);`;
      const whereValues = [this.user_uuid, this.name, this.surname, this.email, this.password, this.image];
      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- create user ---");
    }
  }

  static async getUser(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM users 
                    WHERE ${mappedWhereConditions}`;
      const [data, _] = await conn.query(sql, whereValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get user ---");
    }
  }

  static async updateUserIdentifier(name, surname, email, whereConditions, whereValues) {
    try {
      const sql = `UPDATE users SET name = ?, surname = ?, email = ?
                    WHERE ${whereConditions} = ?`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserPassword(whereConditions, whereValues) {
    try {
      const sql = `UPDATE users SET password = ?
                    WHERE ${whereConditions} = ?`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserVerification(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `UPDATE users SET is_verified = ?
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.query(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }
}
