// app/handlers.js
import { chat } from '../services/utils/chat.js';
import { replyToLine } from '../utils/reply.js';

export async function handleEvents(events) {
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMessage = event.message.text;

      // 呼叫 chat() 從 Pinecone + GPT 查詢
      const replyMessage = await chat(userMessage);

      // 回傳訊息給用戶
      await replyToLine(event.replyToken, replyMessage);
    }
  }
}

export function printPrompts() {
  console.log('[Log] 處理完成，可以加入自定義 debug log');
}
