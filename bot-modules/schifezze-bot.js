const BotModule = require('../bot-module');
const SchifezzaInlineQueryParser = require('../utils/schifezze-inline-query-parser');
const queryParser = new SchifezzaInlineQueryParser();

class SchifezzaBotModule extends BotModule {

  initModule() {
    this.bot.on('inline_query', (ctx) => {
      const inlineQuery = ctx.update.inline_query;
      const query = inlineQuery.query || '';
      const command = queryParser.parse(query);
      if (command) {
        
      }
    });
  }
}

module.exports = SchifezzaBotModule;
