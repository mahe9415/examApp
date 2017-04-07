const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
var AdminSchema = mongoose.Schema({
name:{
	type:String,
	required: true,
	minlength:4 
},
adminId : {
	type:String,
	required:true,
	unique:true
},
department : {
	type:String,
	required:true
},
gender :{
  type:String,
  required:true
},
dob :{
  type:String,
  required:true
},
college :{
  type:String,
  required:true
},
tel:
{
	type:String,
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
  }],
  address:{
    type:String,
    required:true
  }
});
AdminSchema.methods.generateAuthToken = function () {
  var admin = this;
  var access = 'auth';
  var token = jwt.sign({_id: admin._id.toHexString(), access}, 'pass').toString();
  admin.tokens.push({access, token});
  return admin.save().then(() => {
  return token;
  });
};
AdminSchema.statics.findByToken = function (token) {
  var Admin = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'pass');
  } catch (e) {
    return Promise.reject();
  }
  return Admin.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};
var Admin = mongoose.model('students',AdminSchema);
module.exports = {Admin}
