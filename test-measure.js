import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`
    <html>
      <head>
        <style>
          .card__content {
            font-size: 20px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .markdown-body p {
            margin-top: 0;
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <div id="measure" class="card__content markdown-body" style="width: 334px; position: absolute;">
          <p>这个消息有权威媒体报道，但属于“记者/媒体预测/爆料”，并非意大利足协或政府已正式官宣的既定政策。</p>
          <p>一、消息来源与核心内容</p>
        </div>
      </body>
    </html>
  `);
  
  const height = await page.evaluate(() => document.getElementById('measureimport puppeteer from "'puppeteer'"