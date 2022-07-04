
import { serverHttp, app, io } from "./server.js";

import './websocket.js'

serverHttp.listen(3000, () => console.log('Server is runing'));