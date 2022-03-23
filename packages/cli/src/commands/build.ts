import { Command, Program } from "./types";
import {
    // Compiler,
    // Web3ApiProject,
    // SchemaComposer,
    // Watcher,
    // WatchEvent,
    // watchEventName,
    // publishToIPFS,
    intlMsg,
    // getDockerFileLock,
    defaultWeb3ApiManifest,
    resolvePathIfExistsRefactor,
    // getTestEnvProviders,
    isDockerInstalled,
} from "../lib";
//import chalk from "chalk";
// import axios from "axios";
// import path from "path";
// import readline from "readline";

const defaultManifestStr = defaultWeb3ApiManifest.join(" | ");
// const defaultOutputDirectory = "./build";
//const optionsStr = intlMsg.commands_build_options_options();
const nodeStr = intlMsg.commands_build_options_i_node();
const pathStr = intlMsg.commands_build_options_o_path();
const addrStr = intlMsg.commands_build_options_e_address();
const domStr = intlMsg.commands_build_options_e_domain();

// const HELP = `
//   ${chalk.bold("w3 build")} [${optionsStr}]
  
//   ${optionsStr[0].toUpperCase() + optionsStr.slice(1)}:
//     -h, --help                         ${intlMsg.commands_build_options_h()}
//     -m, --manifest-file <${pathStr}>         ${intlMsg.commands_build_options_m({
//     default: defaultManifestStr,
// })}
//     -i, --ipfs [<${nodeStr}>]                ${intlMsg.commands_build_options_i()}
//     -o, --output-dir <${pathStr}>            ${intlMsg.commands_build_options_o()}
//     -e, --test-ens <[${addrStr},]${domStr}>  ${intlMsg.commands_build_options_e()}
//     -w, --watch                        ${intlMsg.commands_build_options_w()}
//     -v, --verbose                      ${intlMsg.commands_build_options_v()}
//   `;


export const build: Command = {
    setup: (program: Program) => {

        program
            .command("build")
            .alias("b")
            .description(intlMsg.commands_build_description())
            .option(`-m, --manifest-file <${pathStr}>`, intlMsg.commands_build_options_m(
                {
                    default: defaultManifestStr,
                }
            ))
            .option(`-i, --ipfs [<${nodeStr}>] `, `${intlMsg.commands_build_options_i()}`)
            .option(`-o, --output-dir <${pathStr}>`, `${intlMsg.commands_build_options_o()}`)
            .option(`-e, --test-ens <[${addrStr},]${domStr}>`, `${intlMsg.commands_build_options_e()}`)
            .option(`-w, --watch`, `${intlMsg.commands_build_options_w()}`)
            .option(`-v, --verbose`, `${intlMsg.commands_build_options_v()}`)
            .action(async (options) => {
                await run(options);
            });
    }
}


async function run(options: any) {
    let {
        manifestFile,
        // ipfs,
        // outputDir,
        // watch,
        // testEns,
        // verbose,
    } = options;

    // Ensure docker is installed
    if (!isDockerInstalled()) {
        console.log(intlMsg.lib_docker_noInstall());
        return;
    }

    // Resolve manifest & output directory
    const manifestPaths = manifestFile
        ? [manifestFile as string]
        : defaultWeb3ApiManifest;
    manifestFile = resolvePathIfExistsRefactor(manifestPaths);

    if (!manifestFile) {
        console.log(
            intlMsg.commands_build_error_manifestNotFound({
                paths: manifestPaths.join(", "),
            })
        );
        return;
    }

    // outputDir =
    //     (outputDir && filesystem.resolve(outputDir)) ||
    //     filesystem.path(defaultOutputDirectory);

    // // Gather providers
    // let ipfsProvider: string | undefined;
    // let ethProvider: string | undefined;
    // let ensAddress: string | undefined;
    // let ensDomain: string | undefined;

    // if (typeof ipfs === "string") {
    //     // Custom IPFS provider
    //     ipfsProvider = ipfs;
    // } else if (ipfs) {
    //     // Try to get the dev server's IPFS & ETH providers
    //     const testEnvProviders = await getTestEnvProviders();
    //     ipfsProvider = testEnvProviders.ipfsProvider;
    //     ethProvider = testEnvProviders.ethProvider;
    // }

    // if (typeof testEns == "string") {
    //     // Fetch the ENS domain, and optionally the address
    //     if (testEns.indexOf(",") > -1) {
    //         const [addr, dom] = testEns.split(",");
    //         ensAddress = addr;
    //         ensDomain = dom;
    //     } else {
    //         ensDomain = testEns;
    //     }

    //     // If not address was provided, fetch it from the server
    //     // or deploy a new instance
    //     if (!ensAddress) {
    //         const getEns = await axios.get("http://localhost:4040/ens");

    //         if (!getEns.data.ensAddress) {
    //             const deployEns = await axios.get("http://localhost:4040/deploy-ens");
    //             ensAddress = deployEns.data.ensAddress;
    //         } else {
    //             ensAddress = getEns.data.ensAddress;
    //         }
    //     }
    // }

    // // Aquire a system-wide lock file for the docker service
    // const dockerLock = getDockerFileLock();

    // const project = new Web3ApiProject({
    //     rootCacheDir: path.dirname(manifestFile),
    //     web3apiManifestPath: manifestFile,
    //     quiet: verbose ? false : true,
    // });
    // await project.validate();

    // const schemaComposer = new SchemaComposer({
    //     project,
    //     ensAddress,
    //     ethProvider,
    //     ipfsProvider,
    // });

    // const compiler = new Compiler({
    //     project,
    //     outputDir,
    //     schemaComposer,
    // });

    // const execute = async (): Promise<boolean> => {
    //     compiler.reset();
    //     const result = await compiler.compile();

    //     if (!result) {
    //         return result;
    //     }

    //     const uris: string[][] = [];

    //     // publish to IPFS
    //     if (ipfsProvider) {
    //         const cid = await publishToIPFS(outputDir, ipfsProvider);

    //         console.log(`IPFS { ${cid} }`);
    //         uris.push(["Web3API IPFS", `ipfs://${cid}`]);

    //         if (testEns) {
    //             if (!ensAddress) {
    //                 uris.push([
    //                     intlMsg.commands_build_ensRegistry(),
    //                     `${ethProvider}/${ensAddress}`,
    //                 ]);
    //             }

    //             // ask the dev server to publish the CID to ENS
    //             const { data } = await axios.get(
    //                 "http://localhost:4040/register-ens",
    //                 {
    //                     params: {
    //                         domain: ensDomain,
    //                         cid,
    //                     },
    //                 }
    //             );

    //             if (data.success) {
    //                 uris.push(["Web3API ENS", `${testEns} => ${cid}`]);
    //             } else {
    //                console.log(
    //                     `${intlMsg.commands_build_error_resolution()} { ${testEns} => ${cid} }\n` +
    //                     `${intlMsg.commands_build_ethProvider()}: ${ethProvider}\n` +
    //                     `${intlMsg.commands_build_address()}: ${ensAddress}`
    //                 );
    //             }

    //             return data.success;
    //         }

    //         if (uris.length) {
    //             console.log(`${intlMsg.commands_build_uriViewers()}:`);
    //             console.log(uris);
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }

    //     return true;
    // };

    // if (!watch) {
    //     await dockerLock.request();
    //     const result = await execute();
    //     await dockerLock.release();

    //     if (!result) {
    //         process.exitCode = 1;
    //         return;
    //     }
    // } else {
    //     // Execute
    //     await dockerLock.request();
    //     await execute();
    //     await dockerLock.release();

    //     const keyPressListener = () => {
    //         // Watch for escape key presses
    //         console.log(
    //             `${intlMsg.commands_build_keypressListener_watching()}: ${project.getManifestDir()}`
    //         );
    //         console.log(intlMsg.commands_build_keypressListener_exit());
    //         readline.emitKeypressEvents(process.stdin);
    //         process.stdin.on("keypress", async (str, key) => {
    //             if (
    //                 key.name == "escape" ||
    //                 key.name == "q" ||
    //                 (key.name == "c" && key.ctrl)
    //             ) {
    //                 await watcher.stop();
    //                 await dockerLock.release();
    //                 process.kill(process.pid, "SIGINT");
    //             }
    //         });

    //         if (process.stdin.setRawMode) {
    //             process.stdin.setRawMode(true);
    //         }

    //         process.stdin.resume();
    //     };

    //     keyPressListener();

    //     // Watch the directory
    //     const watcher = new Watcher();

    //     watcher.start(project.getManifestDir(), {
    //         ignored: [outputDir + "/**", project.getManifestDir() + "/**/w3/**"],
    //         ignoreInitial: true,
    //         execute: async (events: WatchEvent[]) => {
    //             // Log all of the events encountered
    //             for (const event of events) {
    //                 console.log(`${watchEventName(event.type)}: ${event.path}`);
    //             }

    //             // Execute the build
    //             await dockerLock.request();
    //             await execute();
    //             await dockerLock.release();

    //             // Process key presses
    //             keyPressListener();
    //         },
    //     });
    // }
    // process.exitCode = 0;
}