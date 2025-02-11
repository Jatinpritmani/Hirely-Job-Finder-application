const mongoose=require("mongoose")
const utility_func=require("../utilities/utility-functions")

const jobSchema = new mongoose.Schema({
    job_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'},
    recruiter_id:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    position:{type:String},
    location:{type:String},
    salary:{type:Number},
    job_type:{type:String},
    summary:{type:String},
    requirenment:{type:String},
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        ret.job_id=ret._id.toString(); 
        delete ret._id; 
        return ret; } }   // Ensure aliases work in JSON responses
  });


const Job = mongoose.model('Job', jobSchema);

module.exports = {Job};
