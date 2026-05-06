import express from 'express';
import auth from '../middleware/auth.js';
import { getNotesByLeadId } from '../controllers/noteController.js';

const noteRouter = express.Router();

noteRouter.post('/create',auth,createNote )
noteRouter.get('/lead/:leadId',auth,getNotesByLeadId)

export default noteRouter;