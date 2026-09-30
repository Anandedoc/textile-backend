/** @format */

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require("../models");
const { emailWebHook } = require("../utils/emailWebHook");
const { awsFileUpload } = require("../utils/awsUpload");
const HttpError = require("../models/httpErrorModel");

const User = db.user;

const createUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if(existingUser) {
            return next(new HttpError("Email already exist", 400));
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND, 10));
        const hashedPassword = await bcrypt.hash(password, salt);
        const uniqueId = uuidv4();

        await User.create({
            ...req.body, password: hashedPassword, uuid: uniqueId
        });

        res.status(201).json({ success: true, message: "Verifiacaion link is sent to your E-mail." });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
            </head>
            <body>
                <p>Thank you for creating account in <b>RV Make Sarees</b>.</p>
                <p>Please verify your email address by clicking the button below:</p>
                <a href=${process.env.VERIFY_USER_REDIRECT_URL + "/" + uniqueId} style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Verify Email</a>
                <p>Thank you for your interest in our website!</p>
            </body>
            </html>
        `;
        await emailWebHook({ name: "New user", to: email, htmlContent, subject: "Verify Email" });

    } catch(err) {
        return next(new HttpError(err?.message || "Could not register", 400));
    }
}

const verifyUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const isVerifiedUser = await User.findOne({
            where: {
                uuid: id
            }
        });

        if(!isVerifiedUser || isVerifiedUser.isVerified) {
            return res.status(200).json({ success: false, message: "Email already verified" });
        }

        await User.update({ isVerified: true }, {
            where: {
                uuid: id
            }
        });     

        res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch(err) {
        return next(new HttpError(err?.message || "Server not reachable", 500));
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const  {id}  = req.user;

      const user = await User.findOne({
        where: {
         id,
        },
      });
  
      if (!user) {
        return next(new HttpError("Invalid request", 400));
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      return next(new HttpError("Server not reachable", 500));
    }
  };

const updateUser = async (req, res, next) => {
    try {
        await User.update({ ...req.body }, {
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({ success: true, message: "User info updated" });

    } catch(err) {
        return next(new HttpError(err?.message || "Server not reachable", 500));
    }
}

const uploadImage = async (req, res, next) => {
    try {
      await awsFileUpload(req.files.image, next);
      res
        .status(201)
        .json({
          success: true,
          message: "Uploaded Successfully",
        });
    } catch (error) {
      return next(new HttpError(error?.message || "Server error", 400));
    }
  };

module.exports = {
    createUser,
    verifyUser,
    updateUser,
    getUserProfile,
    uploadImage
}