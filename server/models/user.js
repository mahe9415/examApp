const mongoose = require("mongoose");
const validator = require("validator")
var UserSchema = mongoose.Schema({
name: {
	type:String,
	required: true,
	minlength:4 
},
studentId : {
	type:String,
	required:true,
	unique:true
},
department : {
	type:String,
	required:true
},
mobile:
{
	type:Number,
  required:true,
	validate:{
		validator:(value)=>{
      return validator.isMobilePhone(value,'en-IN');
            },
	message:'Not valid mobile number'
	}
},
email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
       isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]


});
var User = mongoose.model('students',UserSchema);
module.exports = {User}
