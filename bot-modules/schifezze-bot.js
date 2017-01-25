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
        const results = [
          {
            id: `${Math.random() * 2048}`,
            title: 'Result title ' + Math.random() * 2048,
            type: 'article',
            input_message_content: {
              message_text: `stocazzo`,
              parse_mode: 'Markdown'
            }
          }
        ]

        return ctx.answerInlineQuery(results);
      }
    });

    this.bot.on('chosen_inline_result', (ctx) => {
      console.log(ctx);
    });
  }
}

module.exports = SchifezzaBotModule;
