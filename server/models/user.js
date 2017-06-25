const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
var UserSchema = mongoose.Schema({
name:{
	type:String,
	required: true,
	minlength:4 ,
  trim:true
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
gender :{
  type:String,
  required:true
},
dob :{
  type:String,
  required:true
},
college :{
  type:String
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
  }]
});
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'pass').toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
  return token;
  });
};
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'pass');
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};


var User = mongoose.model('students',UserSchema);
module.exports = {User}
