const redis = require("redis")

let redisClient = redis.createClient();
redisClient.on('error', (error) => {
    console.log(error);
});

module.exports = redisClient;