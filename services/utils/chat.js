// chat.js
const fetch = require('node-fetch');
const { Configuration, OpenAIApi } = require('openai');
const { queryPinecone } = require('./pinecone');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function chat(userInput) {
  try {
    // 1. 使用 OpenAI 建立 embedding 向量
    const embeddingRes = await openai.createEmbedding({
      model: 'text-embedding-3-small',
      input: userInput,
    });

    const vector = embeddingRes.data.data[0].embedding;

    // 2. 查詢 Pinecone 相關段落
    const contexts = await queryPinecone(vector);
    const context = contexts.join('\n\n');

    // 3. 組合 prompt
    const messages = [
      {
        role: 'system',
        content:
          '你是亞鈺汽車客服，請根據下列內部資料回答客戶問題。若與保固無關，請說「建議聯繫客服」',
      },
      {
        role: 'user',
        content: `以下為內部資料：\n${context}\n\n使用者問題：${userInput}`,
      },
    ];

    // 4. 呼叫 GPT 回覆
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('❌ chat() error:', error.message);
    return '❌ 發生錯誤，請稍後再試或聯絡客服';
  }
}

module.exports = { chat };
