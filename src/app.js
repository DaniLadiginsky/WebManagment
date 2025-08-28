const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { authApiKey } = require('./middleware/auth');
const errorHandler = require('./middleware/error');

const itemsRoutes = require('./routes/items.routes');
const categoriesRoutes = require('./routes/categories.routes');

function createApp() {
  const app = express();

  // Core middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  // Public health-check
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // Protected API (requires x-api-key)
  app.use(authApiKey);
  app.use(itemsRoutes);
  app.use(categoriesRoutes);

  // 404
  app.use((_req, res) => {
    res.status(404).json({ success: false, code: 404, error: 'Not found' });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
