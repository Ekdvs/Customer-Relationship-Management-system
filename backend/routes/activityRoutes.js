import express from 'express';
import auth from '../middleware/auth.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import { getActivityByLeadId, getAllActivities } from '../controllers/activityController.js';

const activityRouter = express.Router();

activityRouter.get('/',auth ,roleMiddleware('Admin'),getAllActivities); 
activityRouter.get('/lead/:leadId',auth ,roleMiddleware('Admin'),getActivityByLeadId);


export default activityRouter;