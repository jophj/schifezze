const BotModule = require('../bot-module');
const schifezzaService = require('../schifezzaService.js');

class SchifezzaBotModule extends BotModule {

  initModule() {
    this.bot.on('inline_query', (ctx) => {
      const inlineQuery = ctx.update.inline_query;
      const query = inlineQuery.query || '';
    });
  }
}

module.exports = SchifezzaBotModule;
