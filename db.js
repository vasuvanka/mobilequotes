var mongoose = require('mongoose');
var d1 = new Date();
 mongoose.connect('mongodb://username:password@ds031531.mongolab.com:31531/testdb',function(err, db){
  if(err)
    console.log(err)
  else{
    var d2 = new Date();
    console.log("time taken to connect to db is " + (d2-d1))
  }
});

exports.Quotes = mongoose.model('quotes' , {
	"category":String,
	"quote":String,
	"createdOn":Date,
  },"quotes");
exports.UserData = mongoose.model('UserData' , {
  "email":String,
  "deviceId":String,
  "createdOn":Date,
  },"UserData");
