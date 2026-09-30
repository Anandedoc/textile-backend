/** @format */

const AWS = require("aws-sdk");
const HttpError = require("../models/httpErrorModel");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bucketName = `${process.env.AWS_BCUCKET_NAME}/${process.env.AWS_FILE_PATH}`;

const awsFileUpload = async (file, next) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: Date.now().toString() + "-" + file.name,
      Body: file.data,
      ACL: "public-read",
      ContentType: file.mimetype,
    };

    const res = await s3.upload(params).promise();
    return res;
  } catch (err) {
    return next(new HttpError(err || "Could not upload file to aws", 400));
  }
};

const awsFileDelete = async (fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Image deleted successfully: ${data}`);
      }
    });
  } catch (err) {
    return next(new HttpError(err || "Could not delete file from aws", 400));
  }
};

module.exports = {
  awsFileUpload,
  awsFileDelete,
};
