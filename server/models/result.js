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
    answer: [{
        question_Id: {
            type: String
        },
        userAnswer: {
            type: String
        },
        ans_validate: {
            type: Boolean
        }
    }],
    count:{
    	type:Number
    }
});
var result = mongoose.model('result', resultSchema);
module.exports = { result }
