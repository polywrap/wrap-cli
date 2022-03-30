/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import fs from "fs";
import path from "path";

const prompt = require("prompt");

export const isValidWrapDir = (buildPath: string): boolean => {
  return (
    fs.existsSync(path.join(buildPath, "web3api.yaml")) ||
    fs.existsSync(path.join(buildPath, "web3api.yml")) ||
    fs.existsSync(path.join(buildPath, "web3api.json"))
  );
};

export const toShortString = (str: string): string => {
  return str
    ? `${str.slice(0, 6)}...${str.slice(-4, str.length)}`
    : "undefined";
};

export const promptForPassword = (): Promise<string> => {
  const schema = {
    properties: {
      password: {
        description: "Enter your password",
        hidden: true,
      },
    },
  };

  prompt.start();

  return new Promise((resolve, reject) => {
    prompt.get(schema, (error: Error, result: { password: string }) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.password);
      }
    });
  });
};
