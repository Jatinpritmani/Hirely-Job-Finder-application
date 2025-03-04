const mongoose=require("mongoose")

const userSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'}, 
    user_email: { type: String, required: true, unique: true },
    user_name: { type: String, required: true },
    user_password: { type: String, required: true },
    user_type: { type:String,enum:['job_seeker','recruiter'],default:'job_seeker'}
  },
  {
    autoCreate: true,
    timestamps: true,
  });


const User = mongoose.model('User', userSchema);

module.exports = {User};
