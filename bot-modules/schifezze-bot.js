const BotModule = require('../bot-module');
const schifezzaService = require('../schifezzaService.js');
const InlineQueryParser = require('../schifezze-bot/inline-query-parser.js');

class SchifezzaBotModule extends BotModule {

  initModule() {
    this.bot.on('inline_query', (ctx) => {
      const inlineQuery = ctx.update.inline_query;
      const query = inlineQuery.query || '';
      var parser = InlineQueryParser(inlineQuery);

      if (parser.ciccioneConfirmed()) {
        var command = parser.parseQuery();

        if (command && command.type === 'schifezza') {
          schifezzaService.addSchifezza({
            username: inlineQuery.from.username,
            description: command.description,
            value: command.value,
            date: new Date()
          }, function (err) {
            if (err) console.log(err);
            else addMessageCallback(inlineQuery.id, inlineQuery.from.username, command);
          });
        }
        else if (command && command.type === 'prize') {
          schifezzaService.addPrize({
            username: inlineQuery.from.username,
            description: command.description,
            value: command.value,
            date: new Date()
          }, function (err) {
            if (err) console.log(err);
            else addMessageCallback(inlineQuery.id, inlineQuery.from.username, command);
          });
        }
        else {
          answerInlineQuery(inlineQuery.id);
        }
      }
      else {
        answerInlineQuery(inlineQuery.id);
      }
    })
  }
}


function answerInlineQuery(messageId) {
  schifezzaService.getRecap('JoPhj', function (jopRecap) {
    schifezzaService.getRecap('naashira', function (silviaRecap) {
      schifezzaService.getLastMessage(function (lastMessage) {
        bot.answerInlineQuery(messageId,
          [
            generateRecapResult('Jop', jopRecap, silviaRecap),
            generateRecapResult('Silvia', silviaRecap, jopRecap),
            generateLastSchifezzaResult(lastMessage)
          ]).then(function (data) {
          }).catch(function (err) {
            console.log(err);
          });
      })
    });
  });
}

function addMessageCallback(messageId, username, command) {
  console.log('Added message from', username, ':', command.description, '|', command.value, '€');
  answerInlineQuery(messageId);
}

function generateLastSchifezzaResult(lastMessage) {
  var usernameMap = {
    'JoPhj': 'Jop',
    'naashira': 'Silvia',
  };

  return {
    type: 'article',
    id: Math.random().toString(),
    title: 'Ultimo evento',
    description: usernameMap[lastMessage.username] + ' - ' +
    lastMessage.description + ' - ' + lastMessage.value + ' €',
    input_message_content: {
      message_text: usernameMap[lastMessage.username] + ' - ' +
      lastMessage.description + ' - ' + lastMessage.value + ' €',
    }
    ,
    cache_time: 1
  }
}

function generateRecapResult(username, recapData, recapData2) {
  var userData = {
    'Jop': {
      otherUsername: 'Silvia',
      thumbUrl: 'http://i.imgur.com/h3Y6fKat.jpg'
    },
    'Silvia': {
      otherUsername: 'Jop',
      thumbUrl: 'http://i.imgur.com/SUhW378t.jpg'
    }
  };

  return {
    type: 'article',
    id: Math.random().toString(),
    title: username,
    description: getRecapString(recapData),
    thumb_url: userData[username].thumbUrl,
    input_message_content: {
      message_text:
      username + ' - ' + getRecapString(recapData) + '\n' +
      userData[username].otherUsername + ' - ' + getRecapString(recapData2)
    },
    cache_time: 1
  }
}


function getRecapString(recapData) {
  if (!recapData) return "Invalid data";
  return "Rimanenti: " + ((recapData.totalSchifezze - recapData.totalPrize) || 0) +
    " €; Mese: " + (recapData.lastMonthTotalSchifezze || 0) +
    " €; Totale: " + (recapData.totalSchifezze || 0) + ' €';
}

module.exports = SchifezzaBotModule;
