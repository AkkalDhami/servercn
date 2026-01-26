import cron from "node-cron";

/**
 * Example background job that runs every minute
 */
export const exampleJob = cron.schedule("* * * * *", () => {
  console.log("Background job running every minute...");
});
