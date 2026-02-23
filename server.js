const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5000;
const OUT_DIR = path.join(__dirname, 'out');

// Spec redirects: nav uses these URLs; redirect to actual app routes
const redirects = {
  '/soulbis': '/ceremony',
  '/plural': '/plurality',
  '/promise': '/promises',
  '/spellbook': '/spells',
};

// Route mappings for Next.js static export (all app routes)
const routeMap = {
  '/': '/index.html',
  '/story': '/story.html',
  '/zero': '/zero.html',
  '/mage': '/mage.html',
  '/proverbs': '/proverbs.html',
  '/the-first': '/the-first.html',
  '/story/stats': '/story/stats.html',
  '/canon': '/canon.html',
  '/ceremony': '/ceremony.html',
  '/evoke': '/evoke.html',
  '/plurality': '/plurality.html',
  '/privacy': '/privacy.html',
  '/promises': '/promises.html',
  '/skills': '/skills.html',
  '/society': '/society.html',
  '/spells': '/spells.html',
  '/web': '/web.html',
};

const server = http.createServer((req, res) => {
  let filePath = req.url.split('?')[0]; // Remove query string
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

  // Next.js 16 RSC payload: client requests dot-separated path (e.g. /promises/__next.promises.__PAGE__.txt)
  // but static export writes nested path (promises/__next.promises/__PAGE__.txt). Rewrite so we serve the file.
  if (filePath.includes('__next.') && filePath.includes('.__PAGE__.txt')) {
    filePath = filePath.replace(/\/__next\.([^.]+)\.__PAGE__\.txt$/i, '/__next.$1/__PAGE__.txt');
  }

  // Spec redirects (nav and hero use these URLs)
  if (redirects[filePath]) {
    res.writeHead(302, { Location: redirects[filePath] + query });
    res.end();
    return;
  }

  // Handle route mappings
  if (routeMap[filePath]) {
    filePath = routeMap[filePath];
  }
  
  // If no extension, try adding .html
  if (!path.extname(filePath) && filePath !== '/') {
    const htmlPath = (filePath.startsWith('/') ? filePath.slice(1) : filePath) + '.html';
    if (fs.existsSync(path.join(OUT_DIR, htmlPath))) {
      filePath = '/' + htmlPath;
    }
  }
  
  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Normalize: path.join(OUT_DIR, '/x') can drop OUT_DIR on some platforms
  const filePathNorm = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(OUT_DIR, filePathNorm);

  function sendFile(filePathToSend) {
    const normalized = filePathToSend.startsWith('/') ? filePathToSend.slice(1) : filePathToSend;
    const full = path.join(OUT_DIR, normalized);
    const ext = path.extname(filePathToSend).toLowerCase();
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.mp4': 'video/mp4',
      '.md': 'text/markdown',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';
    fs.readFile(full, (err, data) => {
      if (err) {
        if (err.code === 'EISDIR') {
          sendFile(filePathToSend.replace(/\/?$/, '/index.html'));
          return;
        }
        const notFoundPath = path.join(OUT_DIR, '404.html');
        fs.readFile(notFoundPath, (_, data404) => {
          if (data404) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data404);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          }
        });
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }

  fs.stat(fullPath, (err, stat) => {
    if (err) {
      const notFoundPath = path.join(OUT_DIR, '404.html');
      fs.readFile(notFoundPath, (_, data404) => {
        if (data404) {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(data404);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      });
      return;
    }
    if (stat.isDirectory()) {
      sendFile(filePath.replace(/\/?$/, '/index.html'));
      return;
    }
    sendFile(filePath);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${OUT_DIR}`);
});




