const mongoose=require("mongoose")
const utility_func=require("../utilities/utility-functions")

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true }, 
});
const userSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'}, 
    user_email: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    user_password: { type: String, required: true },
    user_type: { type:String,enum : utility_func.responseCons.USER_TYPES,default:'job_seeker'},
    resume: resumeSchema,
    designation : {type:String} 
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        ret.user_id=ret._id.toString(); 
        delete ret._id; 
        return ret; } }   // Ensure aliases work in JSON responses
  });


const User = mongoose.model('User', userSchema);

module.exports = {User};
