/** @format */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models");
const HttpError = require("../models/httpErrorModel");
const { emailWebHook } = require("../utils/emailWebHook");
const { v4: uuidv4 } = require("uuid");

const User = db.user;

const login = async (req, res, next) => {
  const { email, password } = req.body;




  
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new HttpError("Email not found", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Password does not match", 400));
    }

    if (!user.isVerified) {
      return next(
        new HttpError(
          "Please verify your email account link sent to your emailId",
          400
        )
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.AUTH_SECREAT
    );

    await User.update(
      {
        token: token,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.status(200).json({ success: true, token });
  } catch (err) {
    return next(new HttpError(err.message || "login failed", 400));
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new HttpError("Email not exist, please create account", 400));
    }

    const uniqueId = uuidv4();

    await User.update(
      { uuid: uniqueId },
      {
        where: {
          email,
        },
      }
    );

    res
      .status(200)
      .json({ success: true, message: "Email sent to your mail Id" });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Reset Password</title>
        </head>
        <body>
            <p>Hello ${user.firstName ? user.firstName : ""},</p>
            <p>You are receiving this email because you have requested to reset your make sarees account's password. Please click the button below to reset your password:</p>
            <p><a href="${
              process.env.FORGOT_EMAIL_REDIRECT_URL + "/" + uniqueId
            }" style="background-color: #00ace6; color: white; padding: 10px 16px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a></p>
            <p>If you did not request to reset your password, please ignore this email.</p>
            <p>Best regards,<br>RV Make Sarees Dev Team</p>
        </body>
        </html>
      `;
    await emailWebHook({
      name: user.firstName,
      to: email,
      htmlContent,
      subject: "Reset Password",
    });
  } catch (err) {
    return next(new HttpError(err.message || "Unable to change password", 400));
  }
};

const logout = async (req, res, next) => {
  try {
    await User.update(
      { token: null },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.status(200).json({ success: true, message: "Logout successfully" });
  } catch (err) {
    return next(new HttpError(err.message || "Server not reachable", 500));
  }
};

const resetPassword = async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!id) {
    return next(new HttpError("Invalid request", 400));
  }

  try {
    const user = await User.findOne({
      where: {
        uuid: id,
      },
    });

    if (!user) {
      return next(new HttpError("Invalid request", 400));
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          uuid: id,
        },
      }
    );

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    return next(new HttpError("Server not reachable", 500));
  }
};

module.exports = {
  login,
  forgetPassword,
  resetPassword,
  logout,
};
