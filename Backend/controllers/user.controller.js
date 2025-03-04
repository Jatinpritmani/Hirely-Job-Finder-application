
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const userService = require('../services/user.service')

module.exports={
    userRegistration:userRegistration
}

async function userRegistration(req, res) {
    const func_name = 'userRegistration';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.userRegistration(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + error);
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 

}