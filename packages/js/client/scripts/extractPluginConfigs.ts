import { Project as TsProject } from "ts-morph";
import { writeFileSync } from "@polywrap/os-js";
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
    module: "@polywrap/ipfs-plugin-js",
    uri: "wrap://ens/ipfs.polywrap.eth",
    config: "NoConfig",
    files: [
      {
        name: "build/index.d.ts",
        types: ["NoConfig"]
      },
    ],
  },
  {
    name: "Ethereum",
    module: "@polywrap/ethereum-plugin-js",
    uri: "wrap://ens/ethereum.polywrap.eth",
    config: "EthereumPluginConfig",
    files: [
      {
        name: "build/index.d.ts",
        interfaces: ["EthereumPluginConfig"],
      },
      {
        name: "build/Connection.d.ts",
        interfaces: ["ConnectionConfig"],
        types: [
          "EthereumProvider",
          "EthereumSigner",
          "AccountIndex",
          "Address",
        ],
      },
      {
        name: "build/Connections.d.ts",
        interfaces: ["ConnectionsConfig"],
        types: ["Networks"],
      },
    ],
    externals: [
      {
        type: "Connection",
        module: "@polywrap/ethereum-plugin-js"
      },
      {
        type: "Connections",
        module: "@polywrap/ethereum-plugin-js"
      },
      {
        type: "Signer",
        module: "ethers",
      },
      {
        type: "ExternalProvider",
        module: "@ethersproject/providers",
      },
      {
        type: "JsonRpcProvider",
        module: "@ethersproject/providers",
      },
    ],
  },
  {
    name: "Ens",
    module: "@polywrap/ens-resolver-plugin-js",
    uri: "wrap://ens/ens-resolver.polywrap.eth",
    config: "EnsResolverPluginConfig",
    files: [
      {
        name: "build/index.d.ts",
        interfaces: ["EnsResolverPluginConfig", "Addresses"],
        types: ["Address"],
      },
    ],
  },
];

function main(): void {

  const header = "/// NOTE: This is an auto-generated file. See scripts/extractPluginConfigs.ts\n" +
    "/* eslint-disable @typescript-eslint/no-explicit-any */\n" +
    "/* eslint-disable prettier/prettier */";
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
