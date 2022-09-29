from __future__ import annotations
from dataclasses import dataclass


@dataclass
class PluginConfigSource:
    name: str = None
    module: str = None
    uri: str = None
    config: str = None
    files: Dict = None
    externals: Dict = None

plugins = [
    PluginConfigSource(
        name = "Ipfs",
        module = "@web3api/ipfs-plugin-js",
        uri = "w3://ens/ipfs.web3api.eth",
        config = "IpfsPluginConfigs"
        files = [
            {
                "name": "build/index.d.ts",
                "interfaces": ["IpfsPluginConfigs"]
            },
            {
                "name": "build/common/IpfsConfig.d.ts",
                "interfaces": ["IpfsConfig"],
            }
        ]
    ),
    PluginConfigSource(
        name = "Ethereum",
        module = "@web3api/ethereum-plugin-js",
        uri = "w3://ens/ethereum.web3api.eth",
        config = "EthereumPluginConfigs"
        files = [
            {
                "name": "build/index.d.ts",
                "interfaces": ["EthereumPluginConfigs"],
            },
            {
                "name": "build/common/EthereumConfig.d.ts",
                "interfaces": ["EthereumConfig"],
            },
            {
                "name": "build/common/Connection.d.ts",
                "interfaces": ["ConnectionConfig", "ConnectionConfigs"],
                "types": ["EthereumProvider", "EthereumSigner", "AccountIndex", "Address"],
            },
        ],
        externals = [
            {
                "type": "Signer",
                "module": "ethers"
            },
            {
                "type": "ExternalProvider",
                "module": "@ethersproject/providers"
            },
            {
                "type": "JsonRpcProvider",
                "module": "@ethersproject/providers"
            }
        ]
    ),
    PluginConfigSource(
        name = "Ens",
        module = "@web3api/ens-plugin-js",
        uri = "w3://ens/ens.web3api.eth",
        config = "EnsPluginConfigs"
        files = [
            {
                "name": "build/w3/plugin.d.ts",
                "interfaces": ["EnsPluginConfigs"],
            },
            {
                "name": "build/query/index.d.ts",
                "interfaces": ["QueryConfig", "Addresses"],
                "types": ["Address"],
            },
        ]
    )
]

if __name__ == "__main__":
    header = "# NOTE: This is an auto-generated file. See scripts/extract_plugin_configs.py"
    output_files = []

    for plugin in plugins:
        output = header

        output += f"# Types generated from {plugin.module} build files:\n "
        for name in plugin.files:
            output += f"{name}, "
        
        project = PyProject()

        for file in plugin.files:
            file_path = require.resolve(path.join(plugin.module, file.name))
            source_file = project.add_source_file_at_path(file_path)

            for plugin_interface in file.interfaces:
                int = source_file.get_interface_or_throw(plugin_interface)
                output += f"\n\n{int.print()}"
            
            for plugin_type in file.types:
                typ = source_file.get_type_alias_or_throw(plugin_type)
                output += f'\n\n${typ.print().replace("declare ", "")}'

            for plugin_external in plugin.externals:
                output += f'\n\n// import { {plugin_external.type} } from "{plugin_external.module}"'
                output += f'\nexport type {plugin_external.type} = any;'
            
            output_files.append({
                "file_name": f"{plugin.name}.py",
                "content": output + "\n"
            })

    index_content = header + "\n"

    plugin_configs = "\n\ninterface PluginConfigs {"
    plugin_modules = "\n\nconst modules: Record<string, string> = {"
    plugin_uris = "\n\nconst uris: Record<string, string> = {"

    for plugin in plugins:
        plugin_key = plugin.name.lower()
        index_content += f"\nfrom ./{plugin.name} import { {plugin.config} } "
        plugin_configs += f'\n  {plugin_key}?: {plugin.config};'
        plugin_modules += f'\n  {plugin_key}: "{plugin.module}",'
        plugin_uris += f'\n  {plugin_key}: "{plugin.uri}",'

    plugin_configs += '\n}'
    plugin_modules += '\n};'
    plugin_uris += '\n};'

    index_content += plugin_configs + plugin_modules + plugin_uris + '\n\nexport { PluginConfigs, modules, uris };\n'

    output_files.append(
        {
            "file_name": "__init__.py",
            "content": index_content
        }
    )

    for output_file in output_files:
        with open(f'/../src/plugin_configs/', 'w+') as f:
            f.write(output_file.content)

