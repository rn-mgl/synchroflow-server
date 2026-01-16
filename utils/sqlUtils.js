export const mapWhereConditions = (conditions) => {
  const mappedWhereConditions = conditions
    .map((condition, index) => `${condition} = ?`)
    .join("AND ");

  return mappedWhereConditions;
};
