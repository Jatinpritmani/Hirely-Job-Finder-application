
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const userService = require('../services/user.service')

module.exports={
    userRegistration:userRegistration,
    userLogin:userLogin,
    getUserDetails:getUserDetails,
    getUserResume:getUserResume,
    uploadUserResume:uploadUserResume
}

async function userRegistration(req,res) {
    const func_name = 'userRegistration';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.userRegistration(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function userLogin(req,res) {
    const func_name = 'userLogin';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.userLogin(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getUserDetails(req,res) {
    const func_name = 'getUserDetails';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.getUserDetails(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getUserResume(req,res) {
    const func_name = 'getUserResume';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const {filename,filePath} = await userService.getUserResume(req);
       
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        // res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.download(filePath,filename ,(err) => {
            if (err) {
                let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
                logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(err))
                res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
                res.send(errResponse);
            }
          });
    } catch (error) {
        let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(errResponse);
    } 
}

async function uploadUserResume(req,res) {
    const func_name = 'uploadUserResume';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.uploadUserResume(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}