function InlineQueryParser(message){
  var CONFIRMATION_TOKEN = 'ciccione confirmed';
  var PRIZE_TOKEN = 'premio';

  var schifezzaRegex = new RegExp('^(\\d+(?:[.,]\\d)?)\\s*€?\\s(.+)\\s+('+CONFIRMATION_TOKEN+')$', 'i');
  var prizeRegex = new RegExp('^premio\\s(\\d+(?:[.,]\\d)?)\\s*€?\\s(.+)\\s+('+CONFIRMATION_TOKEN+')$', 'i');

  var query = message.query || '';

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

module.exports = InlineQueryParser;