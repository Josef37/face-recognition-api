const { redisClient } = require("./init");
const { getBearerToken } = require("./tokenHelper");

const requireAuth = (req, res, next) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json("Unauthorized");
  else {
    redisClient.get(token, (err, reply) => {
      if (err || !reply) return res.status(401).json("Unauthorized");
      return next();
    });
  }
};

module.exports = { requireAuth };
