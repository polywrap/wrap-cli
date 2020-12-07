import {runGraphCLI} from '../cli/graph-cli';

export async function publishToSubgraph(
  subgraphPath: string,
  subgraphName: string,
  graphNode: string,
  ipfs: string,
  outputDir: string,
  quiet?: boolean
): Promise<string> {
  // create the subgraph
  await runGraphCLI(['create', '--node', graphNode, subgraphName]);

  // deploy the subgraph
  const args = [
    'deploy',
    '--node',
    graphNode,
    '--ipfs',
    ipfs,
    '--output-dir',
    `${outputDir}/subgraph`,
    subgraphName,
    subgraphPath,
  ];

  const [exitCode, stdout, stderr] = await runGraphCLI(args);

  if (!quiet || exitCode !== 0 || stderr) {
    console.log(exitCode);
    console.log(stdout);
    console.error(stderr);
  }

  const extractCID = /Build completed: (([A-Z]|[a-z]|[0-9])*)/;
  const result = stdout.match(extractCID);
  return result && result.length ? result[1] : '';
}
