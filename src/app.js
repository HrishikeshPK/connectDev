const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())  // middleware provided by express which is activated(.use) for all cases (routes)
app.use(cookieParser())  

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const adminRouter = require("./routes/admin")


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", adminRouter)


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



connectDB()
    .then(()=> {
        console.log("Database connection established")
        app.listen((7777), ()=> {
            console.log("Server is successfully running on port 7777")
        })
    })
    .catch((err)=> {
        console.log("Database cannot be connected")
    })




// order of the routes matter a lot