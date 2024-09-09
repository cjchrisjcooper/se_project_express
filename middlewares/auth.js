const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const { UnauthorizedError } = require("./UnauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError("need Authorization. Needs authorization header"),
    );
  }

  // getting the token
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(
      new UnauthorizedError("need Authorization. needs the right token"),
    );
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
