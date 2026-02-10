import cron from "node-cron";
import { lt, or, eq } from "drizzle-orm";
import { refreshTokens } from "../drizzle";
import db from "../configs/db";
import { logger } from "../utils/logger";

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

        logger.info(
          `Refresh token cleanup completed. Deleted ${result.affectedRows} records`
        );
      } catch (error) {
        logger.error(error, "Refresh token cleanup failed");
      }
    },
    {
      timezone: "Asia/Kathmandu"
    }
  );
}
