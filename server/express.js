const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')(session);
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
// const flash = require('connect-flash');
const promisify = require('es6-promisify');
const { User } = require('./models/user');
const { qa } = require("./models/qa");
const { result } = require("./models/result")
const { MongoClient } = require("./db/mongo");
const _ = require("lodash");
const { authenticate } = require('./middleware/authenticate',);
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mahe:123@ds235788.mlab.com:35788/exam');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "its a secret!" }));
app.set('view engine', 'hbs');


// app.configure(function() {
//   app.use(express.cookieParser('keyboard cat'));
//   app.use(express.session({ cookie: { maxAge: 60000 }}));
//   app.use(flash());
// });
// var sessionStore = new session.MemoryStore;

// app.use(cookieParser('secret'));
// app.use(session({
//     cookie: { maxAge: 60000 },
//     store: sessionStore,
//     saveUninitialized: true,
//     resave: 'true',
//     secret: 'secret'
// }));
// app.use(flash());
// app.use(cookieParser());
hbs.registerPartials(__dirname + './../views/');
var sess;
app.get('/', (req, res) => {
    // req.flash('info', 'Flash is back!');
    // res.render('index.hbs');
      // req.flash('success', 'This is a flash message using the express-flash module.');
      res.render('index.hbs');
      // res.render('index', { expressFlash: req.flash('success','woooooooo'), sessionFlash: res.locals.sessionFlash });
});



//POST QUESTIONS // PostQuestions.html
app.post('/postQuestions', (req, res) => {
    // console.log(req.body);
    if (req.body.question_Type == 'objective') {
        var body = _.pick(req.body, ['question', 'question_Type', 'category', 'a', 'b', 'c', 'd','e','f','correct_answer','time']);
        var que = new qa(body);
        que.save().then((doc) => {
            res.send("posted");
            return;
        })
    }
    // console.log(req.body.question_Type);
    if (req.body.question_Type == 'fill_in_the_blank_answer') {
        // console.log(req.body.question_Type);
        var body = _.pick(req.body, ['question', 'question_Type', 'category','time']);
        body.correct_answer = req.body.correct_fillup;
        var que = new qa(body);
        que.save().then((doc) => {
            res.send("posted a fill_in_the_blank_answer");
        })
    }
    if(req.body.question_Type =='checkbox'){
        var body = _.pick(req.body, ['question', 'question_Type', 'category','c1','c2','c3','c4','c5','c6','time']);
        body.correct_answer=req.body.correct_checkbox;
        var que=new qa(body);
        que.save().then((doc)=>{
            res.send("posted checkbox");
        }) 
    }
});

    //send an array of question and answer to browser via ajax call at onload
app.get("/log", (req, res) => {
        qa.find({},'question question_Type category a b c d e f c1 c2 c3 c4 c5 c6 question_Id ').then((doc) => {
            res.send(doc);
        })
    })
app.get("/logAdmin", (req, res) => {
        qa.find({},'question question_Type category a b c d e f c1 c2 c3 c4 c5 c6 question_Id correct_answer').then((doc) => {
            res.send(doc);
        })
    })
app.delete("/log",(req,res)=>{
    // console.log(req.body.question_Id);
    // qa.findOneAndRemove({question_Id:req.body.question_Id})
    qa.remove({question_Id:req.body.question_Id})
    .then((doc)=>{
        // console.log("deleted :"+doc);
        res.status(200).send();
    })
})
app.patch("/log",(req,res)=>{
    // console.log(req.body);
    var data=req.body.data;
    if(data.question_Type== 'fill_in_the_blank_answer'){
    data.correct_answer = data.correct_fillup;}
    else if(data.question_Type=='checkbox'){
        data.correct_answer = data.correct_checkbox;
    }
    // data.correct_answer=req.body.data.correct_fillup;
    qa.findOneAndUpdate({"question_Id":req.body.question_Id},{$set :data})
    .then((doc)=>{
        // console.log(doc)
    })
    // qa.update({"question_Id":req.body.question_Id},{$set :data});
    res.status(200).send()
})  
app.post("/result",authenticate,(req, res) => {
    var count = 0;

function toLower (v) {
    console.log(v.toLowerCase())
  return v.toLowerCase();
}
    console.log(req.body)
    var body = _.pick(req.body, ['answer']);
    _.forEach(body.answer, function(value, index) {
        qa.find({ 'question_Id': value.question_Id }, 'correct_answer').then((doc) => {
            // console.log(doc[0].correct_answer)
            // console.log(value.userAnswer+"val")
            // console.log(doc[0].correct_answer+"db")
            if (value.userAnswer.trim() == doc[0].correct_answer) {
                body.answer[index].ans_validate = true
                count++;
                // console.log("rigth:"+body.answer[index].tostring());
            } else {
                body.answer[index].ans_validate = false
                // console.log("wrong:"+body.answer[index]);
                // console.log("correct answer"+doc[0]);
            }
            // console.log(index);
            // console.log(body.answer);
            if (index == (body.answer.length)-1){
            // console.log(count+"mark");
            var ans = new result(body);
            ans.user = req.user.name;
            ans.dept=req.user.department
            ans.count = count;
            ans.id=req.user.studentId;
            ans.save().then((doc) => {
                // console.log(doc);
                res.send();
            }).catch((e) => {
                // console.log(e);
            })
        }})
    })
})
app.get('/displayResult',authenticate,(req, res) => {
     
    result.findOne({user:req.user.name},'count user').then((doc)=>{
        // console.log(req.user.name);
                // console.log(req.user.name);
                // console.log(doc);

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
    // console.log(req.body);
    var user = new User(req.body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
    res.cookie("x-auth", token);
    res.send();
    }).catch((e) => {
        res.send(e);
    })
});
app.get('/exam',(req,res)=>{
    res.render('test.hbs');
})
app.get('/login', (req, res) => {
    // sess = req.session;
    if (sess.auth) {
        res.send("welcome");
    } else {
        sess.auth = "yup";
        res.send("cool try again");
    }
    // console.log(req);
})
//question render 

app.get('/reg', (req, res) => {
    res.render('register.hbs');
});
app.get('/action', (req, res) => {
    res.render('action.hbs');
});
app.get('/post', (req, res) => {
    res.render('dashboard.hbs');
});

app.get('/admin', (req, res) => {
    res.render('admin.hbs');
});

app.get('/res', (req, res) => {
    res.render('result.hbs');
});

app.post('/adminLogin', (req, res) => {
    // var body = _.pick(req.body, ['user', 'password']);
    // console.log(req.body.user);
    if (req.body.user == "admin" && req.body.password == "1234") {
        res.json({"status":true})
        
    } else {
        res.json({"status":false});
    }
});
app.get('/fetchResults',(req,res)=>{
    // console.log("msg")
    result.find({},'user count id dept').sort({count:"descending"})
    .then((doc)=>{
        // console.log(doc);
        res.send(doc);
    })
})
app.get('/fetchQuestions',(req,res)=>{
    qa.find({},'question_Id question_Type category question')
    .then((doc)=>{
        // console.log(doc);
        res.send(doc);
    })
})
app.get('/time',(req,res)=>{
qa.aggregate([{
$group: {
    _id: null,
    total: {
        $sum: "$time"
    }
  }
}]).then((doc)=>{
    console.log(doc.total)
    res.send(doc)
})  
})
app.listen('3000');


// db.getCollection('questions').aggregate([{
// $group: {
//     _id: null,
//     total: {
//         $sum: "$time"
//     }
//   }
// }])