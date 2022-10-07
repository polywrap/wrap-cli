import { Logger } from "./Logger";

export async function logActivity<TReturn>(
  logger: Logger,
  infoText: string,
  errorText: string,
  warningText: string,
  execute: (logger: Logger) => Promise<TReturn>
): Promise<TReturn> {
  // Log the start of an activity
  logger.info(`🔄 ${infoText}`);

  // Execute the activity
  try {
    const result = await execute(logger);
    if (result && typeof result === "object") {
      const res = result as Record<string, unknown>;
      const hasWarning = !!res.warning;
      const hasResult = !!res.result;
      if (hasWarning && hasResult) {
        if (res.warning !== null) {
          logger.warn(`${warningText}: ${res.warning}`);
        }
        logger.info(`✅ ${infoText}`);
        return res.result as TReturn;
      } else {
        logger.info(`✅ ${infoText}`);
        return result;
      }
    } else {
      logger.info(`✅ ${infoText}`);
      return result;
    }
  } catch (e) {
    logger.error(`❌ ${errorText}: ${e.message}`);
    throw e;
  }
}
