const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const authRoutes = require('./authRoutes');
const waterRoutes = require('./waterRoutes');
const workoutRoutes = require('./workoutRoutes');
const sleepRoutes = require('./sleepRoutes');
const medicineRoutes = require('./medicineRoutes');
const sosRoutes = require('./sosRoutes');
const healthRoutes = require('./healthRoutes');

// Public Router (Unprotected Endpoints)
const publicRouter = express.Router();
publicRouter.post('/auth/register', require('../controllers/authController').register);
publicRouter.post('/auth/login', require('../controllers/authController').login);

// Private Router (Auth Token Required Endpoints)
const privateRouter = express.Router();
privateRouter.use(protect);

privateRouter.get('/auth/me', require('../controllers/authController').getMe);
privateRouter.use('/water', waterRoutes);
privateRouter.use('/workout', workoutRoutes);
privateRouter.use('/sleep', sleepRoutes);
privateRouter.use('/medicine', medicineRoutes);
privateRouter.use('/sos', sosRoutes);
privateRouter.use('/health', healthRoutes);

// Mount Public & Private Routers
router.use('/', publicRouter);
router.use('/', privateRouter);

module.exports = router;
