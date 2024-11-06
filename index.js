import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import router from './router/router.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import socketService from './services/socketService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket service
export const io = socketService.initialize(server);

app.set('io', io);
app.set('socketService', socketService);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static('public'));

app.use(router);

connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;