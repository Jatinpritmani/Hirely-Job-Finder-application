
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const { User }=require('../models/user.model')
const bcrypt = require("bcrypt")
module.exports={
    userRegistration:userRegistration
}

async function userRegistration(req, res) {
    let func_name = "userRegistration"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        
        let { user_email, user_password,user_name,user_type } = req.body;
        
        if( !user_email || !user_password || !user_name || !user_type || !(utility_func.responseCons.USER_TYPES).includes(user_type)){
            return utility_func.responseGenerator(
                'user_email, user_password, user_name and user_type are required',
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        const userExists = await userFindByEmail(user_email)
        if(userExists){
            return utility_func.responseGenerator(
                utility_func.responseCons.RESP_EMAIL_EXISTS,
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        user_password = await  encryptPassword(user_password)
        
        let user={ user_email, user_password,user_name,user_type}
        if(req.file){
            user["resume"]={
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: req.file.buffer,
            }
        }
        await User.create(user);
        
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE +' '+JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function encryptPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword
}
async function validatePassword(password,encrypted_password){
    return await bcrypt.compare(password,encrypted_password)
}

async function userFindByEmail(user_email){
    return await User.findOne({user_email:user_email });
}