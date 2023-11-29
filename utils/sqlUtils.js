export const mapWhereConditions = (conditions) =>
  conditions.map((condition, index) => {
    return `${condition} = ? ${index !== conditions.length - 1 ? "AND" : ""}`;
  });
