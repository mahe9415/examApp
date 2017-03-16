const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const {User} = require('./models/user');
const {qa} = require("./models/qa")
const{MongoClient}= require("./db/mongo");
const _ = require("lodash");


mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/onlineExam');
var bodyParser = require('body-parser')


var app= express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','hbs');
hbs.registerPartials(__dirname+'./../views/partials');
app.get('/get',(req,res)=>
{
var query = User.find();
query.exec(function (err, docs) {
  
  // console.log(docs);
  res.send(docs);
 
});
	});

//POST QUESTIONS // PostQuestions.html
app.post(('/postQuestions'),(req,res)=>{
	var body=_.pick(req.body,['question','question_Type','category','a','b','c','d']);
	var question_Id=mongoose.Types.ObjectId();
	body.question_Id=question_Id;
	var que = new qa(body);
	console.log(body);
	que.save().then((doc)=>{
		console.log(doc);
		res.send("posted");
	})
}
);


app.get('/check',(req,res)=>{
	qa.find({},'question').then((doc)=>{
	res.send(doc[0].question);
	console.log(doc);
}).catch((e)=>{
	res.send(e);
})})






//POST USER DATA //register.html
app.post('/postUserData',(req,res)=>{
var user = new User(req.body);
user.save().then((doc)=>{
	if(!doc){
		res.status(400).send();
	}
var question = qa.findOne({}).select('question');
console.log(question);
	res.render('exampage.hbs',{que:""});
	}

	).catch((e)=>
	{
		return Promise.reject(e);
	}
)});


app.get('/',(req,res)=>{
	
	if(i >2){
	res.render('thankyou.hbs',{cool:" c yu soon"});
	return;
}
	n.collection('mycol').findOne({q:i},(err,result)=>{
		// q = result.que;
		// console.log(q);
	// var q=collection.find({id:10});
	// Todo.findOneAndRemove({id:15});
	// var q = Todo.findOne({id:10} ,'name')
	// console.log(q);
 	res.render('exampage.hbs',{que:"ha"});

i++;






	// Todo.find({"id":10});
	// console.log(Todo.name);
	// 	res.render('exampage.hbs',{que:Todo.name})

});
});


app.listen('3000');

