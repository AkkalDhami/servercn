import cron from "node-cron";

/**
 * Example background job that runs every minute
 * Format: minute hour day-of-month month day-of-week
 */
export const exampleJob = cron.schedule("* * * * *", () => {
  console.log("Background job running every minute...");
  // Add your task logic here (e.g., database cleanup, sending reports)
});
