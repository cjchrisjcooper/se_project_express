const jwt = require("jsonwebtoken");

const ERROR_CODES = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "need Authorization" });
  }

  // getting the token
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "need Authorization" });
  }

  req.user = payload;
  return next();
};

module.exports = { auth };
