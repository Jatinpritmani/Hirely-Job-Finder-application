const express = require("express");
const router = express.Router();
const middleware = require('../utilities/middlewares/validator.middlewares')
const fileUploadMiddleware = require('../utilities/middlewares/fileUpload.middlewares')
const jwtMiddleware = require('../utilities/middlewares/jwt-service.middlewares')
const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')

router.post('/registration/v1', userMiddleware.validateUserRegistration,middleware.validation,fileUploadMiddleware.uploadFile,fileUploadMiddleware.handleFileUploadError,userController.userRegistration)
router.post('/login/v1', userMiddleware.validateUserLogin,middleware.validation,userController.userLogin)
router.post('/userDetails/v1', userMiddleware.validateToken,middleware.validation, jwtMiddleware.verifyToken,userController.getUserDetails)

router.post('/get/resume/v1', userMiddleware.validateToken,middleware.validation, jwtMiddleware.verifyToken,userController.getUserResume)
router.post('/upload/resume/v1', userMiddleware.validateToken,middleware.validation, jwtMiddleware.verifyToken,fileUploadMiddleware.uploadFile,fileUploadMiddleware.handleFileUploadError,userController.uploadUserResume)

module.exports=router