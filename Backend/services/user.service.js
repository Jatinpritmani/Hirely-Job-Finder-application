
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const { User }=require('../models/user.model')
const {generateToken}=require("../utilities/middlewares/jwt-service.middlewares")
const bcrypt = require("bcrypt")
const fs=require("fs")
const path=require("path")

module.exports={
    userRegistration:userRegistration,
    userLogin:userLogin,
    getUserDetails:getUserDetails,
    getUserResume:getUserResume,
    uploadUserResume:uploadUserResume
}

async function encryptPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword
}
async function validatePassword(password,encrypted_password){
    return await bcrypt.compare(password,encrypted_password)
}
async function userFindByEmail(user_email){
    return await User.findOne({user_email:user_email })
}
async function userFindByID(user_id){
    return await User.findOne({_id:user_id })
}

async function userRegistration(req) {
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
            user[utility_func.jsonCons.FIELD_RESUME]={
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname:req.file.originalname,
                path:req.file.path
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

async function userLogin(req) {
    let func_name = "userLogin"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        
        let { user_email, user_password } = req.body;
        
        const userExists = await userFindByEmail(user_email)
        if(!userExists || !(await validatePassword(user_password,userExists.user_password))){
            return utility_func.responseGenerator(
                utility_func.responseCons.RESP_INVALID_CREDENTIALS,
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        let user=userExists.toJSON()

        let userDetails={user_email:user[utility_func.jsonCons.FIELD_USER_EMAIL],user_id: user[utility_func.jsonCons.FIELD_USER_ID]}
       
        let token = await generateToken(userDetails)
        
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_LOGIN_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            {token,user_type:user["user_type"]}
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

async function getUserDetails(req) {
    let func_name = "getUserDetails"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        
        let userDetails = await User.findOne({_id : req[utility_func.jsonCons.FIELD_USER_DETAILS][utility_func.jsonCons.FIELD_USER_ID]},
            {user_id:1, user_email:1, user_name:1, user_type:1}
        )
        userDetails = userDetails.toJSON(); 

        userDetails["designation"] = "Software Developer";
        userDetails["total_job_applied"] = 12;

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            userDetails
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

async function getUserResume(req) {
    let func_name = "getUserResume"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        
        let userDetails = await User.findOne({_id : req[utility_func.jsonCons.FIELD_USER_DETAILS][utility_func.jsonCons.FIELD_USER_ID]},
            {resume:1}
        )
        
        userDetails = userDetails.toJSON(); 
        let filePath
        let filename=userDetails.resume.originalname
        if(userDetails.resume){
            filePath = path.join(__dirname, "../resumes", userDetails.resume.filename);
        }
        return {filename,filePath}
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE +' '+JSON.stringify(error) + " => " + func_name);
        throw error
    }
}

async function uploadUserResume(req) {
    let func_name = "uploadUserResume"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        const user_id=req[utility_func.jsonCons.FIELD_USER_DETAILS][utility_func.jsonCons.FIELD_USER_ID]

        let userDetails = await User.findOne({_id : req[utility_func.jsonCons.FIELD_USER_DETAILS][utility_func.jsonCons.FIELD_USER_ID]},
            {resume:1}
        )
        userDetails = userDetails.toJSON(); 
        if(userDetails.resume){
            const filePath = path.join(__dirname, "../resumes", userDetails.resume.filename);
            if(fs.existsSync(filePath)){
                await fs.promises.unlink(filePath)
            }
        }
        if(req.file){
            let resume={
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname:req.file.originalname,
                path:req.file.path
            }
            await User.findByIdAndUpdate({_id:user_id},{$set:{resume:resume}})
        }
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