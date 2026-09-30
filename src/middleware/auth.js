/** @format */

const jwt = require("jsonwebtoken");
const db = require("../models");

const User = db.user;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.AUTH_SECREAT);
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        token,
      },
      //   attributes: ['id', 'email']
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};

module.exports = {
  auth,
};
