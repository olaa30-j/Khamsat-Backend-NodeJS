import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import router from './router/router.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server as SocketIO } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new SocketIO(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (username) => {
    if (username) {
      console.log(`User ${username} registered with socket ${socket.id}`);
      connectedUsers.set(username, socket.id);
      socket.join(username); 
    }
  });

  socket.on('newServiceAdded', ({ message }) => {
    io.to('admin').emit('notification', { 
      message: `خدمة جديدة: ${message}`
    });
    console.log('New service notification sent to admin');
  });

  socket.on('serviceStatusUpdated', (data) => {
    const { userId, message } = data;
    if (userId && connectedUsers.has(userId)) {
      io.to(userId).emit('notification', data);
      console.log(`Sending acceptance notification to ${userId}`,data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [username, id] of connectedUsers.entries()) {
      if (id === socket.id) {
        connectedUsers.delete(username);
        console.log(`User ${username} removed from connected users`);
        break;
      }
    }
  });
});

app.set('io', io);
app.set('connectedUsers', connectedUsers);

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

export const sendNotification = (username, message) => {
  if (username && connectedUsers.has(username)) {
    io.to(username).emit('notification', { message });
    return true;
  }
  return false;
};

export default app;
