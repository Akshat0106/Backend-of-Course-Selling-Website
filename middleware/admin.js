const jwt = require("jsonwebtoken");
require("dotenv").config();

function adminMiddleWare(req, res, next) {
  const token = req.headers.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    req.userId = decoded.id;
    next();
  } catch (e) {
    res.status(403).json({
      message: "Invalid token",
    });
  }
}

module.exports = {
  adminMiddleWare: adminMiddleWare,
};
