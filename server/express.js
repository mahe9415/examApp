const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const {User} = require('./models/user');
const {qa} = require("./models/qa");
const {result}= require("./models/result")
const{MongoClient}= require("./db/mongo");
const _ = require("lodash");

mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/onlineExam');
var bodyParser = require('body-parser')


var app= express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','hbs');
hbs.registerPartials(__dirname+'./../views/');



//POST QUESTIONS // PostQuestions.html
app.post('/postQuestions',(req,res)=>{
	// console.log(req.body);
	if(req.body.question_Type == 'objective'){
	var body=_.pick(req.body,['question','question_Type','category','a','b','c','d']);
	var question_Id=mongoose.Types.ObjectId();
	body.question_Id=question_Id;
	var que = new qa(body);
	que.save().then((doc)=>{
		res.send("posted");
		return;
	})}
	console.log(req.body.question_Type);
	if(req.body.question_Type == 'fill_in_the_blank_answer')
	{ console.log(req.body.question_Type);
		var body=_.pick(req.body,['question','question_Type','category','fill_in_the_blank_answer']);
		var question_Id=mongoose.Types.ObjectId();
		body.question_Id=question_Id;
		var que = new qa(body);
		que.save().then((doc)=>{
			res.send("posted a fill_in_the_blank_answer ");
		})}
	}
);


app.get('/check',(req,res)=>{
	qa.find({},'question a').then((doc)=>{
		console.log(doc);
	res.send(doc[0].question,doc[0].a);
	console.log(doc);
}).catch((e)=>{
	res.send(e);
})})


//send an array of question and answer to browser via ajax call at onload
app.get("/log",(req,res)=>{
qa.find({}).then((doc)=>{
// res.render(('exampage.hbs',{que:doc[0].question,a:doc[0].a,b:doc[0].b,c:doc[0].c,d:doc[0].d}),locations);
res.send(doc);
})})

//
app.post("/result",(req,res)=>{
		
	var body=_.pick(req.body,['answer','question_Id']);

	console.log(body);
	var res = new result(body);
	res.save().then((doc)=>{
	}).catch((e)=>{
		console.log(e);
	})
})



//POST USER DATA //register.html
app.post('/postUserData',(req,res)=>{
var user = new User(req.body);
user.save().then((doc)=>{
	if(!doc)
	{
		res.status(400).send();
	}
	qa.find({},'question a b c d').then((doc)=>{
	res.render('exampage.hbs',{que:doc[0].question,a:doc[0].a,b:doc[0].b,c:doc[0].c,d:doc[0].d});

}).catch((e)=>{
	res.send(e);
	return Promise.reject(e);
})}).catch((e)=>{
	res.send("could not save");
})});

app.get('/exam',(req,res)=>{
	qa.find()

})
//question render 
app.get('/',(req,res)=>{
	
	// n.collection('mycol').findOne({q:i},(err,result)=>{
 	res.render('exampage.hbs',{que:"ha"});

});


app.listen('3000','0.0.0.0');

