---
id: 'understanding-uris'
title: Understanding URIs
---

Deployed wrappers are identified using custom URIs ([Uniform Resource Identifier](http://www.ltg.ed.ac.uk/~ht/WhatAreURIs/)). For example:

```
ens/api.helloworld.polywrap.eth
```

Polywrap URIs have 2 parts:

**Authority:**  
For example `ens/` for resolving ENS domains, or `ipfs/` for resolving IPFS content.

**Path:**  
For example `api.domain.eth` for an ENS domain, or `QmaLbZnnnHbcRRo3wNBQ2MhugmBGL9R2YYeBvj6Nk2QumP` for an IPFS file/directory.

:::tip
`ens/` and `ipfs/` URI resolution is supported in all Polywrap clients by default. Adding custom URI resolvers is possible. More documentation on how to do this will be released soon.
:::
