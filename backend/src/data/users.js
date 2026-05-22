import bcrypt from "bcryptjs";

const users = [];

export const findUserByEmail = (email) => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

export const createUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: "Admin",
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  return user;
};

export const verifyPassword = (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

export const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});
