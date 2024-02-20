// routes/index.js
import express from 'express';
import admin from './admin.js';
import auth from './auth.js';
import user from './user.js';
const router = express.Router();

router.use('/authenticate', auth);
router.use('/admin', admin);
router.use('/user', user);
export default router;
