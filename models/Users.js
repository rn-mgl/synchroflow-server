import conn from "../db/connection.js";
import { associatesFilterKey } from "../utils/filterUtils.js";
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
      const sql = `INSERT INTO users (user_uuid, name, surname, email, password, status, image) 
                  VALUES (?, ?, ?, ?, ?, ?);`;

      const defaultStatus = "Hi! I'm new here, let's work together.";

      const userValues = [
        this.user_uuid,
        this.name,
        this.surname,
        this.email,
        this.password,
        defaultStatus,
        this.image,
      ];

      const [data, _] = await conn.execute(sql, userValues);
      return data;
    } catch (error) {
      console.log(error + "--- create user ---");
      return [];
    }
  }

  static async getUser(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM users
                    WHERE ${mappedWhereConditions}`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- get user ---");
      return [];
    }
  }

  static async updateUserIdentifier(
    name,
    surname,
    role,
    status,
    image,
    userID,
  ) {
    try {
      const sql = `UPDATE users SET 
                      name = ?, 
                      surname = ?, 
                      role = ?,
                      status = ?, 
                      image = ?
                    WHERE user_id = ?`;

      const updateUserValues = [name, surname, role, status, image, userID];

      const [data, _] = await conn.execute(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
      return [];
    }
  }

  static async updateUserPassword(password, userID) {
    try {
      const sql = `UPDATE users SET password = ?
                    WHERE user_id = ?;`;

      const updateUserValues = [password, userID];

      const [data, _] = await conn.execute(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user password ---");
      return [];
    }
  }

  static async updateUserVerification(userID) {
    try {
      const sql = `UPDATE users SET is_verified = ?
                    WHERE user_id = ?;`;

      const updateUserValues = [1, userID];

      const [data, _] = await conn.execute(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user verification ---");
      return [];
    }
  }
}
