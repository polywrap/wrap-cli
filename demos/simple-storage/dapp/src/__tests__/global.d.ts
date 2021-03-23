declare global {
  namespace NodeJS {
    interface Global {
      page: puppeteer.Page;
      browser: puppeteer.Browser;
      metamask: Dappeteer;
    }
  }
}
