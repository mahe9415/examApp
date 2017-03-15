const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/test',(err,db)=>{
	 i=1;
	 n=db;
	})

module.exports={
	MongoClient
}