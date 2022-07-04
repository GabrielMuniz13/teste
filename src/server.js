import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, "..", "public")));
const serverHttp = http.createServer(app);


const io = new Server(serverHttp);

export { serverHttp, io, app};