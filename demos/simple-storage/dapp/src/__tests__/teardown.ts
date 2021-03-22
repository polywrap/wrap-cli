import rimraf from 'rimraf';
import { DIR } from './constants';
import { server } from './setup';

// eslint-disable-next-line import/no-default-export
export default async function (): Promise<void> {
  if (server) server.close();

  // close the browser instance
  await global.browser.close();

  // clean-up the wsEndpoint file
  rimraf.sync(DIR);
}
