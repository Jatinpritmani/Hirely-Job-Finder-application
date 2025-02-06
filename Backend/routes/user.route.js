const express = require("express");
const router = express.Router();
const middleware = require('../utilities/middlewares/validator.middlewares')
const fileUploadMiddleware = require('../utilities/middlewares/fileUpload.middlewares')
// Auth
const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')
// const globalErrorHandling= require('../../utilities/middlewares/globalErrorHandling')

router.post('/registration/v1', userMiddleware.validateUserRegistration,middleware.validation,fileUploadMiddleware.uploadFile,fileUploadMiddleware.handleFileUploadError,userController.userRegistration)

module.exports=router