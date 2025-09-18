import { mkdir, writeFile } from 'node:fs/promises';
import { USER_ID_PATH } from '../constants/USER_ID_PATH.ts';
import { log } from './log.ts';

export const setUserId = async (userId?: string) => {
  if (!userId) return;
  const folderPath = USER_ID_PATH.substring(0, USER_ID_PATH.lastIndexOf('/'));

  log.info(userId);

  try {
    await mkdir(folderPath, { recursive: true });
    await writeFile(USER_ID_PATH, JSON.stringify({ userId }), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write USERID to file: ${error}`);
  }
};
