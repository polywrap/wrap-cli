import * as path from 'path';
import * as os from 'os';

export const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export {};
