import './config/env';
import { env } from './config/env';
import { logger } from './utils/logger';
import { syncDatabase } from './models';
import app from './app';

const start = async (): Promise<void> => {
  await syncDatabase();
  logger.info('Database synced');

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

start().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
