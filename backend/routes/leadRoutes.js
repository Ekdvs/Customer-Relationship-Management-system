import express from 'express';
import auth from '../middleware/auth.js';
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from '../controllers/leadController.js';

const leadRouter = express.Router();

leadRouter.post('/create',auth, createLead)
leadRouter.get('/get',auth, getLeads)
leadRouter.get('/get/:id',auth, getLeadById)
leadRouter.put('/update/:id',auth, updateLead)
leadRouter.delete('/delete/:id',auth,deleteLead)


export default leadRouter;