const mongoose = require("mongoose");
var qaSchema = mongoose.Schema({
question :
{
	type:String,
},
question_Id:{
	type:String
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
	fill_in_the_blank_answer : {
		type:String
	}
});


var qa=mongoose.model('questions',qaSchema);

module.exports={qa};