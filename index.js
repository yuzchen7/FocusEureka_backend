const express = require('express');
const app = express();
const cors = require("cors");
const db = require("./db");
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
// app.use("/api", require("./api"));
app.get("/", (req, res) => {
   res.send("Hello! This is FocusEureka backend");
});

const runServer = async () => {
   await db.sync({force: true});
   app.listen(PORT, () => {
      console.log(`API listening on PORT ${PORT}`);
   });
}

runServer();

module.exports = app;
