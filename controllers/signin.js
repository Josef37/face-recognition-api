const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, email, password) => {
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

const getAuthTokenId = authorization => {
  return new Promise((resolve, reject) => {
    redisClient.get(authorization, (err, reply) => {
      if (err || !reply) reject("unauthorized");
      return resolve({ id: reply });
    });
  });
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(authorization)
        .then(({ id }) => res.json({ id }))
        .catch(err => res.status(400).json(err))
    : handleSignin(db, bcrypt, req.body.email, req.body.password)
        .then(createSessions)
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

const signout = (req, res) => {
  const { authorization } = req.headers;
  redisClient.del(authorization, (err, reply) => {
    if (err) res.status(400).json("couldn't delete token");
    else res.json("token deleted");
  });
};

module.exports = {
  signinAuthentication,
  signout,
  createSessions,
  redisClient
};
