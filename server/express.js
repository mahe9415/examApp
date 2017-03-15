const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const {User} = require('./models/user');
const{MongoClient}= require("./db/mongo.js")

mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/test');



var Qa= mongoose.model('mycol',{
name: {
	type: String,
	required: true
},
id: {
	type:Number,
	required:true
},
q:
{
	type:Number
},
que:
{
	type:String,
},
ans:{
	a:{type:String},
	b:{type:String},
	c:{type:String},
	d:{type:String}
}
});



var app= express();
app.use(express.static('public'))

app.set('view engine','hbs');
hbs.registerPartials(__dirname+'./../views/partials');
hbs.registerHelper('wow',()=>{
	document.getElementByid('ab').addEventListener('click',function(){alert('helo');})
})
app.get('/get',(req,res)=>
{
var query = Todo.find();
query.exec(function (err, docs) {
  
  // console.log(docs);
  res.send(docs);
 
});
	});





app.get('/',(req,res)=>{
	
	if(i >2){
	res.render('thankyou.hbs',{cool:" c yu soon"});
	return;
}
	n.collection('mycol').findOne({q:i},(err,result)=>{
		q = result.que;
		console.log(q);
	// var q=collection.find({id:10});
	// Todo.findOneAndRemove({id:15});
	// var q = Todo.findOne({id:10} ,'name')
	// console.log(q);
 	res.render('exampage.hbs',{que:q});

i++;






	// Todo.find({"id":10});
	// console.log(Todo.name);
	// 	res.render('exampage.hbs',{que:Todo.name})
	
	
});
});


app.listen('3000');

