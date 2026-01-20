import conn from "../db/connection.js";
import { associatesFilterKey } from "../utils/filterUtils.js";
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

  static async getAllAssociates(
    userID,
    sortFilter,
    searchFilter,
    searchCategory,
  ) {
    const searchCategoryValue = associatesFilterKey[searchCategory];
    const sortValue = associatesFilterKey[sortFilter];
    const checkedSortValue =
      sortValue === "date_associated"
        ? "a.date_associated"
        : `u_of.${sortValue}, u_is.${sortValue}`;

    try {
      const sql = `SELECT u_of.user_uuid AS of_uuid, u_of.name AS of_name, u_of.surname AS of_surname, 
                    u_of.email AS of_email, u_of.image AS of_image, u_of.status AS of_status, u_of.role AS of_role,
                    u_is.user_uuid AS is_uuid, u_is.name AS is_name, u_is.surname AS is_surname, 
                    u_is.email AS is_email, u_is.image AS is_image, u_is.status AS is_status, u_is.role AS is_role,
                    a.associate_uuid, a.associate_of, a.associate_is

                    FROM associates AS a

                    INNER JOIN users AS u_is 
                    ON a.associate_is = u_is.user_id

                    INNER JOIN users AS u_of 
                    ON a.associate_of = u_of.user_id

                    WHERE (a.associate_is = ?
                    OR a.associate_of = ?)
                    AND (u_of.${searchCategoryValue} LIKE ?
                    OR u_is.${searchCategoryValue} LIKE ?)
                    ORDER BY ${checkedSortValue};`;

      const values = [userID, userID, `%${searchFilter}%`, `%${searchFilter}%`];

      const [data, _] = await conn.execute(sql, values);
      return data;
    } catch (error) {
      console.log(error + "--- get all associates ---");
      return [];
    }
  }

  static async getAllRecentAssociates(
    userID,
    sortFilter,
    searchFilter,
    searchCategory,
  ) {
    const searchCategoryValue = associatesFilterKey[searchCategory];
    const sortValue = associatesFilterKey[sortFilter];
    const checkedSortValue =
      sortValue === "date_associated"
        ? "a.date_associated"
        : `u_of.${sortValue}, u_is.${sortValue}`;

    try {
      const sql = `SELECT u_of.user_uuid AS of_uuid, u_of.name AS of_name, u_of.surname AS of_surname, 
                    u_of.email AS of_email, u_of.image AS of_image, u_of.status AS of_status, u_of.role AS of_role,
                    u_is.user_uuid AS is_uuid, u_is.name AS is_name, u_is.surname AS is_surname, 
                    u_is.email AS is_email, u_is.image AS is_image, u_is.status AS is_status, u_is.role AS is_role,
                    a.associate_uuid, a.associate_of, a.associate_is

                    FROM associates AS a

                    INNER JOIN users AS u_is 
                    ON a.associate_is = u_is.user_id

                    INNER JOIN users AS u_of 
                    ON a.associate_of = u_of.user_id

                    WHERE (a.associate_is = ?
                    OR a.associate_of = ?)
                    AND (u_of.${searchCategoryValue} LIKE ?
                    OR u_is.${searchCategoryValue} LIKE ?)
                    AND CAST(a.date_associated AS DATE) > CAST(DATE_SUB(NOW(), INTERVAL 5 DAY) AS DATE)
                    ORDER BY ${checkedSortValue};`;

      const values = [userID, userID, `%${searchFilter}%`, `%${searchFilter}%`];

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
