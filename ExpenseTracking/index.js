const express = require("express");
const cors = require("cors");
const User = require("./Models/userModel.js");
const UserRoute = require("./Routes/route.js");
const connectDb = require("./config/db.js");
require("dotenv").config();

connectDb();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use("/api", UserRoute);
app.get("/", (req, res) => {
  res.send("hellon");
});
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("server is running");
});
