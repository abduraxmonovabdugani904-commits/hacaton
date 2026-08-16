const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const os = require('os');
const sequelize = require('./config/db');
const routes = require('./routes');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', routes);

// Swagger documentation
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Redirect root to Swagger UI automatically
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

// Database Sync & Server Start
sequelize.sync({ alter: true })
  .then(() => {
    const localIp = getLocalIp();
    console.log('✅ Database connected and synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📖 Local Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`🌐 Network Swagger UI (boshqalarga tashlash uchun): http://${localIp}:${PORT}/api-docs`);
    });

    setInterval(() => {}, 60000);
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
