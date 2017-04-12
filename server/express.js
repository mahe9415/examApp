const express = require('express');
const hbs = require('hbs');
const mongoose = require("mongoose");
const { User } = require('./models/user');
const { qa } = require("./models/qa");
const { result } = require("./models/result")
const { MongoClient } = require("./db/mongo");
const _ = require("lodash");
const { authenticate } = require('./middleware/authenticate');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/onlineExam');
var bodyParser = require('body-parser')
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "its a secret!" }));
app.set('view engine', 'hbs');
// app.use(cookieParser());
hbs.registerPartials(__dirname + './../views/');
var sess;
//POST QUESTIONS // PostQuestions.html
app.post('/postQuestions', (req, res) => {
    console.log(req.body);
    if (req.body.question_Type == 'objective') {
        var body = _.pick(req.body, ['question', 'question_Type', 'category', 'a', 'b', 'c', 'd','e','f','correct_answer']);
        console.log(body);
        var que = new qa(body);
        que.save().then((doc) => {
            res.send("posted");
            return;
        })
    }
    // console.log(req.body.question_Type);
    if (req.body.question_Type == 'fill_in_the_blank_answer') {
        console.log(req.body.question_Type);
        var body = _.pick(req.body, ['question', 'question_Type', 'category']);
        body.correct_answer = req.body.correct_fillup;
        var que = new qa(body);
        que.save().then((doc) => {
            res.send("posted a fill_in_the_blank_answer");
        })
    }
});

app.get('/check', (req, res) => {
        qa.find({}, 'question a').then((doc) => {
            console.log(doc);
            res.send(doc[0].question, doc[0].a);
            console.log(doc);
        }).catch((e) => {
            res.send(e);
        })
    })
    //send an array of question and answer to browser via ajax call at onload
app.get("/log", (req, res) => {
        qa.find({},'question question_Type category a b c d e f question_Id ').then((doc) => {
            res.send(doc);
        })
    })
app.get("/logAdmin", (req, res) => {
        qa.find({},'question question_Type category a b c d e f  question_Id correct_answer').then((doc) => {
            res.send(doc);
        })
    })
app.delete("/log",(req,res)=>{
    console.log(req.body.question_Id);
    // qa.findOneAndRemove({question_Id:req.body.question_Id})
    qa.remove({question_Id:req.body.question_Id})
    .then((doc)=>{
        console.log("deleted :"+doc);
        res.status(200).send();
    })

})
app.patch("/log",(req,res)=>{
    // console.log(req.body);
    var data=req.body.data;
    if(data.question_Type== 'fill_in_the_blank_answer'){
    data.correct_answer = data.correct_fillup;}
    // data.correct_answer=req.body.data.correct_fillup;
    qa.findOneAndUpdate({"question_Id":req.body.question_Id},{$set :data})
    .then((doc)=>{
        console.log(doc)
    })
    // qa.update({"question_Id":req.body.question_Id},{$set :data});
    res.status(200).send()
})
    
app.post("/result", authenticate, (req, res) => {
    var count = 0;
    var body = _.pick(req.body, ['answer']);
    _.forEach(body.answer, function(value, index) {
        qa.find({ 'question_Id': value.question_Id }, 'correct_answer').then((doc) => {
            if (value.userAnswer == doc[0].correct_answer) {
                body.answer[index].ans_validate = true
                count++;
            } else {
                body.answer[index].ans_validate = false
                console.log("wrong");
            }
            console.log(index);
            // console.log(body.answer);
            if (index == (body.answer.length)-1){
                // console.log("msg");
            var ans = new result(body);
            ans.user = req.user.name;
            ans.count = count;
            ans.save().then((doc) => {
                console.log(doc);
                res.send();
            }).catch((e) => {
                // console.log(e);
            })
        }})
    })
})
app.get('/displayResult',authenticate,(req, res) => {
     // console.log("dv");
    result.findOne({user:req.user.name},'count user').then((doc)=>{
        // console.log(req.user.name);
                console.log(req.user.name);
                console.log(doc);

        res.render('result.hbs',{'user':doc.user,'count':doc.count});
    })
        
    // res.render('result.hbs', { user: 'user', count: 'count' });

})


app.get('/checkToken', authenticate, (req, res) => {
        User.find({}).then((doc) => {
            res.send(doc);
        })
    })
    //POST USER DATA //register.html
app.post('/postUserData', (req, res) => {
    console.log(req);
    var user = new User(req.body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.cookie("x-auth", token);
        res.render('vue.hbs', { user: req.body.name });
    }).catch((e) => {
        res.status(400).send(e);
    })
});
app.get('/login', (req, res) => {
    sess = req.session;
    if (sess.auth) {
        res.send("welcome");
    } else {
        sess.auth = "yup";
        res.send("cool try again");
    }
    console.log(req);
})


//question render 
app.get('/', (req, res) => {

    // n.collection('mycol').findOne({q:i},(err,result)=>{
    res.render('exampage.hbs', { que: "ha" });

});




app.post('/adminLogin', (req, res) => {
    // var body = _.pick(req.body, ['user', 'password']);
    console.log(req.body.user);
    if (req.body.user == "admin" && req.body.password == "1234") {
        res.render('postQuestions.hbs');
    } else {
        res.status(400).send("bad request");
    }
});
app.listen('3000', '0.0.0.0');
