import express from "express";
import dotenv from "dotenv";

const app = express();
const port = 5000;

dotenv.config();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;