// File: socket/socket.js

let io;

export const initSocket = (socketIo) => {
  io = socketIo;

  // Set up connection handling
  io.on("connection", (socket) => {
    console.log("A client connected", socket.id);

    // Event listeners
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected", socket.id);
    });
  });

  return io;
};

// Function to emit messages to rooms
export const emitMessage = ({ roomId, type, payload }) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return { status: false, error: "Socket not initialized" };
  }
  console.log({ roomId, type, payload });
  try {
    io.to(roomId).emit(type, payload);
    return { status: true };
  } catch (error) {
    console.error("Error emitting message:", error);
    return { status: false, error: error.message };
  }
};

export const getIO = () => {
  if (!io) {
    console.error("Socket.io not initialized");
    return null;
  }
  return io;
};
