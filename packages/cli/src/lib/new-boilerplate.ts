import { GluegunFilesystem } from "gluegun";

export const newBoilerplate = (projectName: string, fs: GluegunFilesystem) => {
  const { dir, write } = fs;
  dir(projectName);
  dir(`${projectName}/src`);
  dir(`${projectName}/scripts`);
  dir(`${projectName}/tests`);
  write(`${projectName}/web3api.yaml`, "");
  write(`${projectName}/package.json`, "");
};
