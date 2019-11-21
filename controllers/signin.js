const bcrypt = require("bcrypt-nodejs");
const { db, redisClient } = require("../helper/init");
const { createSessions, getBearerToken } = require("../helper/tokenHelper");

const handleSignin = (email, password) => {
  if (!email || !password) return Promise.reject("incorrect form submission");
  return db
    .select("email", "hash")
    .from("login")
    .where({ email })
    .then(([data]) => {
      if (!data) throw new Error("email not found");
      else if (!bcrypt.compareSync(password, data.hash))
        throw new Error("wrong password");
      else
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then(([user]) => {
            if (!user) throw new Error("user not found");
            return user;
          })
          .catch(err => Promise.reject("unable to get user"));
    })
    .catch(err => Promise.reject("wrong credentials"));
};

const getAuthTokenId = token => {
  return new Promise((resolve, reject) => {
    redisClient.get(token, (err, reply) => {
      if (err || !reply) reject("unauthorized");
      return resolve({ id: reply });
    });
  });
};

const signinAuthentication = (req, res) => {
  const token = getBearerToken(req);
  return token
    ? getAuthTokenId(token)
        .then(({ id }) => res.json({ id }))
        .catch(err => res.status(400).json(err))
    : handleSignin(req.body.email, req.body.password)
        .then(createSessions)
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
  redisClient
};
