export const mapWhereConditions = (conditions) => {
  let mappedWhereConditions = "";

  conditions.map((condition, index) => {
    mappedWhereConditions += `${condition} = ? ${index !== conditions.length - 1 ? `AND ` : ``}`;
  });

  return mappedWhereConditions;
};
