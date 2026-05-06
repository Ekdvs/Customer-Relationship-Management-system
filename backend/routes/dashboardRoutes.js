import express from 'express';
import auth from '../middleware/auth.js';

import { getDashboard } from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', auth,getDashboard);

export default dashboardRouter;