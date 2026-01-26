import { exampleJob } from "./example.job";

/**
 * Initialize and start all background jobs
 */
export const initJobs = () => {
  exampleJob.start();
  console.log("Background jobs initialized.");
};
