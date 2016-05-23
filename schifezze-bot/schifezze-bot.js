var TelegramBot = require('node-telegram-bot-api');
var schifezzaService = require('../schifezzaService.js');

var BOT_TOKEN = '238845456:AAGmOyFHlzmm7NVRBf36CF06VhBAEBlg7QM';

function InlineQueryParser(message){
  var CONFIRMATION_TOKEN = 'ciccione confirmed';
  var PRIZE_TOKEN = 'premio';

  var schifezzaRegex = new RegExp('^(\\d+(?:[.,]\\d)?)\\s*€?\\s(.+)\\s+('+CONFIRMATION_TOKEN+')$', 'i');
  var prizeRegex = new RegExp('^premio\\s(\\d+(?:[.,]\\d)?)\\s*€?\\s(.+)\\s+('+CONFIRMATION_TOKEN+')$', 'i');

  var query = message.query;

  var ciccioneConfirmed = function(){
    return query.toLowerCase().endsWith(CONFIRMATION_TOKEN);
  };

  var getCommandParams = function (matches) {
    if (matches && matches.length >= 3){
      return {
        value: matches[1],
        description: matches[2]
      }
    }
    return null;
  }

  var getCommand = function(query) {
    var params = null;
    var matches = schifezzaRegex.exec(query);

    //BOH from now on
    if (!matches) matches = prizeRegex.exec(query);

    params = getCommandParams(matches);
    if (!params) return null;

    if(query.startsWith(PRIZE_TOKEN)) params.type = 'prize';
    else params.type = 'schifezza';

    return params;
  };

  var parseQuery = function(){
    var command = getCommand(query);
    if (!command) return {type: 'error'};
    return command;
  };

  return {
    ciccioneConfirmed: ciccioneConfirmed,
    parseQuery: parseQuery
  };
};

var bot = new TelegramBot(BOT_TOKEN, {polling: true});

bot.getMe().then(function(data){console.log(data)});

bot.on('inline_query', function(message){
  var parser = InlineQueryParser(message);

  var query = message.query;
  if (parser.ciccioneConfirmed()){
    var command = parser.parseQuery();

    if (command && command.type === 'schifezza'){
      schifezzaService.addSchifezza({
        username: message.from.username,
        description: command.description,
        value: command.value,
        date: new Date()
      }, function(err){
        if (!err) console.log('Added schifezza from', message.from.username, ':', command.description,'|', command.value, '€');
        else console.log(err);
      });
    }
    else if(command && command.type === 'prize'){
      schifezzaService.addPrize({
        username: message.from.username,
        description: command.description,
        value: command.value,
        date: new Date()
      }, function(err){
        if (!err) console.log('Added prize from', message.from.username, ':', command.description,'|', command.value, '€');
        else console.log(err);
      });
    }
  }

  bot.answerInlineQuery(message.id,
    [{
      type: 'photo',
      id: 'silviapizza',
      photo_url: 'http://i.imgur.com/qacF7mV.jpg',
      thumb_url: 'http://i.imgur.com/qacF7mVt.jpg',
      input_message_content: {message_text: "Sono cicciona!"},
      cache_time: 1
  }]).then(function(data){
  }).catch(function(err){
    console.log(err);
  });
});
