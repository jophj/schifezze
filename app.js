var Twig = require("twig"),
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    schifezzeBot = require('./schifezze-bot/schifezze-bot.js'),
    schifezzaService = require('./schifezzaService.js'),
    app = express();

mongoose.connect('mongodb://mediacenter/schifezze');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var app = initExpressApp();
  app.listen(8931);
});

 
function initExpressApp(){
  app.set("twig options", {
    strict_variables: false
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  })); 

  app.use('/highcharts', express.static(__dirname + '/node_modules/highcharts'));
  app.use('/materialize-css', express.static(__dirname + '/node_modules/materialize-css/dist'));
  app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
  app.use('/scripts', express.static(__dirname + '/scripts'));

  var renderData = {
    recap: {
      jop: null,
      silvia: null
    },
    schifezzeList: {
      jop: null,
      silvia: null
    }
  };
  
  var silviaMessagesCallback = function(list, callback){  //last one
    renderData.schifezzeList.silvia = list;
    if (callback) callback(renderData);
  };
  
  var jopMessagesCallback = function(list, callback){
    renderData.schifezzeList.jop = list;
    schifezzaService.getSchifezzeMessages('naashira', function(list){
      silviaMessagesCallback(list, callback);
    });
  };
  
  var silviaRecapCallback = function(callback){
    schifezzaService.getSchifezzeMessages('JoPhj', function(list){
      jopMessagesCallback(list, callback)
    });
  };
  
  var jopRecapCallback = function (callback) {
    schifezzaService.getRecap('naashira', function (recap) {
      renderData.recap.silvia = recap;
      silviaRecapCallback(callback);
    });
  }
  
  var getAllDataToRender = function(callback){
    schifezzaService.getRecap('JoPhj', function (recap) {
      renderData.recap.jop = recap;
      jopRecapCallback(callback);
    }); 
  };
  
  app.get('/', function(req, res){
    getAllDataToRender(function(allData){
      res.render('index.twig', allData);
    }, function(data){
      console.log(data);
    });
  });

  app.post('/api/schifezze', function(req, res){

    var usernameMap = {
      'Jop': 'JoPhj',
      'Silvia': 'naashira'
    };

    schifezzaService.addSchifezza({
      username: usernameMap[req.body.username],
      description: req.body.comment,
      value: req.body.value
    }, function(err, result){
      if (!err) res.sendStatus(200);
      else res.sendStatus(500);
    });
    
  });
   
  return app;
}