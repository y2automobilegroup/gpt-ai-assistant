// utils/reply.js
import fetch from 'node-fetch';

const LINE_API_URL = 'https://api.line.me/v2/bot/message/reply';
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

export async function replyToLine(replyToken, text) {
  const body = {
    replyToken,
    messages: [{ type: 'text', text }],
  };

  const res = await fetch(LINE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[LINE 回覆失敗]', errText);
  }
}
