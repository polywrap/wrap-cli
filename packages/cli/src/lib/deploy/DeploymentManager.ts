/* eslint-disable @typescript-eslint/no-require-imports */
import { Web3ApiProject } from "../project";
import { runCommand } from "../system";
import { DirectoryEntry } from "./file";

import path from "path";
import fs from "fs";
import { DeployManifest } from "@web3api/core-js";

type Config = {
  [k: string]: string | number;
};

export interface Deployer {
  deploy(buildDirEntry: DirectoryEntry, config?: Config): Promise<string>;
}

export interface Publisher {
  publish(cid: string, config?: Config): Promise<string>;
}

export interface Deployment {
  name: string;
  deployer?: Deployer;
  publisher?: Publisher;
  deployerConfig?: Config;
  publisherConfig?: Config;
}

export class DeploymentManager {
  public static readonly cacheDirName = "deployments";
  private packagesInstalled = false;

  constructor(
    private project: Web3ApiProject,
    private deployManifest: DeployManifest
  ) {}

  public installPackages = async (deploymentName: string): Promise<void> => {
    const deploymentManifestItem = this.findDeploymentInManifest(
      deploymentName
    );

    const packages: { name: string; versionOrPath: string }[] = [];

    if (deploymentManifestItem.deploy) {
      packages.push(deploymentManifestItem.deploy.package);
    }

    if (deploymentManifestItem.publish) {
      packages.push(deploymentManifestItem.publish.package);
    }

    const packageJSON = {
      name: "web3api-deploy",
      version: "1.0.0",
      private: true,
      dependencies: packages.reduce((acc, current) => {
        acc[current.name] = current.versionOrPath;
        return acc;
      }, {} as Record<string, string>),
    };

    fs.writeFileSync(
      path.join(
        this.project.getCachePath(DeploymentManager.cacheDirName),
        "package.json"
      ),
      JSON.stringify(packageJSON)
    );

    await runCommand(
      `cd ${this.project.getCachePath(DeploymentManager.cacheDirName)} && npm i`
    );

    this.packagesInstalled = true;
  };

  public getDeployment = (deploymentName: string): Deployment => {
    const deployment: Deployment = {
      name: deploymentName,
    };

    if (!this.packagesInstalled) {
      throw new Error("Packages have not been installed");
    }

    const deploymentManifestItem = this.findDeploymentInManifest(
      deploymentName
    );

    const nodeModulesPath = path.join(
      this.project.getCachePath(DeploymentManager.cacheDirName),
      "node_modules"
    );

    if (deploymentManifestItem.deploy) {
      deployment.deployer = require(path.join(
        nodeModulesPath,
        deploymentManifestItem.deploy.package.name
      ));

      deployment.deployerConfig = deploymentManifestItem.deploy.config;
    }

    if (deploymentManifestItem.publish) {
      deployment.publisher = require(path.join(
        nodeModulesPath,
        deploymentManifestItem.publish.package.name
      ));

      deployment.publisherConfig = deploymentManifestItem.publish.config;
    }

    return deployment;
  };

  private findDeploymentInManifest = (deploymentName: string) => {
    const deploymentManifestItem = this.deployManifest.deployments.find(
      (d) => d.name === deploymentName
    );

    if (!deploymentManifestItem) {
      throw new Error(
        `Deployment with name '${deploymentName}' not found in manifest`
      );
    }

    return deploymentManifestItem;
  };
}
