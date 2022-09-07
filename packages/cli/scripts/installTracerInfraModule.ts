import http from "http";
import https from "https";
import path from "path";
import fs from "fs";
import fse from "fs-extra";
import extractZip from "extract-zip";
import rimraf from "rimraf";

const tempCacheDir = path.join(__dirname, ".tmp");
const releaseName = "0.11.0";
const releaseDownloadUrl = `https://github.com/SigNoz/signoz/archive/refs/tags/v${releaseName}.zip`;
const sourceDir = path.join(tempCacheDir, `signoz-${releaseName}/deploy/docker/clickhouse-setup/`);
const destDir = path.join(__dirname, "../src/lib/defaults/infra-modules/tracer/");

function download(url: string, w: fs.WriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    let protocol = /^https:/.exec(url) ? https : http;

    protocol
      .get(url, (res1: any) => {
        protocol = /^https:/.exec(res1.headers.location) ? https : http;

        protocol
          .get(res1.headers.location, (res2: any) => {
            res2.pipe(w);
            res2.on("error", reject);
            res2.on("end", resolve);
          })
          .on("error", reject);
      })
      .on("error", reject);
  });
};

async function main() {
  // Download the release's zip
  await fse.ensureDir(tempCacheDir);
  const zipFile = path.join(tempCacheDir, releaseName + ".zip");
  const destWs = fs.createWriteStream(zipFile);
  await download(releaseDownloadUrl, destWs);

  // Extract the zip into the directory, and delete the zip file
  await extractZip(zipFile, { dir: tempCacheDir });
  fs.unlinkSync(zipFile);

  // Copy the docker-compose contents into the infra-modules folder
  rimraf.sync(destDir);
  await fse.ensureDir(destDir);
  fse.copySync(sourceDir, destDir, {
    filter: function (path) {
      return !path.includes("/data");
    },
    recursive: true,
    overwrite: true
  });

  // Clean up the temp folder
  await rimraf.sync(tempCacheDir);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
