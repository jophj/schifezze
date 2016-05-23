var SchifezzaMessage = require('./schifezzaMessage.js');

var SchifezzaService = function(){

  var userNameMap = {
    'JoPhj': 'Jop',
    'naashira': 'Silvia'
  };

  var addSchifezza = function(schifezza, callback){
    schifezza.type = 'schifezza';
    var schifezzaMessage = new SchifezzaMessage(schifezza);
    schifezzaMessage.save(callback);
  };

  var addPrize = function(prize, callback){
    prize.type = 'prize';
    var schifezzaMessage = new SchifezzaMessage(prize);
    schifezzaMessage.save(callback);
  };

  var getSchifezzeMessages = function(username, callback){
    SchifezzaMessage.find({username: username}).sort({date: -1}).exec(function(err, result){
      if(callback) callback(result);
    });
  };
  
  var getLastMessage = function(callback){
    SchifezzaMessage.find({}).sort({date: -1}).limit(1).exec(function(err, result){
      if(callback) callback(result[0] || null);
    });
  }

  var getRecap = function (username, callback) {
    var toReturn = {
      username: userNameMap[username] || 'Unknown user',
      totalSchifezze: 0,
      lastMonthTotalSchifezze: 0,
      totalPrize: 0,
    };

    var lastMonthCallback = function(err, lastMonthTotal){
      if (!lastMonthTotal) callback(null);
      toReturn.lastMonthTotalSchifezze = !!lastMonthTotal[0] ? lastMonthTotal[0].total : 0;
      if (callback) callback(toReturn);
    };

    var totalsCallback = function(err, totals){
      if (!totals) callback(null);

      totals.find = function(f){
        for(var i = 0; i < this.length; i++){
          if (f(this[i])) return this[i];
        }
        return null;
      };
      var totalSchifezze = totals.find(function(x){return x._id.type === 'schifezza'});
      var totalPrize = totals.find(function(x){return x._id.type === 'prize'});
      toReturn.totalSchifezze = !!totalSchifezze ? totalSchifezze.total : 0;
      toReturn.totalPrize = !!totalPrize ? totalPrize.total : 0;

      SchifezzaMessage.aggregate([
        {
          $match: {
            $and: [
              {username: username},
              { type: 'schifezza'},
              { date: {$gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)}}, //imma tired
            ]
          }
        },
        {
          $group: {
            _id: { type: "$type" },
            total: { $sum: "$value" }
          }
        }
      ], lastMonthCallback);
    };

    SchifezzaMessage.aggregate([
      { $match: {username: username} },
      {
        $group: {
          _id: { type: "$type" },
          total: { $sum: "$value" }
        }
      }
    ], totalsCallback);
  };

  return {
    addPrize: addPrize,
    addSchifezza: addSchifezza,
    getRecap: getRecap,
    getSchifezzeMessages: getSchifezzeMessages,
    getLastMessage: getLastMessage
  };
};

module.exports = SchifezzaService();