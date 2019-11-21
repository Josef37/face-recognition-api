const { redisClient } = require("../helper/init");

const handleSignout = (req, res) => {
  const { authorization } = req.headers;
  redisClient.del(authorization, (err, reply) => {
    if (err) res.status(400).json("couldn't delete token");
    else res.json("token deleted");
  });
};

module.exports = {
  handleSignout
};
