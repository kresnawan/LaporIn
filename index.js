import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import router from './router.js';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);

app.use(cors({ credentials: true, origin: ['http://localhost:5173'] }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', router);

server.listen(port, () =>{
    console.log("App running on port " + port);
});