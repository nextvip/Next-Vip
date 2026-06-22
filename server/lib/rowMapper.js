const toSnakeCase = (key) =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const toDbRow = (data = {}) => {
  const row = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    row[toSnakeCase(key)] = value;
  }

  return row;
};

export const fromDbRow = (row) => {
  if (!row) return null;

  const mapped = { ...row, _id: row.id };

  if (row.created_at) mapped.createdAt = row.created_at;
  if (row.updated_at) mapped.updatedAt = row.updated_at;

  return mapped;
};

export const omitPassword = (user) => {
  if (!user) return user;
  const { password, ...safeUser } = user;
  return safeUser;
};
