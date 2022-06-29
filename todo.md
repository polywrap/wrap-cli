# Architecture
- WrapPackage
  - WasmWrapper (ExternPackage)(Invokable)
  - InterfaceWrapper (ExternWrapper)
  - PluginWrapper (Invokable) 
- ExternPackage


- WrapPackage (manifest, uri)
  - WasmWrapPackage
  - PluginWrapPackage (createInstance)
  - InterfaceWrapPackage

Wrapper {
  getManifest() -> version, type, name, abi
}

x Invokable {
  invoke(options, client)
}

WrapPackage {
  manifest,
  uri
}

ExternPackage: WrapPackage {
  getFile() -> wrap.wasm, polywrap.meta.json
}

plugins: [
  ethereumPluginPackage(config),
  {
    uri: "custom.uri...uri",
    package: ipfsPluginPackage(config)
  }
]

1- update invocation to support wrap.info instead of polywrap.json
2- update uri resolvers to search for wrap.info
3- 
