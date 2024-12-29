// const express = require("express")
// const connectDB = require("./config/database")
// const app = express()
// const cookieParser = require("cookie-parser")
// const cors = require("cors")

// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true,
// }))
// app.use(express.json())  // middleware provided by express which is activated(.use) for all cases (routes)
// app.use(cookieParser())  

// const authRouter = require("./routes/auth")
// const profileRouter = require("./routes/profile")
// const requestRouter = require("./routes/request")
// const userRouter = require("./routes/user")
// const adminRouter = require("./routes/admin")
// const paymentRouter = require("./routes/payment")


// app.use("/", authRouter)
// app.use("/", profileRouter)
// app.use("/", requestRouter)
// app.use("/", userRouter)
// app.use("/", adminRouter)
// app.use("/", paymentRouter)


// const Admin = require("./models/admin");

// const seedAdmin = async () => {
//   try {
//     const existingAdmin = await Admin.findOne();
//     if (!existingAdmin) {
//       const admin = new Admin();
//       await admin.save();
//       console.log("Default admin created");
//     } else {
//       console.log("Admin already exists");
//     }
//   } catch (error) {
//     console.error("Error seeding admin:", error);
//   }
// };

// seedAdmin();



// connectDB()
//     .then(()=> {
//         console.log("Database connection established")
//         app.listen((7777), ()=> {
//             console.log("Server is successfully running on port 7777")
//         })
//     })
//     .catch((err)=> {
//         console.log("Database cannot be connected")
//     })




// // order of the routes matter a lot



//code below ran perfectly till deployment 

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const connectDB = require("./config/database");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const Message = require("./models/message"); // Import the message model

// const app = express();
// const server = http.createServer(app); // Create an HTTP server for Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Adjust according to your frontend URL
//     credentials: true,
//   },
// });

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json()); // Parse JSON
// app.use(cookieParser());

// // Importing Routers
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
// const requestRouter = require("./routes/request");
// const userRouter = require("./routes/user");
// const adminRouter = require("./routes/admin");
// const paymentRouter = require("./routes/payment");
// const chatRouter = require("./routes/chat")

// // Register Routes
// app.use("/", authRouter);
// app.use("/", profileRouter);
// app.use("/", requestRouter);
// app.use("/", userRouter);
// app.use("/", adminRouter);
// app.use("/", paymentRouter);
// app.use("/", chatRouter)

// // Seed Default Admin
// const Admin = require("./models/admin");

// const seedAdmin = async () => {
//   try {
//     const existingAdmin = await Admin.findOne();
//     if (!existingAdmin) {
//       const admin = new Admin();
//       await admin.save();
//       console.log("Default admin created");
//     } else {
//       console.log("Admin already exists");
//     }
//   } catch (error) {
//     console.error("Error seeding admin:", error);
//   }
// };

// seedAdmin();

// // Database Connection
// connectDB()
//   .then(() => {
//     console.log("Database connection established");
//   })
//   .catch((err) => {
//     console.error("Database connection failed:", err);
//   });

// // Socket.IO Integration
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Join room for a specific user
//   socket.on("joinRoom", (userId) => {
//     socket.join(userId);
//     console.log(`User joined room: ${userId}`);
//   });

//   // Handle sending messages
//   socket.on("sendMessage", async (messageData) => {
//     const { senderId, recipientId, text } = messageData;

//     try {
//       // Save message to the database
//       const newMessage = new Message({ senderId, recipientId, text });
//       await newMessage.save();

//       // Emit message to the recipient
//       io.to(recipientId).emit("receiveMessage", {
//         senderId,
//         text,
//         timestamp: newMessage.timestamp,
//       });

//       console.log("Message sent:", messageData);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// // Start the Server
// server.listen(7777, () => {
//   console.log("Server is successfully running on port 7777");
// });




//  just copy pasting fro package.json to test deployment




const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Message = require("./models/message"); // Import the message model

const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust according to your frontend URL
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON
app.use(cookieParser());

// Importing Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat")

// Register Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", adminRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter)

// Seed Default Admin
const Admin = require("./models/admin");

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      const admin = new Admin();
      await admin.save();
      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

seedAdmin();

// Database Connection
connectDB()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Socket.IO Integration
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join room for a specific user
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (messageData) => {
    const { senderId, recipientId, text } = messageData;

    try {
      // Save message to the database
      const newMessage = new Message({ senderId, recipientId, text });
      await newMessage.save();

      // Emit message to the recipient
      io.to(recipientId).emit("receiveMessage", {
        senderId,
        text,
        timestamp: newMessage.timestamp,
      });

      console.log("Message sent:", messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the Server
const PORT = process.env.PORT || 7777;
server.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});


