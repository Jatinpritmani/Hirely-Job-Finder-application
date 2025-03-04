const express = require("express");
const router = express.Router();
const middleware = require('../utilities/middlewares/validator.middlewares')
// Auth
const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')
// const globalErrorHandling= require('../../utilities/middlewares/globalErrorHandling')

router.post('/registration/v1', userMiddleware.validateUserRegistration, middleware.validation,userController.userRegistration)

module.exports=router