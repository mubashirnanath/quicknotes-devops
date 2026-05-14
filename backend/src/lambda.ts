import serverless from 'serverless-http';
import app from './app';
import { syncDatabase } from './models';

const initPromise = syncDatabase(false);

const serverlessHandler = serverless(app);

export const handler = async (event: unknown, context: unknown) => {
  await initPromise;
  return serverlessHandler(event as any, context as any);
};