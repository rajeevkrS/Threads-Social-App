import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
