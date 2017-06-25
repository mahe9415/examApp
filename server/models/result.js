const mongoose = require("mongoose");
const { qa } = require("./qa");
const _ = require("lodash");
var resultSchema = mongoose.Schema({
    user: {
        type: String
    },
    id:{
        type:String
    },
    dept:{
      type:String  
    },
    answer: [{
        question_Id: {
            type: String
        },
        userAnswer: {
            type: String,
            set:toLower,
            trim:true
        },
        ans_validate: {
            type: Boolean
        }
    }],
    count:{
    	type:Number
    }
});

function toLower (v) {
    console.log(v.toLowerCase())
  return v.toLowerCase();
}
var result = mongoose.model('result', resultSchema);
module.exports = { result }
