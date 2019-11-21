const jwt = require("jsonwebtoken");
const { redisClient } = require("./init");

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
};

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
};

const createSessions = ({ email, id }) => {
  const token = signToken(email);
  return setToken(token, id)
    .then(() => ({ id, token }))
    .catch(console.log);
};

const getBearerToken = req => {
  const { authorization } = req.headers;
  if (!authorization) return null;
  const tokenMatch = authorization.match(/(?<=Bearer ).*/);
  if (!tokenMatch) return null;
  return tokenMatch[0];
};

module.exports = { createSessions, getBearerToken };
