import handleEvents from './app.js';
import { printHistories } from './history/index.js';
import {
  getPrompt, printPrompts, removePrompt, setPrompt,
} from './prompt/index.js';

export {
  handleEvents,
  printHistories,
  getPrompt,
  printPrompts,
  removePrompt,
  setPrompt,
};
const { chat } = require('../services/utils/chat');

// LINE 訊息處理
if (event.message.type === 'text') {
  const answer = await chat(event.message.text);
  await client.replyMessage(event.replyToken, {
    type: 'text',
    text: answer,
  });
}
