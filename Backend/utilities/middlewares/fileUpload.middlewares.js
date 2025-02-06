const multer = require("multer");
const utility_func = require("../utility-functions")
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
      "application/msword",       // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/pdf"           // .pdf
    ];
  
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb("Invalid file format. Only .doc, .docx, and .pdf are allowed.", false); // Reject the file
    }
  };
const storage = multer.memoryStorage();
const upload = multer(
    { storage,
       limits: { fileSize: 16 * 1024 * 1024 },
       fileFilter
    },
);

let uploadFile = upload.single("file"); 

const handleFileUploadError = (err, req, res, next) => {
    
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
            utility_func.responseCons.RESP_FILE_SIZE_EXCEEDS,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
            ), true
        ))
      }
      
      return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
            err.message,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
            ), true
        ))
    }
    return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
        err,
        utility_func.statusGenerator(
            utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
        ), true
    ))
}

module.exports = {uploadFile,handleFileUploadError};
