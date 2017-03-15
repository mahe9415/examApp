const mongoose = require("mongoose");
const validator = require("validator")

var qa = mongoose.Schema({
question :
{
	type:String,
}
question_Id:{
	type: mongoose.Schema.Type.ObjectId
},
category :
{
	type:String,
	required:true
}
options :[{
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
	}
}]
});
