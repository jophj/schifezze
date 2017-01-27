const Promise = require("bluebird");
const Event = require('../models/event');
const { getUsersWithEvents } = require('../repositories/user');

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

function summarizeEvents(result) {
  const recaps = result.map((r) => {
    const summary = r.events.reduce((sum, e) => {
      let toAddTotal = 0;
      let toAddTotalPrize = 0;
      let toAddTotalMeme = 0;

      switch (e.type) {
        case 'schifezza':
          toAddTotal += e.value;
          break;
        case 'premio':
          toAddTotalPrize += e.value;
          break;
        case 'meme':
          toAddTotalMeme += e.value;
      }

      sum.total += toAddTotal - toAddTotalMeme - toAddTotalPrize;
      sum.totalPrize += toAddTotalPrize;
      sum.totalMeme += toAddTotalMeme;

      return sum;

    }, { total: 0, totalPrize: 0, totalMeme: 0 });

    return {
      user: r._id.user,
      total: summary.total,
      totalPrize: summary.totalPrize,
      totalMeme: summary.totalMeme,
    }
  });
  return recaps;
}

function getHelpResult() {
  const helpResult = {
    id: 'help_message_002',
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

function getRecapResults() {
  const promise = new Promise((resolve) => {
    getUsersWithEvents().then((results) => {
      const recaps = summarizeEvents(results);
      const recapResult = recaps.map((s) => {
        return {
          id: `${Math.random() * 65536}`,
          title: `Recap ${s.user}`,
          description: `Totale: ${s.total} €; Premi riscattati: ${s.totalPrize} €; Giorni meme: ${s.totalMeme} €`,
          type: 'article',
          input_message_content: {
            message_text: `Recap ${s.user}\r\nTotale: ${s.total} €; Premi riscattati: ${s.totalPrize} €; Giorni meme: ${s.totalMeme} €`,
          }
        }
      });
      resolve(recapResult);
    });
  });

  return promise;
}

function getLastEventResult() {
  const promise = new Promise((resolve) => {
    Event.findOne().sort({ date: -1 }).limit(1).exec().then((result) => {
      if (!result) {
        resolve(null);
        return;
      }

      result.money = result.value;
      result.name = result.type;
      const resultDescription = getConfirmationResultDescription(result);
      const formattedDate = `${result.date.getDate()}/${result.date.getMonth() + 1}/${result.date.getYear()}`;
      const lasteventResult = {
        id: `${Math.random() * 65536}`,
        title: `Ultimo evento: ${resultDescription}`,
        description: `${result.user} il ${formattedDate}`,
        type: 'article',
          input_message_content: {
            message_text: `Ultimo evento: ${resultDescription}\r\n${result.user} il ${formattedDate}`,
          }
      }
      resolve(lasteventResult);
    });
  });

  return promise;
}

module.exports = {
  getHelpResult,
  getConfirmationResult,
  getRecapResults,
  getLastEventResult
}