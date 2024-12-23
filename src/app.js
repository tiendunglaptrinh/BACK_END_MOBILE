import express from "express";
import "dotenv/config";
import morgan from "morgan";
import sequelize from "./config/db.js";
import User from "./models/userModel.js";
import Post from "./models/postModel.js";
import route from "./routes/index.js";
import session from "express-session";

const port = process.env.PORT;
const app = express();

// app session
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: {   
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }}));

// HTTP LoggerConfig
app.use(morgan("combined"));

app.use(express.json());

// Connect DatabaseError
(async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL database successfully.");
    // Sync
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
// Route
route(app);
//
app.get("/", (req, res) => {
  res.send("App start");
});

// Server listen
app.listen(port, (req, res) => {
  console.log(`App listening on localhost:${port}`);
});
