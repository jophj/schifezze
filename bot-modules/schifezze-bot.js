const Promise = require('bluebird');
const BotModule = require('../bot-module');
const Event = require('../models/event');
const SchifezzaInlineQueryParser = require('../utils/schifezze-inline-query-parser');
const {
  getHelpResult,
  getConfirmationResult,
  getRecapResults,
  getLastEventResult } = require('../utils/result-generator');
const queryParser = new SchifezzaInlineQueryParser();

class SchifezzaBotModule extends BotModule {
  initModule() {
    this.bot.on('inline_query', (ctx) => {
      const inlineQuery = ctx.update.inline_query;
      const query = inlineQuery.query || '';
      const command = queryParser.parse(query);
      const results = [];
      if (command) {
        results.push(getConfirmationResult(command));
      }
      else {
        results.push(getHelpResult());
      }

      Promise.all([getRecapResults(), getLastEventResult()]).then(([recapResults, lastEventResult]) => {
        results.push(...recapResults);
        if (lastEventResult) {
          results.push(lastEventResult);
        }
        ctx.answerInlineQuery(results);
      });
    });

    this.bot.on('chosen_inline_result', (ctx) => {
      const user = ctx.update.chosen_inline_result.from.username;
      const command = queryParser.parse(ctx.update.chosen_inline_result.query);
      if (!command) return;
      const event = new Event({
        user,
        type: command.name,
        description: command.description,
        date: new Date(),
        value: command.money
      });
      event.save((err) => {
        if (err) console.log(err)
      });
    });
  }
}

module.exports = SchifezzaBotModule;
