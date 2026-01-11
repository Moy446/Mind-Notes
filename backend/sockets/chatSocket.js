const User = require('../../models/User');
const Message = require('../../models/Message');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.on()