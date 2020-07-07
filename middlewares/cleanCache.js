const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    // make sure this logic is happening after the route handler is complete 
    await next();
    clearHash(req.user.id);
};