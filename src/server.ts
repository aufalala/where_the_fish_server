import app from "./app.js";
import { PORT } from './config/env.config.js';
import { connectDB } from './config/db.config.js';


connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
