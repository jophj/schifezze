const Promise = require("bluebird");
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

function getRecapResults() {
  // per ogni utente
  // prendi tutti gli eventi
  // somma i valori e sottrai riscatti e meme
  // prendi gli eventi dell'ultimo mese
  // somma i valori e sottra riscatti e meme dell'ultimo mese

  const promise = new Promise((resolve) => {
    getUsersWithEvents().then((result) => resolve(result));
  });

  return promise;
}

getRecapResults().then((result) => {
  
});

module.exports = {
  getHelpResult,
  getConfirmationResult,
  getRecapResults
}