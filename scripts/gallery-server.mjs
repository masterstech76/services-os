import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3333;
const PRESENTATION_DIR = path.resolve(process.cwd(), 'presentation');
const DESKTOP_DIR = path.join(PRESENTATION_DIR, 'desktop');
const MOBILE_DIR = path.join(PRESENTATION_DIR, 'mobile');

// Get list of all routes from filenames
const files = fs.readdirSync(DESKTOP_DIR).filter(f => f.endsWith('.png')).sort();

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // API to get routes list
  if (pathname === '/api/routes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(files.map(f => {
      const id = f.replace('.png', '');
      return {
        id,
        filename: f,
        desktopUrl: `http://localhost:${PORT}/desktop/${f}`,
        mobileUrl: `http://localhost:${PORT}/mobile/${f}`
      };
    })));
    return;
  }

  // Serve Desktop images
  if (pathname.startsWith('/desktop/')) {
    const filename = pathname.replace('/desktop/', '');
    const filePath = path.join(DESKTOP_DIR, filename);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve Mobile images
  if (pathname.startsWith('/mobile/')) {
    const filename = pathname.replace('/mobile/', '');
    const filePath = path.join(MOBILE_DIR, filename);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Serve standalone HTML app directly if requested
  if (pathname === '/' || pathname === '/index.html') {
    const htmlPath = path.resolve(process.cwd(), 'public', 'gallery.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(htmlPath).pipe(res);
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[Gallery Server] Running at http://localhost:${PORT}`);
  console.log(`[Gallery Server] Serving ${files.length} desktop and mobile pages.`);
});
