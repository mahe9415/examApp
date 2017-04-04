const mongoose= require("mongoose");

var resultSchema = mongoose.Schema({
user:{
	type:String
},
answer :{
	type:String
},
question_Id:{
	type:String
}
});

var result=mongoose.model('result',resultSchema);
module.exports={result}