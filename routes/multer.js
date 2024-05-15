const multer=require("multer");
const {v4:uuidv4}=require("uuid");
const path=require("path");//dont need to download

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'./public/images/uploads')//folder in which u want to upload
    },
    filename: function (req, file, cb) {
      const uniqueFilename = uuidv4();//gen a unique file name
      cb(null, uniqueFilename+path.extname(file.originalname));//use that uniq file name to upload
    }
  });
  
  const upload = multer({ storage: storage })
  module.exports=upload;