const BotModule = require('../bot-module');
const SchifezzaInlineQueryParser = require('../utils/schifezze-inline-query-parser');
const queryParser = new SchifezzaInlineQueryParser();

const descriptionTypeStrategy = {
  'meme': 'Giorno meme.',
  'schifezza': 'Mangiate schifezze.',
  'premio': 'Riscattato un premio.'
}

const descriptionValueStrategy = {
  'meme': 'di riscatto rimosso/i.',
  'schifezza': 'di riscatto aggiunti.',
  'premio': 'riscattati.'
}

function getHelpResult() {
  const helpResult = {
    id: 'help_message_001',
    title: 'Inserire i dati nel formato seguente',
    description: '(schifezza|premio|meme) 1 € descrizione dell\'evento',
    type: 'article',
    input_message_content: {
      message_text: 'Ho gnammato una schifezza!',
    }
  }
  return helpResult;
}

function getConfirmationResultDescription(command) {
  let description = `${descriptionTypeStrategy[command.name]} `;
  description += `${command.money} € `;
  description += `${descriptionValueStrategy[command.name]}`;
  return description;
}

function getConfirmationResultText(command) {
  return `${getConfirmationResultDescription(command)}\r\n"${command.description}"`;
}

function getConfirmationResult(command) {
  const confirmationResult = {
    id: `${Math.random() * 65536}`,
    title: getConfirmationResultDescription(command),
    description: 'Seleziona questo risultato per confermare l\'azione.',
    type: 'article',
    input_message_content: {
      message_text: getConfirmationResultText(command),
    }
  }
  return confirmationResult;
}

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

      // TODO aggiungere risultati di riepilogo
      // TODO aggiungere ultimo evento
      return ctx.answerInlineQuery(results);
    });

    this.bot.on('chosen_inline_result', (ctx) => {
      console.log(ctx);
    });
  }
}

module.exports = SchifezzaBotModule;
