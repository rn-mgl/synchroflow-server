import conn from "../db/connection.js";
import { mapWhereConditions } from "../utils/sqlUtils.js";

export class Users {
  constructor(user_uuid, name, surname, email, password, image, status, role) {
    this.user_uuid = user_uuid;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.image = image;
    this.status = status;
    this.role = role;
  }

  async createUser() {
    try {
      const sql = `INSERT INTO users (user_uuid, name, surname, email, password, image, status, role) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
      const whereValues = [
        this.user_uuid,
        this.name,
        this.surname,
        this.email,
        this.password,
        this.image,
        this.status,
        this.role,
      ];
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

  static async getUsers(userId) {
    try {
      const sql = `SELECT u.user_uuid, u.name, u.surname, u.email, u.image, u.role, u.status,
                    ai.associate_invite_uuid

                    FROM users AS u

                    LEFT JOIN associate_invites AS ai
                    ON ai.associate_invite_to = u.user_id
                    
                    WHERE u.user_id <> '${userId}'
                    AND u.user_id NOT IN (
                      SELECT associate_is FROM associates
                      WHERE associate_of = '${userId}'
                    );`;
      const [data, _] = await conn.execute(sql);
      return data;
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
