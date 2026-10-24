import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(port, () => console.log(`Expense Tracker API listening on port ${port}`));
} catch (error) {
  console.error("Unable to start server:", error.message);
  process.exit(1);
}
