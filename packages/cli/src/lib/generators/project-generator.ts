import { execSync } from "child_process";
import { GluegunFilesystem } from "gluegun";

export const generateProject = (type: string, lang: string, projectName: string, fs: GluegunFilesystem): void => {
  const { dir } = fs;
  dir(projectName);
  execSync(`
    cd ${projectName}
    git init
    git remote add origin https://github.com/Web3-API/prototype.git
    git config core.sparsecheckout true
    echo "packages/templates/${type}/${lang}" >> .git/info/sparse-checkout
    git pull origin feature/cli-create-codegen
    mv ./packages/templates/${type}/${lang}/* ./
  `);
};
