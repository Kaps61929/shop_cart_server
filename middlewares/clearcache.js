const { clearcache } = require('../cache');


module.exports = async (req, res, next) => {
  await next();
  await clearcache(req.user);
};