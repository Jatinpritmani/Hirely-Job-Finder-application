
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const { User }=require('../models/user.model')
const {Job}=require("../models/job.model")
const {Application}=require("../models/application.model")
const {SavedJob}=require("../models/savedJobs.model")
const {generateToken}=require("../utilities/middlewares/jwt-service.middlewares")
const bcrypt = require("bcrypt")
const fs=require("fs")
const path=require("path")
const mongoose=require("mongoose")

module.exports={
    userRegistration:userRegistration,
    userLogin:userLogin,
    getUserDetails:getUserDetails,
    getUserResume:getUserResume,
    uploadUserResume:uploadUserResume,
    createJobPost:createJobPost,
    getAllJobPosts:getAllJobPosts,
    applyJob:applyJob,
    getSavedJobs:getSavedJobs,
    getAppliedJobs:getAppliedJobs,
    unsaveJob:unsaveJob
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
        let { user_email, user_password,user_name,user_type,experience,bio,designation,company_name } = req.body;
        
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

        let user={ user_email, user_password,user_name,user_type,experience,bio,designation,company_name}

        if(req.file){
            user[utility_func.jsonCons.FIELD_RESUME]={
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname:req.file.originalname,
                path:req.file.path
            }
        }
        const userDetails = await User.create(user);
        
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            {user_id : userDetails["_id"]}
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
        
        let { user_email, user_password, fcm_token } = req.body;
        
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
        await User.findOneAndUpdate({user_email:user_email}, {$set:{fcm_token:fcm_token}})
        // let userDetails={user_email:user[utility_func.jsonCons.FIELD_USER_EMAIL],user_id: user[utility_func.jsonCons.FIELD_USER_ID]}
        // let token = await generateToken(userDetails)
        
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_LOGIN_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            {user_type:user["user_type"],user_id:user["user_id"]}
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
        
        let user_id = req.body.user_id 
        let userDetails = await User.findOne({_id : user_id},
            {resume:0,user_password:0,__v:0,createdAt:0,updatedAt:0}
        )
        
        userDetails = userDetails.toJSON(); 
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
        let user_id = req.body.user_id 

        let userDetails = await User.findOne({_id : user_id},
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
        let user_id = req.body.user_id         
        
        let userDetails = await User.findOne({_id : user_id},
            {resume:1}
        )
        console.log("userDetails",userDetails);
        
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


async function createJobPost(req) {
    let func_name = "createJobPost"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { recruiter_id ,position ,location ,salary ,job_type ,summary ,requirenment } = req.body;
        
        
        const jobDetails = await Job.create( { recruiter_id ,position ,location ,salary ,job_type ,summary ,requirenment } );
        
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

async function getAllJobPosts(req) {
    let func_name = "getAllJobPosts"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        const user_id =req.body.user_id
        let jobDetails=await Job.aggregate([
            {
                $lookup: {
                    from: "users",  
                    localField: "recruiter_id",
                    foreignField: "_id",
                    as: "recruiterDetails"
                }
            },
            { $unwind: "$recruiterDetails" }, 
            {
                $project: {
                    company_name: "$recruiterDetails.company_name",
                    job_id: "$_id",
                    recruiter_id: "$recruiter_id",
                    position: "$position",
                    location: "$location",
                    salary: "$salary",
                    job_type: "$job_type",
                    summary: "$summary",
                    requirenment: "$requirenment",
                }
            }
        ])

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
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


async function applyJob(req) {
    let func_name = "applyJob"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { apply_type,job_id,job_seeker_id,recruiter_id,cover_letter,status} = req.body;
        
        if(apply_type == "save_job"){
            await SavedJob.create( { job_id,job_seeker_id } );
        }
        if(apply_type == "apply_job"){
            await Application.create( { job_id,job_seeker_id,recruiter_id,cover_letter ,status} );
        }
        
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

async function getSavedJobs(req) {
    let func_name = "getSavedJobs"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id=req.body.user_id
        
        let jobDetails= await SavedJob.aggregate([
            {
                $match: { job_seeker_id: new mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: "jobs",  
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" }, 
            {
                $lookup: {
                    from: "users",  
                    localField: "jobDetails.recruiter_id",
                    foreignField: "_id",
                    as: "recruiterDetails"
                }
            },
            { $unwind: "$recruiterDetails" },
            {
                $project: {
                    saved_job_id: "$_id",
                    recruiter_id: "$jobDetails.recruiter_id",
                    position: "$jobDetails.position",
                    location: "$jobDetails.location",
                    salary: "$jobDetails.salary",
                    job_type: "$jobDetails.job_type",
                    summary: "$jobDetails.summary",
                    requirenment: "$jobDetails.requirenment",
                    job_id: "$jobDetails._id",
                    company_name:"$recruiterDetails.company_name"
                }
            }
        ]);
            
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
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


async function getAppliedJobs(req) {
    let func_name = "getAppliedJobs"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id=req.body.user_id
        
        let jobDetails= await Application.aggregate([
            {
                $match: { job_seeker_id: new mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: "jobs",  
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" }, 
            {
                $lookup:{
                    from :"users",
                    localField:"jobDetails.recruiter_id",
                    foreignField:"_id",
                    as:"recruiterDetails"
                }

            },
            {$unwind:"$recruiterDetails"},
            {
                $project: {
                    applied_job_id: "$_id",
                    status:"$status",
                    recruiter_id: "$jobDetails.recruiter_id",
                    position: "$jobDetails.position",
                    location: "$jobDetails.location",
                    salary: "$jobDetails.salary",
                    job_type: "$jobDetails.job_type",
                    summary: "$jobDetails.summary",
                    requirenment: "$jobDetails.requirenment",
                    job_id: "$jobDetails._id",
                    company_name:"$recruiterDetails.company_name"
                }
            }
        ]);
            
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
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

async function unsaveJob(req) {
    let func_name = "unsaveJob"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { saved_job_id} = req.body;
        
        await SavedJob.findByIdAndDelete(saved_job_id);
        
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