const path = require('path');
const fs = require('fs');

function findServerBundle() {
  const dir = path.join(__dirname, '..', 'dist', 'server');
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => /\.m?js$/.test(f) || f.endsWith('.cjs'));
  if (!files.length) return null;
  const prefer = files.find(f => f === 'server.js') || files.find(f => f.startsWith('server-')) || files[0];
  return prefer ? path.join(dir, prefer) : null;
}

const bundlePath = findServerBundle();
if (!bundlePath) {
  module.exports = (req, res) => {
    console.error('SSR bundle not found in dist/server');
    res.statusCode = 500;
    res.end('SSR bundle not found. Run build and ensure dist/server exists.');
  };
} else {
  let handlerPromise = (async () => {
    try {
      const server = require(bundlePath);
      return server?.default || server?.handler || server;
    } catch (requireErr) {
      try {
        const url = require('url').pathToFileURL(bundlePath).href;
        const imported = await import(url);
        return imported?.default || imported?.handler || imported;
      } catch (importErr) {
        console.error('Failed to load SSR bundle via require and import:', requireErr, importErr);
        return null;
      }
    }
  })();

  module.exports = async (req, res) => {
    const handler = await handlerPromise;
    if (!handler) {
      res.statusCode = 500;
      return res.end('Failed to load SSR bundle (see server logs).');
    }
    try {
      return handler(req, res);
    } catch (err) {
      console.error('SSR handler error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  };
}