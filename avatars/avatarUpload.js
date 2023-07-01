const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpFolder = "./tmp";
    if (!fs.existsSync(tmpFolder)) {
      fs.mkdirSync(tmpFolder);
    }
    cb(null, "./tmp");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload.single("avatar");
