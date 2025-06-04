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
      const sql = `INSERT INTO users (user_uuid, name, surname, email, password, image) 
                  VALUES (?, ?, ?, ?, ?, ?);`;
      const userValues = [
        this.user_uuid,
        this.name,
        this.surname,
        this.email,
        this.password,
        this.image,
      ];
      const [data, _] = await conn.query(sql, userValues);
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
      return data;
    } catch (error) {
      console.log(error + "--- get user ---");
    }
  }

  static async getUsers(userId, sortFilter, searchFilter, searchCategory) {
    const sortValue = associatesFilterKey[sortFilter];
    const searchCategoryValue = associatesFilterKey[searchCategory];
    try {
      const sql = `SELECT u.user_uuid, u.name, u.surname, u.email, u.image, u.role, u.status,
                    ai.associate_invite_uuid

                    FROM users AS u

                    LEFT JOIN associate_invites AS ai
                    ON ai.associate_invite_to = u.user_id
                    OR ai.associate_invite_from = u.user_id
                    
                    WHERE u.user_id <> '${userId}'
                    AND u.user_id NOT IN (
                      SELECT associate_is FROM associates
                      WHERE associate_of = '${userId}'
                      OR associate_is = '${userId}'
                    )
                    AND u.user_id NOT IN (
                      SELECT associate_of FROM associates
                      WHERE associate_of = '${userId}'
                      OR associate_is = '${userId}'
                    )
                    AND ${searchCategoryValue} LIKE '%${searchFilter}%'
                    ORDER BY ${sortValue};`;

      const [data, _] = await conn.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "--- get user ---");
    }
  }

  static async updateUserIdentifier(
    name,
    surname,
    role,
    status,
    image,
    userID
  ) {
    try {
      const sql = `UPDATE users SET 
                      name = ?, 
                      surname = ?, 
                      role = ?,
                      status = ?, 
                      image = ?
                    WHERE user_id = '${userID}'`;

      const updateUserValues = [name, surname, role, status, image];

      const [data, _] = await conn.query(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user identifier ---");
    }
  }

  static async updateUserPassword(password, userID) {
    try {
      const sql = `UPDATE users SET password = ?
                    WHERE user_id = '${userID}'`;

      const updateUserValues = [password];

      const [data, _] = await conn.query(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user password ---");
    }
  }

  static async updateUserVerification(userID) {
    try {
      const sql = `UPDATE users SET is_verified = ?
                    WHERE user_id = '${userID}'`;

      const updateUserValues = [1];

      const [data, _] = await conn.query(sql, updateUserValues);
      return data;
    } catch (error) {
      console.log(error + "--- update user verification ---");
    }
  }
}
