const mongoose = require("mongoose");
const _ = require("lodash");
const autoIncrement = require('mongoose-auto-increment');
var connection=mongoose.createConnection('mongodb://mahe:123@ds235788.mlab.com:35788/exam');
autoIncrement.initialize(connection);
var qaSchema = mongoose.Schema({
question :
{
	type:String,
	trim:true
},
question_Id:{
	type:String,
	defalut:0
},
question_Type :{
	type: String,
	required:true,
	set: toLower
},
category :
{
	type:String,
	set: toLower
	// required:true
},
	a:{
		type:String,
		trim:true,
		set: toLower
	},
	b:{
		type:String,
		trim:true,
		set: toLower
	},
	c:{
		type:String,
		trim:true,
		set: toLower
	},
	d:{
		type:String,
		trim:true,
		set: toLower
	},
	e:{
		type:String,
		trim:true,
		set: toLower
	},
	f:{
		type:String,
		trim:true,
		set: toLower
	},
	correct_answer:{
		type:String,
		trim:true,
		set: toLower
	},
	c1:{
		type:String,
		trim:true,
		set: toLower
	},
	c2:{
		type:String,
		trim:true,
		set: toLower
	},
	c3:{
		type:String,
		trim:true,
		set: toLower
	},
	c4:{
		type:String,
		trim:true,
		set: toLower
	},
	c5:{
		type:String,
		trim:true,
		set: toLower
	},
	c6:{
		type:String,
		trim:true,
		set: toLower
	},
	time:{
		type:Number
	}
});


qaSchema.plugin(autoIncrement.plugin, {
    model: 'qa',
    field: 'question_Id',
    startAt: 1,
    incrementBy:1
});

function toLower (v) {
	console.log(v.toLowerCase())
  return v.toLowerCase();
}

// qaSchema.methods.toJSON =  function(){
// var question = this;
//   var questionObject = question.toObject();
//   return _.pick(questionObject, ['question', 'question_Type', 'category', 'a', 'b', 'c', 'd','question_Id']);
// };
var qa=mongoose.model('questions',qaSchema);
module.exports={qa};