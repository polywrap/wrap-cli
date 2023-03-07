import admZip from 'adm-zip';
const axios = require("axios");
const shell = require("shelljs");

export const GetPathToBindTestFiles = () => `${__dirname}/cases/bind`
export const GetPathToComposeTestFiles = () => `${__dirname}/cases/compose`
export const GetPathToParseTestFiles = () => `${__dirname}/cases/parse`
export const GetPathToTestWrappers = () => `${__dirname}/cases/wrappers`
export const GetPathToCliTestFiles = () => `${__dirname}/cases/cli`;
export const GetPathToValidateTestFiles = () => `${__dirname}/cases/validate`;

export async function fetchWrappers(): Promise<void> {
  // function to fetch file from GitHub release
  async function fetchFromGithub(url: string) {
    // fetch file
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file from ${url}`);
    }
    return response.data;
  }

  function unzipFile(fileBuffer: Buffer, destination: string) {
    // create adm-zip instance
    const zip = new admZip(fileBuffer);
    // extract archive
    zip.extractAllTo(destination, /*overwrite*/ true);
  }

  const tag = "0.0.1-pre.7"
  const repoName = "wasm-test-harness"
  const url = `https://github.com/polywrap/${repoName}/releases/download/${tag}/wrappers`;

  try {
    const buffer = await fetchFromGithub(url);
    const zipBuiltFolder = './cases/wrappers';
    unzipFile(buffer, zipBuiltFolder);
    shell.exec(`rm -rf node_modules`)
    console.log(`Wrappers folder fetch successful`);
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
}