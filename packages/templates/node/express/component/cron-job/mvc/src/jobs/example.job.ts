import cron from "node-cron";

import { lt, or, eq } from "drizzle-orm";
import { refreshTokens } from "../drizzle"; //? Refresh token table
import db from "../configs/db"; //? Database connection

/**
 * Example background job that runs every minute
 * Format: minute hour day-of-month month day-of-week
 */
export const exampleJob = cron.schedule("* * * * *", () => {
  console.log("Background job running every minute...");
  // Add your task logic here (e.g., database cleanup, sending reports)
});

//? Refresh Token Cleanup Job Example
export function startRefreshTokenCleanupJob() {
  cron.schedule(
    "0 2 * * *", // daily at 2 am
    async () => {
      try {
        const now = new Date();

        const [result] = await db
          .delete(refreshTokens)
          .where(
            or(
              lt(refreshTokens.expiresAt, now),
              eq(refreshTokens.isRevoked, true)
            )
          );

        console.log(
          `Refresh token cleanup completed. Deleted ${result.affectedRows} records`
        );
      } catch (error) {
        console.error(error, "Refresh token cleanup failed");
      }
    },
    {
      timezone: "Asia/Kathmandu"
    }
  );
}
