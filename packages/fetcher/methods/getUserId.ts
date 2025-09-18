import { readFile } from 'node:fs/promises';
import { USER_ID_PATH } from '../constants/USER_ID_PATH.ts';

export const getUserId = async () => {
  try {
    const userIdFile = await readFile(USER_ID_PATH, 'utf-8');
    return JSON.parse(userIdFile).userId;
  } catch {
    return null;
  }
};
