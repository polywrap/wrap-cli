import { intlMsg } from "../../";

import { execSync, spawn } from "child_process";
import fs from "fs";
import fse from "fs-extra";
import dns from "dns";
import url from "url";
import chalk from "chalk";
import path from "path";

function shouldUseYarn(): boolean {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function getProxy() {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  } else {
    try {
      // Trying to read https-proxy from .npmrc
      const httpsProxy = execSync("npm config get https-proxy")
        .toString()
        .trim();
      return httpsProxy !== "null" ? httpsProxy : undefined;
    } catch (e) {
      return undefined;
    }
  }
}

function checkIfOnline(useYarn: boolean) {
  if (!useYarn) {
    // Don't ping the Yarn registry.
    // We'll just assume the best case.
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    dns.lookup("registry.yarnpkg.com", (err) => {
      let proxy;
      if (err != null && (proxy = getProxy())) {
        // If a proxy is defined, we likely can't resolve external hostnames.
        // Try to resolve the proxy name as an indication of a connection.
        dns.lookup(url.parse(proxy).hostname || "", (proxyErr) => {
          resolve(proxyErr == null);
        });
      } else {
        resolve(err == null);
      }
    });
  });
}

const executeCommand = (
  command: string,
  args: string[],
  root: string
): Promise<boolean | { command: string }> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: root,
      shell: process.platform == "win32",
    });
    child.on("close", (code: number) => {
      if (code !== 0) {
        // Return the failed command
        reject({
          command: `${command} ${args.join(" ")}`,
        });
        return;
      }

      resolve(true);
    });
  });
};

export const generateProjectTemplate = (
  type: string,
  lang: string,
  projectDir: string
): Promise<boolean | { command: string }> => {
  return new Promise((resolve, reject) => {
    let command = "";
    let args: string[] = [];

    const useYarn = shouldUseYarn();
    const isOnline = checkIfOnline(useYarn);

    const root = path.resolve(projectDir);
    const dependencies: string[] = ["@polywrap/templates"];

    fs.writeFileSync(
      path.join(root, "package.json"),
      `
{
  "name": "template"
}
    `
    );

    if (useYarn) {
      command = "yarnpkg";
      args = ["add", "--exact"];

      if (!isOnline) {
        args.push("--offline");
      }

      args.push(...dependencies);

      // Explicitly set cwd() to work around issues like
      // https://github.com/facebook/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      args.push("--cwd");
      args.push(root);

      if (!isOnline) {
        const offlineMessage = intlMsg.lib_generators_projectGenerator_offline();
        const fallbackMessage = intlMsg.lib_generators_projectGenerator_fallback();
        console.log(chalk.yellow(offlineMessage));
        console.log(chalk.yellow(fallbackMessage));
        console.log();
      }
    } else {
      command = "npm";
      args = [
        "install",
        "--save",
        "--save-exact",
        "--loglevel",
        "error",
      ].concat(dependencies);
    }

    executeCommand(command, args, root)
      .then(() => {
        fse
          .copy(
            `${root}/node_modules/@polywrap/templates/${type}/${lang}`,
            `${root}`,
            {
              overwrite: true,
            }
          )
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject({
              command: `copy ${root}/node_modules/@polywrap/templates/${type}/${lang} ${root}`,
            });
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
