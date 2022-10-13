/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import https from "https";
import path from "path";
import fs from "fs";
import fse from "fs-extra";
import extractZip from "extract-zip";
import rimraf from "rimraf";
import yaml from "yaml";

const tempCacheDir = path.join(__dirname, ".tmp");
const releaseName = "0.11.0";
const releaseDownloadUrl = `https://github.com/SigNoz/signoz/archive/refs/tags/v${releaseName}.zip`;
const sourceDir = path.join(
  tempCacheDir,
  `signoz-${releaseName}/deploy/docker/clickhouse-setup/`
);
const destDir = path.join(
  __dirname,
  "../src/lib/defaults/infra-modules/tracer/"
);

function download(url: string, w: fs.WriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    let protocol = /^https:/.exec(url) ? https : http;

    protocol
      .get(url, (res1: http.IncomingMessage) => {
        if (!res1.headers.location) {
          reject("location undefined");
          return;
        }
        protocol = /^https:/.exec(res1.headers.location) ? https : http;

        protocol
          .get(res1.headers.location, (res2: http.IncomingMessage) => {
            res2.pipe(w);
            res2.on("error", reject);
            res2.on("end", resolve);
          })
          .on("error", reject);
      })
      .on("error", reject);
  });
}

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
    recursive: true,
  });

  // Misc cleanup
  const yamlDockerComposePath = path.join(destDir, "docker-compose.yaml");
  let yamlDockerCompose: Record<string, any> | undefined;

  try {
    yamlDockerCompose = yaml.parse(
      fs.readFileSync(yamlDockerComposePath, "utf-8")
    ) as Record<string, any> | undefined;
  } catch (_) {
    yamlDockerCompose = undefined;
  }

  if (!yamlDockerCompose) {
    throw new Error(`Unable to load ${yamlDockerComposePath}`);
  }

  // 1. Remove the "hotrod" & "load-hotrod" services
  delete yamlDockerCompose.services.hotrod;
  delete yamlDockerCompose.services["load-hotrod"];
  let rawYamlDockerCompose = yaml.stringify(yamlDockerCompose, null, 2);

  // 2. Copy the "../common" & patch the file path
  fse.copySync(
    path.join(sourceDir, "../common"),
    path.join(destDir, "./common"),
    { recursive: true }
  );
  rawYamlDockerCompose = rawYamlDockerCompose.replace("../common", "./common");

  // 3. Replace the "../dashboards" path with a local one
  rawYamlDockerCompose = rawYamlDockerCompose.replace(
    "../dashboards",
    "./dashboards"
  );

  // Output the modified docker-compose.yaml
  fs.writeFileSync(yamlDockerComposePath, rawYamlDockerCompose);

  // Clean up the temp folder
  await rimraf.sync(tempCacheDir);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
