// app/index.js
import express from 'express';
import { handleEvents, printPrompts } from './handlers.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';

const app = express();

// 解析 JSON 並保留 raw body 用於簽名驗證
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

// 健康檢查或版本頁面（可自訂）
app.get('/', async (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({
    status: 'OK',
    currentVersion,
    latestVersion
  });
});

// LINE Webhook 接收端點
app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await storage.initialize(); // 可略過此行，若你沒使用 storage 模組
    await handleEvents(req.body.events);
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Webhook 處理錯誤:', err.message);
    res.sendStatus(500);
  }

  if (config.APP_DEBUG) {
    printPrompts();
  }
});

// 本地測試時可啟動伺服器，Vercel 不需要
if (config.APP_PORT) {
  app.listen(config.APP_PORT, () => {
    console.log(`🚀 本地伺服器啟動於 http://localhost:${config.APP_PORT}`);
  });
}

export default app;
