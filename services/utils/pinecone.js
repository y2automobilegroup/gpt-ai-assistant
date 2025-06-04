// ✅ pinecone.js (ES Module 版)
import fetch from 'node-fetch';

const {
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  PINECONE_INDEX
} = process.env;

export async function queryPinecone(vector) {
  const url = `https://${PINECONE_INDEX}-${PINECONE_ENVIRONMENT}.svc.${PINECONE_ENVIRONMENT}.pinecone.io/query`;

  const body = {
    vector,
    topK: 5,
    includeMetadata: true
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': PINECONE_API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error('[Pinecone] 查詢失敗', await res.text());
    return [];
  }

  const data = await res.json();
  const matches = data.matches || [];
  const texts = matches.map((m) => m.metadata?.text).filter(Boolean);
  return texts;
}
