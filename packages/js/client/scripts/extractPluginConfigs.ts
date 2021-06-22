import { Project as TsProject } from "ts-morph";
import { writeFileSync } from "@web3api/os-js";
import path from "path";

interface PluginConfigSource {
  name: string;
  module: string;
  uri: string;
  config: string;
  files: {
    name: string;
    interfaces?: string[];
    types?: string[];
  }[];
  externals?: {
    type: string;
    module: string;
  }[];
}

const plugins: PluginConfigSource[] = [
  {
    name: "Ipfs",
    module: "@web3api/ipfs-plugin-js",
    uri: "w3://ens/ipfs.web3api.eth",
    config: "IpfsConfig",
    files: [{
      name: "build/index.d.ts",
      interfaces: ["IpfsConfig"]
    }]
  },
  {
    name: "Ethereum",
    module: "@web3api/ethereum-plugin-js",
    uri: "w3://ens/ethereum.web3api.eth",
    config: "EthereumConfig",
    files: [
      {
        name: "build/index.d.ts",
        interfaces: ["EthereumConfig"],
      },
      {
        name: "build/Connection.d.ts",
        interfaces: ["ConnectionConfig", "ConnectionConfigs"],
        types: ["EthereumProvider", "EthereumSigner", "AccountIndex", "Address"],
      },
    ],
    externals: [
      {
        type: "Signer",
        module: "ethers"
      },
      {
        type: "ExternalProvider",
        module: "@ethersproject/providers"
      },
      {
        type: "JsonRpcProvider",
        module: "@ethersproject/providers"
      }
    ]
  },
  {
    name: "Ens",
    module: "@web3api/ens-plugin-js",
    uri: "w3://ens/ens.web3api.eth",
    config: "EnsConfig",
    files: [{
      name: "build/index.d.ts",
      interfaces: ["EnsConfig", "Addresses"],
      types: ["Address"]
    }]
  }
];

function main(): void {

  const header = "/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts\n" +
    "/* eslint-disable @typescript-eslint/no-explicit-any */";
  const outputFiles: {
    fileName: string,
    content: string
  }[] = [];

  for (const plugin of plugins) {
    let output = header;

    output += `\n\n/// Types generated from ${plugin.module} build files:\n/// ${
      plugin.files.map(({ name }) => name).join(', ')
    }`

    const project = new TsProject();

    for (const file of plugin.files) {
      const filePath = require.resolve(path.join(plugin.module, file.name));
      const sourceFile = project.addSourceFileAtPath(filePath);

      for (const pluginInterface of file.interfaces || []) {
        const int = sourceFile.getInterfaceOrThrow(pluginInterface);
        output += `\n\n${int.print().replace(/    /g, "  ")}`;
      }

      for (const pluginType of file.types || []) {
        const typ = sourceFile.getTypeAliasOrThrow(pluginType);
        output += `\n\n${typ.print().replace("declare ", "").replace(/    /g, "  ")}`;
      }
    }

    for (const pluginExternal of plugin.externals || []) {
      output += `\n\n// import { ${pluginExternal.type} } from "${pluginExternal.module}"`;
      output += `\nexport type ${pluginExternal.type} = any;`;
    }

    outputFiles.push({
      fileName: `${plugin.name}.ts`,
      content: output + "\n"
    });
  }

  let indexContent = header + "\n";

  let pluginConfigs = "\n\ninterface PluginConfigs {";
  let pluginModules = "\n\nconst modules: Record<string, string> = {";
  let pluginUris = "\n\nconst uris: Record<string, string> = {";

  for (const plugin of plugins) {
    const pluginKey = plugin.name.toLowerCase();
    indexContent += `\nimport { ${plugin.config} } from "./${plugin.name}";`;
    pluginConfigs += `\n  ${pluginKey}?: ${plugin.config};`;
    pluginModules += `\n  ${pluginKey}: "${plugin.module}",`;
    pluginUris += `\n  ${pluginKey}: "${plugin.uri}",`;
  }

  pluginConfigs += `\n}`;
  pluginModules += `\n};`;
  pluginUris += `\n};`;

  indexContent += pluginConfigs + pluginModules + pluginUris + `\n\nexport { PluginConfigs, modules, uris };\n`;

  outputFiles.push({
    fileName: "index.ts",
    content: indexContent
  });

  for (const outputFile of outputFiles) {
    writeFileSync(
      __dirname + "/../src/pluginConfigs/" + outputFile.fileName,
      outputFile.content
    );
  }
}

try {
  main();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
