const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/onlineExam',(err,db)=>{
	 i=1;
	 n=db;
	})

module.exports={
	MongoClient
}