import path from "path";

const spawn = require("spawn-command");

// TODO: abstract CLI dependencies out into their own folder
// TODO: make this output asynchronous

// We cannot `require.resolve('@graphprotocol/graph-cli')`, because it's not a require-able package
const graphCli = path.resolve(
  `${require.resolve("@graphprotocol/graph-ts")}/../../graph-cli/bin/graph`
);

export function runGraphCLI(args: string[]): Promise<[number, string, string]> {
  return new Promise(
    (resolve, reject) => {
      // Make sure to set an absolute working directory
      let cwd = process.cwd();
      cwd = cwd[0] !== '/' ? path.resolve(__dirname, cwd) : cwd
  
      const command = `${graphCli} ${args.join(' ')}`;
      const child = spawn(command, { cwd });
      let stdout = ''
      let stderr = ''

      child.on('error', (error: Error) => {
        reject(error)
      })
  
      child.stdout.on('data', (data: string) => {
        stdout += data.toString()
      });
  
      child.stderr.on('data', (data: string) => {
        stderr += data.toString()
      });
  
      child.on('exit', (exitCode: number) => {
        resolve([exitCode, stdout, stderr])
      });
    }
  );
}
