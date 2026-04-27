import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:5174"], // ✅ add 5174
//     methods: ["GET", "POST"],
//   },
// });


const io = new Server(httpServer, {
  cors: {
    origin:true,
    // origin: [
    //   "http://localhost:5173",
    //   "http://localhost:5174",
    //   "https://mini-project-black-one.vercel.app",
    //     "https://mini-project-j3qaop2u1-rahul-yadav18s-projects.vercel.app"
    // ],
    methods: ["GET", "POST"]
  },
});






connectDB();
connectCloudinary();

// middlewares
app.use(express.json());

// app.use(cors());
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174"]
// }));


app.use(cors({
  origin:true,
  // origin: [
  //   "http://localhost:5173",
  //   "http://localhost:5174",
  //   "https://mini-project-black-one.vercel.app",
  //   //added after that
  //   "https://mini-project-j3qaop2u1-rahul-yadav18s-projects.vercel.app"
  // ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));








// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Socket.io signaling for WebRTC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room based on appointmentId
  socket.on("join-room", (appointmentId, userId) => {
    socket.join(appointmentId);
    console.log(`${userId} joined room ${appointmentId}`);
    // Notify others in the room
    socket.to(appointmentId).emit("user-joined", userId, socket.id);
  });

  // WebRTC signaling
  socket.on("offer", (offer, appointmentId) => {
    socket.to(appointmentId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, appointmentId) => {
    socket.to(appointmentId).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, appointmentId) => {
    socket.to(appointmentId).emit("ice-candidate", candidate);
  });

  // Chat message
  socket.on("chat-message", (message, appointmentId, senderName) => {
    io.to(appointmentId).emit("chat-message", message, senderName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.emit("user-left", socket.id);
  });
});

httpServer.listen(port, () => console.log("Server started", port));