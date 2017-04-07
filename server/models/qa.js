const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require('mongoose-auto-increment');
var connection=mongoose.createConnection('mongodb://localhost:27017/onlineExam');
autoIncrement.initialize(connection);
var qaSchema = mongoose.Schema({
question :
{
	type:String,
},
question_Id:{
	type:String,
	defalut:0
},
question_Type :{
	type: String,
	required:true
},
category :
{
	type:String,
	required:true
},
	a:{
		type:String
	},
	b:{
		type:String
	},
	c:{
		type:String
	},
	d:{
		type:String
	},
	correct_answer:{
		type:String
	}
});
qaSchema.plugin(autoIncrement.plugin, {
    model: 'qa',
    field: 'question_Id',
    startAt: 1,
    incrementBy:1
});
qaSchema.methods.toJSON =  function(){
var question = this;
  var questionObject = question.toObject();
  return _.pick(questionObject, ['question', 'question_Type', 'category', 'a', 'b', 'c', 'd','question_Id']);
};
var qa=mongoose.model('questions',qaSchema);
module.exports={qa};