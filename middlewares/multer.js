const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer");
const config = require("../config/keys");

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: config.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  },
  region: config.BUCKETEER_AWS_REGION,
});

const storage = multerS3({
  s3: s3,
  bucket: config.BUCKETEER_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only JPG, JPEG, and PNG images are supported"));
    }
  },
  limits: { fileSize: 100000000 },
});

module.exports = upload;
