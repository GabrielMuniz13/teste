// routes/homeRoutes.js
import express from 'express';
import { getBots, getBot, setBot, updateBot, updateBotImg, deleteBot, startBot, killBot} from '../controllers/adminControlers/botController.js';
import { setUser, getUser, getUsers, updateUser, deleteUser } from '../controllers/adminControlers/userController.js';
import { adminAuth } from '../middlewares/auth.js';
import { upload } from '../services/multerConfigs.js';


const router = express.Router();
router.use(adminAuth)
router.post('/bot',upload.array('file', 2), setBot); 
router.get('/bots', getBots);
router.get('/bot/:id', getBot);
router.put('/bot/:id', updateBot);
router.put('/bot/image/:image/:id', upload.array('file', 1), updateBotImg);
router.delete('/bot/:id', deleteBot);

router.get('/bot/start/:id', startBot);
router.get('/bot/kill/:id', killBot);

router.post('/usuario', setUser);
router.get('/usuario/:id', getUser);
router.get('/usuarios', getUsers);
router.put('/usuario/:id', updateUser);
router.delete('/usuario/:id', deleteUser);


// router.get('/upload',upload.single('file'), (req, res) => {
//     console.log(req.body)
//     return res.json(req.file.filename)
// });
// router.get('/start-alll', (req, res) => {
//     res.send('inicializa todos os bots');
// });

// router.post('/bot-stop', (req, res) => {
//     res.send('stop 1 bot id');
// });

// router.get('/user', (req, res) => {
//     res.send('usarios');
// });
// router.post('/user', (req, res) => {
//     res.send('cadastra usuario');
// });
// router.get('/user/:id', (req, res) => {
//     res.send('retorna um usuario');
// });
// router.get('/user/delete/:id', (req, res) => {
//     //deletar usuario deletara todos os seus bots.
//     res.send('deleta usuario');
// });



export default router;
