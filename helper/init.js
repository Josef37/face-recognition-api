const db = require("knex")({
  client: "pg",
  connection: process.env.POSTGRES_URI
});
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

module.exports = {
  db,
  redisClient
};