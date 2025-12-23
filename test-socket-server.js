// Test Socket.IO server to simulate the backend
// Run with: node test-socket-server.js
// Then update your .env to NEXT_PUBLIC_BASE_API=http://localhost:4000

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
  },
});

console.log("🚀 Test Socket.IO server starting...");

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Handle join-job event (like your backend)
  socket.on("join-job", async (jobId) => {
    console.log(`📋 Client joined job room: ${jobId}`);
    socket.join(jobId);

    // Simulate job:sync - send initial job state
    setTimeout(() => {
      console.log(`📤 Sending job:sync for ${jobId}`);
      io.to(jobId).emit("job:sync", {
        mongoJobId: jobId,
        jobId: jobId,
        status: "processing",
        progress: 0,
      });
    }, 500);

    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 25;
      if (progress <= 75) {
        console.log(`📤 Sending job:progress ${progress}% for ${jobId}`);
        io.to(jobId).emit("job:progress", {
          mongoJobId: jobId,
          jobId: jobId,
          queue: "test-queue",
          progress: progress,
        });
      }
    }, 1000);

    // Simulate job completion after 5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      console.log(`✅ Sending job:completed for ${jobId}`);
      io.to(jobId).emit("job:completed", {
        mongoJobId: jobId,
        jobId: jobId,
        queue: "test-queue",
        result: {
          success: true,
          message: "Test job completed successfully!",
          data: { items: ["item1", "item2", "item3"] },
        },
      });
    }, 5000);
  });

  // Handle leave-job event
  socket.on("leave-job", (jobId) => {
    console.log(`👋 Client left job room: ${jobId}`);
    socket.leave(jobId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🔌 Test Socket.IO Server Running                      ║
║                                                        ║
║  URL: http://localhost:${PORT}                           ║
║                                                        ║
║  To test:                                              ║
║  1. Set NEXT_PUBLIC_BASE_API=http://localhost:${PORT}    ║
║     in your .env file                                  ║
║  2. Restart your Next.js dev server                    ║
║  3. Try generating stages/flashcards/etc              ║
║  4. Watch this console for events                      ║
║                                                        ║
║  Press Ctrl+C to stop                                  ║
╚════════════════════════════════════════════════════════╝
  `);
});
