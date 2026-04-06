import { exampleJob, startRefreshTokenCleanupJob } from "./example.job";

/**
 * Initialize and start all background jobs
 */
export const initJobs = () => {
  exampleJob.start();
  startRefreshTokenCleanupJob();
  console.log("Background jobs initialized.");
};
