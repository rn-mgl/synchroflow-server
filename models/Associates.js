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
      const associateValues = [
        this.associate_uuid,
        this.associate_of,
        this.associate_is,
      ];
      const [data, _] = await conn.execute(sql, associateValues);
      return data;
    } catch (error) {
      console.log(error + "--- create associate ---");
      return [];
    }
  }

  static async deleteAssociate(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);
    try {
      const sql = `DELETE FROM associates
                    WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);
      return data;
    } catch (error) {
      console.log(error + "--- delete associate ---");
      return [];
    }
  }

  static async getAllAssociates(userID) {
    try {
      const sql = `SELECT a.associate_uuid, a.associate_of, a.associate_is,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.user_uuid 
                    ELSE u_of.user_uuid
                    END AS user_uuid,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.name 
                    ELSE u_of.name
                    END AS name,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.surname 
                    ELSE u_of.surname
                    END AS surname,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.email 
                    ELSE u_of.email
                    END AS email,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.image 
                    ELSE u_of.image
                    END AS image,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.status 
                    ELSE u_of.status
                    END AS status,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.role 
                    ELSE u_of.role
                    END AS role

                    FROM associates AS a

                    INNER JOIN users AS u_is 
                    ON a.associate_is = u_is.user_id

                    INNER JOIN users AS u_of 
                    ON a.associate_of = u_of.user_id

                    WHERE (a.associate_is = ?
                    OR a.associate_of = ?);`;

      const values = new Array(9).fill(userID);

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
      return [];
    }
  }

  static async getAllRecentAssociates(userID) {
    try {
      const sql = `SELECT a.associate_uuid, a.associate_of, a.associate_is,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.user_uuid 
                    ELSE u_of.user_uuid
                    END AS user_uuid,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.name 
                    ELSE u_of.name
                    END AS name,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.surname 
                    ELSE u_of.surname
                    END AS surname,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.email 
                    ELSE u_of.email
                    END AS email,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.image 
                    ELSE u_of.image
                    END AS image,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.status 
                    ELSE u_of.status
                    END AS status,

                    CASE WHEN u_of.user_id = ?
                    THEN u_is.role 
                    ELSE u_of.role
                    END AS role

                    FROM associates AS a

                    INNER JOIN users AS u_is 
                    ON a.associate_is = u_is.user_id

                    INNER JOIN users AS u_of 
                    ON a.associate_of = u_of.user_id

                    WHERE (a.associate_is = ?
                    OR a.associate_of = ?)
                    AND CAST(a.date_associated AS DATE) > CAST(DATE_SUB(NOW(), INTERVAL 5 DAY) AS DATE);`;

      const values = new Array(9).fill(userID);

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
      return [];
    }
  }

  static async getAssociate(whereConditions, whereValues) {
    const mappedWhereConditions = mapWhereConditions(whereConditions);

    try {
      const sql = `SELECT * FROM associates AS a
                  INNER JOIN users AS u
                  ON u.user_id = a.associate_is
                  WHERE ${mappedWhereConditions};`;

      const [data, _] = await conn.execute(sql, whereValues);

      return data;
    } catch (error) {
      console.log(error + "--- get associate ---");
      return [];
    }
  }
}
