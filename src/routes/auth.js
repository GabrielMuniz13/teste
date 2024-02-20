// routes/userRoutes.js
import express from 'express';
import { authenticate } from '../controllers/authControler.js';

const router = express.Router();

router.post('/', authenticate);

export default router;
