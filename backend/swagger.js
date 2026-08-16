const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sogʻliq va Tibbiyot Ilovasi API',
      version: '1.0.0',
      description: 'Sogʻliqni saqlash, sport va dorilar monitoringi ilovasi uchun mahalliy (local) REST API hujjatlari',
    },
    servers: [
      {
        url: '/api',
        description: 'Mahalliy Nisbiy Server (Relative Local Server)',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Localhost Server',
      },
      {
        url: 'http://127.0.0.1:5000/api',
        description: '127.0.0.1 Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Tizimga kirgandan soʻng olingan JWT tokenni "Bearer <token>" koʻrinishida kiriting',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', example: 'ali_valiyev' },
            email: { type: 'string', format: 'email', example: 'ali@example.com' },
            password: { type: 'string', format: 'password', example: 'parol12345' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'ali@example.com' },
            password: { type: 'string', format: 'password', example: 'parol12345' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string' },
            token: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            username: { type: 'string' },
            email: { type: 'string' },
            health_score: { type: 'integer', example: 85 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WaterInput: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: { type: 'integer', example: 250, description: 'Suv miqdori (ml)' },
          },
        },
        Water: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            amount: { type: 'integer', example: 250 },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        WorkoutInput: {
          type: 'object',
          required: ['type', 'duration'],
          properties: {
            type: { type: 'string', example: 'Yugurish' },
            duration: { type: 'integer', example: 30, description: 'Davomiyligi (daqiqa)' },
            calories: { type: 'integer', example: 250 },
          },
        },
        Workout: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            type: { type: 'string' },
            duration: { type: 'integer' },
            calories: { type: 'integer' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        SleepInput: {
          type: 'object',
          required: ['duration'],
          properties: {
            duration: { type: 'number', format: 'float', example: 7.5, description: 'Uyqu davomiyligi (soat)' },
            quality: { type: 'string', enum: ['poor', 'fair', 'good', 'excellent'], example: 'good' },
          },
        },
        Sleep: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            duration: { type: 'number' },
            quality: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        MedicineInput: {
          type: 'object',
          required: ['name', 'dose', 'time'],
          properties: {
            name: { type: 'string', example: 'Paracetamol' },
            dose: { type: 'string', example: '500mg' },
            time: { type: 'string', example: '08:00:00' },
          },
        },
        Medicine: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            dose: { type: 'string' },
            time: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'taken', 'skipped'], example: 'pending' },
          },
        },
        MedicineStatusInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pending', 'taken', 'skipped'], example: 'taken' },
          },
        },
        SOSContactInput: {
          type: 'object',
          required: ['contactName', 'contactPhone'],
          properties: {
            contactName: { type: 'string', example: 'Shoshilinch aloqa' },
            contactPhone: { type: 'string', example: '+998901234567' },
            message: { type: 'string', example: 'Menga yordam kerak!' },
          },
        },
        SOSContact: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            contactName: { type: 'string' },
            contactPhone: { type: 'string' },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Xatolik matni' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js'), './routes/*.js'],
};

const specs = swaggerJsdoc(options);

// Save local swagger.json file
try {
  fs.writeFileSync(path.join(__dirname, 'swagger.json'), JSON.stringify(specs, null, 2), 'utf8');
} catch (e) {
  console.error('Could not save local swagger.json file:', e.message);
}

module.exports = specs;
