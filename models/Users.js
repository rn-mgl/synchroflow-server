import conn from "../db/connection.js";

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
      const userValues = [this.user_uuid, this.name, this.surname, this.email, this.password, this.image];
      const [data, _] = await conn.query(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- create user ---");
    }
  }

  static async getUser(whereConditions, whereValues) {
    try {
      const sql = `SELECT * FROM users 
                    WHERE ${whereConditions} = ?`;
      const userValues = [whereValues];
      const [data, _] = await conn.query(sql, userValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get user ---");
    }
  }

  static async updateUserIdentifier(name, surname, email, whereConditions, whereValues) {
    try {
      const sql = `UPDATE users SET name = ?, surname = ?, email = ?
                    WHERE ${whereConditions} = ?`;
      const userValues = [name, surname, email, whereValues];
      const [data, _] = await conn.query(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserPassword(password, whereConditions, whereValues) {
    try {
      const sql = `UPDATE users SET password = ?
                    WHERE ${whereConditions} = ?`;
      const userValues = [password, whereValues];
      const [data, _] = await conn.query(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserVerification(whereConditions, whereValues) {
    try {
      const sql = `UPDATE users SET is_verified = ?
                    WHERE ${whereConditions} = ?`;
      const userValues = [true, whereValues];
      const [data, _] = await conn.query(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }
}
