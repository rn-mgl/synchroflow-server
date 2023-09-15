import conn from "../db/connection";

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
      const sql = `INSERT INTO users (user_uuid, name, surname, email, password, image, is_verified) 
                  VALUES (?, ?, ?, ?, ?, ?);`;
      const userValues = [this.user_uuid, this.name, this.surname, this.email, this.password, this.image];
      const [data, _] = await conn.execute(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- create user ---");
    }
  }

  static async getUser(selector, value) {
    try {
      const sql = `SELECT * FROM users 
                    WHERE ${selector} = ?`;
      const userValues = [value];
      const [data, _] = await conn.execute(sql, userValues);
      return data[0];
    } catch (error) {
      console.log(error + "--- get user ---");
    }
  }

  static async updateUserIdentifier(name, surname, email, selector, value) {
    try {
      const sql = `UPDATE users SET name = ?, surname = ?, email = ?
                    WHERE ${selector} = ?`;
      const userValues = [name, surname, email, value];
      const [data, _] = await conn.execute(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserPassword(password, selector, value) {
    try {
      const sql = `UPDATE users SET password = ?
                    WHERE ${selector} = ?`;
      const userValues = [password, value];
      const [data, _] = await conn.execute(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserVerification(selector, value) {
    try {
      const sql = `UPDATE users SET is_verified = ?
                    WHERE ${selector} = ?`;
      const userValues = [true, value];
      const [data, _] = await conn.execute(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }
}
