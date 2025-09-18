import { logger as sidequestLogger } from 'sidequest';

const loggerInstance = () => {
  return sidequestLogger('fetcher');
};

export const log = loggerInstance();
