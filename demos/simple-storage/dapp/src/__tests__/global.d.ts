import puppeteer from 'puppeteer';
import { Dappeteer } from '@nodefactory/dappeteer';

declare global {
  namespace NodeJS {
    interface Global {
      page: puppeteer.Page;
      browser: puppeteer.Browser;
      metamask: Dappeteer;
    }
  }
}
