import express from 'express';
import auth from '../middleware/auth.js';
import { createLead, deleteLead, getLeadById, getLeads, getMyLeads, updateLead } from '../controllers/leadController.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const leadRouter = express.Router();

leadRouter.post('/create',auth,roleMiddleware("Admin"), createLead)
leadRouter.get('/get',auth, roleMiddleware("Admin"), getLeads)
leadRouter.get('/get/:id',auth, getLeadById)
leadRouter.put('/update/:id',auth, updateLead)
leadRouter.delete('/delete/:id',auth, roleMiddleware("Admin"), deleteLead)
leadRouter.get('/my-leads', auth, getMyLeads);


export default leadRouter;