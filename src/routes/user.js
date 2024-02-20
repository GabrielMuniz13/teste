// routes/userRoutes.js
import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { upload } from '../services/multerConfigs.js';
import { getBots, updateBot,updateBotImg, startBot, killBot } from '../controllers/userControlers/botController.js';

const router = express.Router();
router.use(userAuth);

router.get('/bots', getBots);
router.put('/bot/:id', updateBot);
router.put('/bot/image/:image/:id',upload.array('file', 1), updateBotImg);
router.get('/bot/start/:id', startBot);
router.get('/bot/kill/:id', killBot);

export default router;