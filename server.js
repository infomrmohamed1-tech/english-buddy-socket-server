const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('🟢 مستخدم متصل:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 المستخدم ${userId} انضم إلى الغرفة`);
  });

  socket.on('call-user', ({ targetId, offer }) => {
    io.to(targetId).emit('incoming-call', { from: socket.id, offer });
  });

  socket.on('answer-call', ({ to, answer }) => {
    io.to(to).emit('call-answered', { answer });
  });

  socket.on('disconnect', () => {
    console.log('🔴 مستخدم غادر:', socket.id);
  });
});

server.listen(3000, () => console.log('✅ Server running on port 3000'));
