const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require('./config/keys');

const client = redis.createClient(keys.redisUrl);
// Make sure client.get returns promise instead of requiring a callback function
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for "key" in redis
  const cacheValue = await client.hget(this.hashKey, key);

  // if we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((el) => new this.model(el))
      : new this.model(doc);
  }

  // Otherwise, isssue the query and store the result in redis
  const result = await exec.apply(this, arguments);


  client.hset(this.hashKey, key, JSON.stringify(result));
  // expire in 20 seconds
  client.expire(this.hashKey, 20);

  return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};