import { Server as SocketIO } from 'socket.io';
import http from 'http';

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new SocketIO(server, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    this.setupEventHandlers();
    return this.io;
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('register', (username) => {
        this.registerUser(username, socket);
      });

      socket.on('newServiceAdded', ({ message }) => {
        this.notifyAdmin(message);
      });

      socket.on('serviceStatusUpdated', (data) => {
        this.notifyUserOfStatusUpdate(data);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  registerUser(username, socket) {
    if (username) {
      console.log(`User ${username} registered with socket ${socket.id}`);
      this.connectedUsers.set(username, socket.id);
      socket.join(username);
    }
  }

  notifyAdmin(message) {
    this.io.to('admin').emit('notification', {
      message: `New service: ${message}`
    });
    console.log('New service notification sent to admin');
  }

  notifyUserOfStatusUpdate(data) {
    const { userId, message } = data;
    if (userId && this.connectedUsers.has(userId)) {
      this.io.to(userId).emit('notification', data);
      console.log(`Sending acceptance notification to ${userId}`, data);
    }
  }

  handleDisconnect(socket) {
    console.log('User disconnected:', socket.id);
    for (const [username, id] of this.connectedUsers.entries()) {
      if (id === socket.id) {
        this.connectedUsers.delete(username);
        console.log(`User ${username} removed from connected users`);
        break;
      }
    }
  }

  // Utility methods for sending notifications
  sendNotification(username, notification) {
    if (username && this.connectedUsers.has(username)) {
      this.io.to(username).emit('notification', notification);
      return true;
    }
    return false;
  }

  sendBulkNotification(usernames, notification) {
    usernames.forEach(username => {
      this.sendNotification(username, notification);
    });
  }

  // Service-specific notification methods
  notifyServiceCreation(serviceData) {
    return this.sendNotification('admin', {
      notification: {
        id: serviceData._id,
        message: `تم إنشاء خدمة جديدة: ${serviceData.title}`,
        status: 'pending',
        serviceLink: `/services/${serviceData._id}`,
        serviceTitle: serviceData.title
      }
    });
  }

  notifyServiceStatusChange(userId, serviceData, status) {
    return this.sendNotification(userId, {
      notification: {
        id: serviceData._id,
        message: `تم ${status === 'accepted' ? 'قبول' : 'رفض'} خدمتك: ${serviceData.title}`,
        status: status,
        serviceLink: `/services/${serviceData._id}`,
        serviceTitle: serviceData.title
      }
    });
  }

  notifyPaymentReceived(userId, serviceData, amount) {
    return this.sendNotification(userId, {
      notification: {
        id: serviceData._id,
        message: `تم استلام دفعة ${amount} جنيه لخدمة: ${serviceData.title}`,
        status: 'accepted',
        serviceLink: `/services/${serviceData._id}`,
        serviceTitle: serviceData.title
      }
    });
  }

  isUserConnected(username) {
    return this.connectedUsers.has(username);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

export const socketService = new SocketService();
export default socketService;