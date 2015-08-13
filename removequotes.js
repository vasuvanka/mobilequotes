var db=require('./db');
var abc=[];
 db.Quotes.find().count().exec(function(err,data){
  	if(err)
  		console.log("error at gettting data:"+err)
  	else{
  		// if(data){
  		// 		var i=0;
				// console.log("total records:"+data.length)
				// function count(i){
				// 	if(i < data.length){
				// 		if(data[i].quote.length < 10){
				// 			abc.push(data[i]._id);
				// 			console.log("id inserted:"+data[i]._id);
				// 			i++;
				// 			count(i)
				// 		}
				// 	}else{
				// 		console.log("total removable:"+abc.length)
				// 		return;
				// 	}
				// }count(i)
  		// }
  		console.log(data);
  	}

});