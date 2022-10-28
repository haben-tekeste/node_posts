const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  let decodedToken;
  if (!authorization) {
    const error = new Error("No token available");
    error.statusCode = 422;
    throw error;
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    const error = new Error("No token available");
    error.statusCode = 422;
    throw error;
  }

  try {
     decodedToken = jwt.verify(token,process.env.SECRET_KEY)
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken){
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next()
};
