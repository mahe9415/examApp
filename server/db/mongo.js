const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://mahe:123@ds235788.mlab.com:35788/exam',(err,db)=>{
console.log(err)	
	 n=db;
	})

module.exports={
	MongoClient
}