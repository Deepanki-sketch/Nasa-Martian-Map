const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PORT = 8089;
const ROOT = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
  }
});

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  
  // Launch Chrome with remote debugging
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1440,900',
    `http://localhost:${PORT}/index.html`
  ]);

  // Give Chrome time to load and start debugging port
  await new Promise(r => setTimeout(r, 2500));

  // Connect via CDP using http fetch to find websocket debugger URL
  try {
    const targetsRes = await fetch('http://127.0.0.1:9222/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    console.log('Target page found:', pageTarget.url);

    const WebSocket = require('ws');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        const handler = (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.id === curId) {
            ws.off('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise(resolve => ws.on('open', resolve));

    // Enable Page and Runtime
    await send('Page.enable');
    await send('Runtime.enable');

    // Wait 2 seconds for Leaflet and textures to render
    await new Promise(r => setTimeout(r, 2000));

    // 1. Take desktop screenshot
    let snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot_1440.png', Buffer.from(snap.data, 'base64'));
    console.log('Captured screenshot_1440.png');

    // 2. Open Street View
    await send('Runtime.evaluate', {
      expression: `document.getElementById('btn-streetview-toggle').click();`
    });
    // Wait 1.5 seconds for Three.js texture to load
    await new Promise(r => setTimeout(r, 2000));

    // Take Street View screenshot
    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot_streetview.png', Buffer.from(snap.data, 'base64'));
    console.log('Captured screenshot_streetview.png');

    // Close Street View
    await send('Runtime.evaluate', {
      expression: `document.getElementById('btn-exit-streetview').click();`
    });

    // 3. Switch to mobile viewport (390 x 844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));

    snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot_390.png', Buffer.from(snap.data, 'base64'));
    console.log('Captured screenshot_390.png');

    ws.close();
    chrome.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('CDP Error:', err);
    chrome.kill();
    server.close();
    process.exit(1);
  }
});
