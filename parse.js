var request = require('request');
var db=require('./db');
var cheer = require('cheerio');

var url = "https://www.goodreads.com/quotes/tag?utf8=%E2%9C%93&id=Festival",
    name = "Festival";
// completeddd
var n=1; getData(url);
function count(n){
  if(n<=10){
    var mainUrl = url+n;
    //getData(mainUrl);

    setTimeout(function(){
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> current page:"+n);
              ++n;
    count(n)
    },6000);
  }else{
    return ;
  }
}
count(n);

function getData(match_url){
  request(match_url,function(err, resp, matchContent){
    $ = cheer.load(matchContent);
    var content = "";
    //var content = if($("meta[name=discription]").attr("content") !== undefined) ? $("meta[name=discription]").attr("content") : "";
    var pageData = $(".quoteText").text();
	//pageData = JSON.stringify(pageData);
	var abc = extractText(pageData); 
	//console.log(abc[10]+"-----------"+abc.length);
  var j=0;
  function store(j){
    if(j<abc.length){
      if(abc[j].toString().length > 8){
        storeData(name,abc[j].toString());
      }
      ++j;
      store(j);
    }else{
      return ;
    }
  }store(j)
  // for(var i=0;i<abc.length;i++){
    
  //   //console.log(i+")"+abc[i].toString()+"\n")
  // }

  })
}
function storeData(category,quote){
     new db.Quotes({"category":category,"quote":quote,"createdOn":new Date()})
                         .save(function(err,ok){
                            if(err)
                              console.log('error while inserting quote '+err);
                              else
                               console.log('record stored--\n'+ok.quote);
                  
                              });
}

function extractText( str ){
  var ret = "";

  if ( /"/.test( str ) ){
    ret = str.match( /“(.*?)”/g);
  } else {
    ret = str;
  }

  return ret;
}

function remove1(){
  var abc=[];
   db.Quotes.find({}).exec(function(err,data){
    if(err)
      console.log("error at gettting data:"+err)
    else{
      if(data){
          var i=0;
        console.log("total records:"+data.length)
        function count(i){
          if(i < data.length){
            if(data[i].quote.length < 10){
              abc.push(data[i]._id);
              console.log("id inserted:"+data[i]._id);
              i++;
              count(i)
            }
          }else{
            console.log("total removable:"+abc.length)
            return;
          }
        }count(i)
      }
    }

});
}
