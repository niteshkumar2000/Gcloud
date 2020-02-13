let express = require("express");
let router = express.Router();
let fileController = require('../controllers/filesController') 
let multer = require('multer')
const path = require("path");


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname
    );
  }
});

const upload = multer({ storage: storage });

router.put('/', upload.single('file'), fileController.uploadFile)

router.get('/list', fileController.getFileList)

router.get('/:id', fileController.getFile)

router.delete('/:id', fileController.deleteFile)
module.exports = router