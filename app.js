// require modules

var db=require('./db');
var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var app = express();
var socket=require('socket.io');
var server = http.createServer(app).listen(3000);
var io = socket.listen(server);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use("views", express.static(__dirname + '/views'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.engine("html",require('ejs').renderFile);
//app.engine('html', cons.swig);
app.set('view engine', 'html');

app.get("/",function(req,res){
    res.render("index.html");
})
app.post("/",function(req,res){
    var category = req.body.quote.type;
    var quote = req.body.quote.text;
    if(category !== "null" && quote !==""){
        storeData(category,quote);
    }else{
        console.log('data cannot be saved due to empty value insertion ');
    }
    console.log(req.body.quote.type);
    console.log(req.body.quote.text);
                            
    res.render("index.html");
})
app.post("/:email/:deviceId",function(req,res){
  // res.render("index.html")
  var email = req.params.email;
  var deviceId = req.params.deviceId;
  console.log("user mobile:"+email+"\n device id:"+deviceId+"\n stored in db");

                         new db.UserData({"_id":email,"email":email,"deviceId":deviceId,"createdOn":new Date()})
                         .save(function(err,ok){
                            if(err){
                              console.log('error while inserting doc already exist we are updating');
                               db.UserData.update({"_id":email},{$set:{"deviceId":deviceId}},function(err,ok){
                                if(err)
                                  console.log("\n #### internal error"+err);
                                else{
                                                  console.log("record updated"+JSON.stringify(ok));
                                }
                  
                              });
                            }
                            else
                              console.log('created successfully'+ok);

                              });
 // res.json({"status":mobile});
})
function storeData(category,quote){
     new db.Quotes({"category":category,"quote":quote,"createdOn":new Date()})
                         .save(function(err,ok){
                            if(err)
                              console.log('error while inserting quote '+err);
                              else
                               console.log('record stored');
                  
                              });
}
io.sockets.on('connection', function(client){
  // client.emit('countryList',
  // })
  getClist(function(data){
    console.log("socket emit @getCategory")
    client.emit('getCategory',data)
  })
  client.on('getQuotes',function(category){
    getQuotes(category,function(data){
      console.log(category+"--")
      client.emit('getQuotes',data)
    })
   })
  client.on('removeQuotes',function(data){
    console.log(data);
    removeQuotes(data,function(status){
      client.emit('removeQuotes',status);
    })
    
  })
});
function getClist( callback ){
    db.Quotes.distinct('category').exec(function(err,data){
      if(err)
        console.log(err)
      else{
        console.log('am in server:')
        callback (data);
      }
    })
  }
function getQuotes(category,callback){
  db.Quotes.find({'category':category}).exec(function(err,data){
    if(!err && data){
      //console.log(data)
      callback(data)
    }
  });
}
function removeQuotes(data,callback){
  for(var i=0;i<data.length;i++){
    removeQ(data[i]);
  }
callback({'status':'success'})
}
function removeQ(id){
  console.log(id);
    db.Quotes.remove({'_id':id}).exec(function(err,data){
    if(!err && data){
      console.log("success")
      // callback(data)
    }
  });

}