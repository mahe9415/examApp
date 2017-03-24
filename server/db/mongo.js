const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/onlineExam',(err,db)=>{
	
	 n=db;
	})

module.exports={
	MongoClient
}