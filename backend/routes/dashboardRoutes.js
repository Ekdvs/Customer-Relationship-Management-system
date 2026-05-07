import express from 'express';
import auth from '../middleware/auth.js';

import { getDashboard, getSalesPerformance } from '../controllers/dashboardController.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/', auth,getDashboard);
dashboardRouter.get('/sales-performance', auth, roleMiddleware('Admin'), getSalesPerformance); 

export default dashboardRouter;