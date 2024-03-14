import mongoose from "mongoose";
import logger from "./logger";
import retry from "retry";

// Database connection retry config
const operation = retry.operation({
  retries: 10, // Number of retries
  factor: 1.5, // Exponential backoff factor
  minTimeout: 500, // Minimum time between retries (in milliseconds)
  maxTimeout: 5000, // Maximum time between retries (in milliseconds)
  randomize: true, // Randomize the timeouts
});

export default async function connectDB() {
  operation.attempt(async () => {
    try {
      // await mongoose.connect(`${process.env.DB_CONNECTION}`);
      // await mongoose.connect("mongodb+srv://devteamwebx:gUwZTl0krSTXQQDA@cluster0.dqnyzwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
      await mongoose.connect("mongodb+srv://lokichaulagain:lflWj60Nx4KHp65e@cluster0.xeaqh96.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

      logger.info("DB connected...");
    } catch (error: any) {
      logger.error("Could not connect to db", error);
      if (operation.retry(error)) {
        return;
      }
    }
  });
}
