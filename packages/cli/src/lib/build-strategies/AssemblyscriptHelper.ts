import fse from "fs-extra";
import path from "path";

export interface ScriptHelper {
  linkPackages(args: {
    pkgs: {
      dir: string;
      name: string;
    }[];
    manifestDir: string;
    projectVolumeDir: string;
  }): Promise<void>;
  getBuildCommand(moduleDir: string): Promise<string>;
  copySourceManifest(args: {
    manifestDir: string;
    projectVolumeDir: string;
  }): Promise<void>;
}

export class AssemblyscriptHelper implements ScriptHelper {
  async linkPackages(args: {
    pkgs: {
      dir: string;
      name: string;
    }[];
    manifestDir: string;
    projectVolumeDir: string;
  }): Promise<void> {
    const packageJson = fse.readJsonSync(
      path.join(args.manifestDir, "package.json")
    );

    const modifiedPackageJson = {
      ...packageJson,
      dependencies: {
        ...packageJson.dependencies,
        ...args.pkgs.reduce((acc, pkg) => {
          acc[pkg.name] = `../linked-packages/${pkg.name}`;
          return acc;
        }, {} as Record<string, string>),
      },
    };

    fse.writeJsonSync(
      path.join(args.projectVolumeDir, "package.json"),
      modifiedPackageJson
    );
  }
  async getBuildCommand(moduleDir: string): Promise<string> {
    return `./node_modules/.bin/asc ${moduleDir}/wrap/entry.ts \
        --path ./node_modules \
        --outFile ./build/wrap.wasm \
        --use abort=${moduleDir}/wrap/entry/wrapAbort \
        --optimize --importMemory \
        --runtime stub \
        --runPasses asyncify`;
  }
  async copySourceManifest(args: {
    manifestDir: string;
    projectVolumeDir: string;
  }): Promise<void> {
    const packageJson = fse.readJsonSync(
      path.join(args.manifestDir, "package.json")
    );

    fse.writeJsonSync(
      path.join(args.projectVolumeDir, "package.json"),
      packageJson
    );
  }
}
