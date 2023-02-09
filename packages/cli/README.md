# The Polywrap CLI (`polywrap`)

<a href="https://www.npmjs.com/package/polywrap" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/polywrap.svg" alt="npm"/>
</a>

<br/>
<br/>

A command-line interface for building and deploying Polywrap projects.


## Prerequisites

### Docker

[Docker](https://www.docker.com/) is required to perform some tasks, including to `build` Wasm wrappers.
Linux users will also need to install [Docker Compose](https://docs.docker.com/compose/install/).
Docker is free for personal use. Once Docker is installed and enabled, you're ready to go!

### Cue

The `polywrap run` command can validate runs by examining `stdout` output using **Cue**. If you need to run workflow validations, you will have to install Cue.

You can install Cue by following the instructions found [here](https://cuelang.org/docs/install/).

## Installation

Within a single project:

```bash
npm install --save-dev polywrap
```

Globally:

```bash
npm install -g polywrap
```

Alternatively, `polywrap` can be run without installation:

```bash
npx polywrap
```

## Commands

### `help` command and `--help` option

To list available commands, use the `help` command or the `-h, --help` option:

```bash
polywrap help
polywrap --help
```

Alternatively, you can use the `-h, --help` option within any command to get a full list of available subcommands, arguments and options.

```bash
polywrap create --help
polywrap codegen --help
```

### `build | b`

Build Wasm and Interface Polywrap projects.

This outputs the project's ABI schema (Wasm and Interface) and binary package (Wasm) into the `./build` directory.

Currently, `build` can be run for Wasm, Plugin and Interface projects.

#### Options
- `-m, --manifest-file <path>`
  Specify your project's manifest file.
  By default, `build` searches for `polywrap.yaml`.

- `-o, --output-dir <path>`
  Specify an alternative directory for build output.
  The default codegen output directory is `./build`.

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

- `--wrapper-envs <envs-path>`
  Configure wrapper environment values using the provided file.

- `--codegen`
  Perform codegen before building.
  By default, `build` doesn't perform a `codegen` step before building your Project. This option includes this step. This is especially useful when used in conjunction with the `--watch` option.

- `-s, --strategy <strategy>`
  Specify which build strategy to use. By default, the `vm` build strategy is used.
  Available strategies:
  - `vm`: Uses Docker only for the source building part of the build process. At build time, it pulls a pre-built image with all necessary system dependencies, env vars and runtime; and it instantiates a Docker container with it. The Docker container instantiates bind-mounts (volumes) to copy the sources and dependencies from the host, build the sources inside the container, and copy the build artifacts back to the host machine. This approach ensures that the sources will be built in a reproducible environment but it doesn't use Docker for anything else and no image is built at runtime.
  - `image`: Implies building a Docker image at runtime, where dependencies are installed and sources are copied and built as Dockerfile instructions. On subsequent builds, Docker tries to reuse cached image layers and rebuild accordingly. This approach is notably slow but the complete process happens in Docker, and can be reproduced, examined and audited layer by layer (from dependency installation to build artifacts output).
  - `local` - Does not use Docker at all. It simply executes a .sh file that contains the necessary instructions to install dependencies and build sources. While this is the fastest way of building, it requires you, the user, to have all prerequisite system dependencies installed. In addition, given that sources are built on the host machine and not a reproducible docker environment, reproducibility isn't guaranteed.

- `-w, --watch`
  Watch the Project's files and automatically rebuild when a file is changed.

### `codegen | g`

Generate code bindings for Polywrap projects.

This command generates types and bindings for your project based on your project's schema (found in `schema.graphql`).

Currently, `codegen` can be run for App, Plugin and Wasm projects.

#### Options
- `-m, --manifest-file <path>`
  Specify your project's manifest file.
  By default, `docgen` searches for `polywrap.yaml`.
  
- `-g, --codegen-dir <path>`
  Specify an alternative directory for codegen output.
  The default codegen output directory is `./wrap`.
  
- `-p, --publish-dir <path>`
  Output path for the built schema and manifest (default: `./build`)
  This only applies when running `codegen` for Plugin Projects.

- `-s, --script <path>`
  Path to a custom generation script (JavaScript | TypeScript).
  This script is run in place of the standard codegen script if provided.

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

- `--wrapper-envs <envs-path>`
  Configure wrapper environment values using the provided file.

### `create | c`

Create a Polywrap project.

This command sets up a basic Polywrap-enabled project based on a pre-defined template.

#### Subcommands

`polywrap create wasm <language> <name>`

Set up a Polywrap WASM Wrapper or Interface project.

`polywrap create app <language> <name>`

Set up a NodeJS or React application which uses the Polywrap Client to invoke wrappers.

`polywrap create plugin <language> <name>`

Set up a Polywrap Plugin project used to provide the Polywrap Cient with additional functionality.

#### Arguments

All subcommands share the following arguments:

- `language` (required)
  The type/language of the created project

- `name` (required)
  The project name.

#### Options

All subcommands share the following options:

- `-o, --output-dir <path>`
  Specifies a custom output directory for the created project.

#### Sample usage

```bash
# Create a wrapper project using assemblyscript called "my-wrapper"
polywrap create wasm assemblyscript my-wrapper

# Create an interface project using assemblyscript called "my-project"
polywrap create wasm interface my-interface

# Create a React app project using Typescript called "my-react-app"
polywrap create app typescript-react my-react-app

# Create a Plugin wrapper project using Typescript called "my-plugin"
polywrap create plugin typescript my-plugin
```

### `deploy | d`

Deploy Polywrap projects.

```bash
polywrap deploy
```

`deploy` reads the Deploy manifest (`polywrap.deploy.yaml` by default) and executes the jobs and steps listed inside.

For more information on the Deploy command and the Deploy manifest, see [Configure Polywrap deployment pipeline](https://docs.polywrap.io/quick-start/build-and-deploy-wasm-wrappers/deploy-pipeline).

#### Options
- `-m, --manifest-file <path>`
  Specify your project's manifest file.
  By default, `deploy` searches for `polywrap.yaml`.

- `-o, --output-file <path>`
  Output file path for the deploy result

### `infra | i`

Modular Infrastructure-As-Code Orchestrator

```bash
polywrap infra <action> [options]
```

The `infra` command is used to set up infrastructure to test and deploy your wrappers locally.

For more information on the `infra` command and how to create your own Infra modules, see [Configure Polywrap infrastructure pipeline](https://docs.polywrap.io/quick-start/test-wasm-wrappers/infra-pipeline)

#### Arguments
- `action` (required)
  Infra allows you to execute the following actions:
  - `up`
    Start Polywrap infrastructure
  - `down`
    Stop Polywrap infrastructure
  - `config`
    Validate and display Polywrap infrastructure's bundled docker-compose manifest
  - `vars`
    Show Polywrap infrastructure's required .env variables

#### Options
- `-m, --manifest-file <path>`
  Specify the `infra` extension manifest file.
  By default, `infra` searches for `polywrap.infra.yaml`.

- `-o, --modules <module, module>`
  Use only specified modules

#### Defaults

Polywrap comes with a default `eth-ens-ipfs` module which can be used to test your wrappers locally:

```
polywrap infra up --modules=eth-ens-ipfs
```

The default infrastructure module defines a docker container with:

- A test server at http://localhost:4040
- A Ganache Ethereum test network at http://localhost:8545
- An IPFS node at http://localhost:5001

It also sets up ENS smart contracts at initialization, so you can build wrappers and deploy them to an ENS registry on your locally hosted testnet.

Addresses for the components of ENS:
- Registry: `0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`
- Resolver: `0x5b1869D9A4C187F2EAa108f3062412ecf0526b24`
- Registrar: `0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb`
- Reverse Registrar: `0xe982E462b094850F12AF94d21D470e21bE9D0E9C`

### `test | t`

Run Test manifests. 

The `test` command executes a series of Wrapper invocations called **steps** organized into **jobs**.
All steps within a job are run in series, while jobs are run in parallel.

```bash
polywrap test [options]
```

#### Options
- `-m, --manifest-file <path>`
  Specify the Workflow extension manifest file.
  By default, `run` searches for `polywrap.test.yaml`.

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

- `--wrapper-envs <envs-path>`
  Configure wrapper environment values using the provided file.

- `-o, --output-file <output-file-path>`
  Specify the output file path for the workflow result

- `-j, --jobs <jobs...>`
  Specify ids of jobs that you want to run

#### The Test manifest (`polywrap.test.yaml`)
Basic structure:

```yaml
# The basic structure of a test file 
name: my-test-name #the name of the test
format: 0.1.0
validation: "path/to/validator.cue" #(optional) path to a validator file (cuelang)
jobs:
  first:
    steps: #each step is a wrapper invocation that consists of a URI, the invoked method and its arguments
    - uri: ens/example.eth
      method: helloWorld
      args:
        arg1: "test"
        ...
    - ...
    jobs: #after all job steps are executed, additional jobs can be run in parallel
      ...
  second:
    ...
```

`jobs` is a map of `<string, Job>`, the key being each Job's name.

```yaml
jobs:
  helloWorld:
    ...
  helloPolywrap:
    ...
```

Each Job consists of two properties:
  - a `steps` collection
    - This is a wrapper invocation, consisting of:
      - `uri` - the WRAP URI of the wrapper
      - `method` - the name of the invoked wrapper method
      - `args` (optional) - a map of the invoked method's arguments
      - `config` (optional) - a map of client config properties to be added/overridden
  - an inner `jobs` map, making the structure of `Job` recursive.

```yaml
jobs:
  helloWorld:
    steps:
    - uri: ens/helloworld.polywrap.eth #ENS URI
      method: helloWorld
      args:
        name: test
    - uri: fs/./hello-polywrap/build #Filesystem URI
      method: helloPolywrap
    jobs:
      innerJob1:
      ...
      innerJob2:
      ...
  helloPolywrap:
    steps:
    ...
    jobs:
    ...
```

When running a Test manifest, all top-level Jobs are run in parallel. Within those Jobs, each step is run in series. After all steps for a Job have been run, the inner `jobs` are run in parallel, with their `steps` run in series, and so on.

You can reference the result (`data`/`error`) of any step by using the `$` symbol:

```yaml
jobs:
  helloWorld:
    steps:
    - uri: ens/helloworld.polywrap.eth #ENS URI
      method: helloWorld
      args:
        name: test
    - uri: fs/./hello-polywrap/build #Filesystem URI
      method: helloPolywrap
    jobs:
      innerJob1:
        steps:
        - uri: ens/helloworld.polywrap.eth
          method: helloWorld
          args:
            name: "$helloWorld.1.data" #Reference to `helloWorld`'s 2nd step return value
        jobs:
          innerJob11:
            steps:
            - uri: ens/helloworld.polywrap.eth
              method: helloWorld
              args:
                name: "$helloWorld.innerJob1.0.error" #Reference to helloWorld's innerJob1 1st step error
```

#### Test validation

By specifying a `validation` file within your Test manifest, the result of the run will be validated using `cue`.

Example of a validation file:

```cuelang
helloWorld: {
  $0: {
    data: "Hello test!",
    error?: _|_, // Never fails
  }
  $1: {
    data: "Hello Polywrap!",
    error?: _|_, // Never fails
  }
  innerJob1: {
    $0: {
      data: "Hello Hello test!!",
      error?: _|_,
    }
  }
}
```

### `docgen | o`

Generate wrapper documentation for your project.

```bash
polywrap docgen <action>
```

#### Arguments

- `action` (required)
  Specifies the kind of documentation generated.
  Values:
  - `schema`
    Generates GraphQL-like schema for your project.
  - `docusaurus`
    Generates Docusaurus markdown for your project.
  - `jsdoc`
    Generates JSDoc markdown for your project.

#### Options
- `-m, --manifest-file <path>`
  Specify your project's manifest file.
  By default, `docgen` searches for `polywrap.yaml`.

- `-g, --docgen-dir <path>`
  Specify the output directory for generated docs.
  By default, `./docs` is used.

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

- `--wrapper-envs <envs-path>`
  Configure wrapper environment values using the provided file.

- `-i, --imports`
  Generate docs for your project's dependencies as well.

### `manifest | m`

Inspect and migrate Polywrap manifests.

#### Subcommands

#### `schema | s`

Output the schema for any of your Project or Extension manifests. 

Usage:
```bash
# Output schema for the current project manifest (polywrap.yaml)
polywrap manifest schema
```

##### Arguments

- `type`
  The type of the manifest file. The default value for `type` is `project`.
  
##### Options

- `-r, --raw`
  Output the full JSON Schema for the given manifest.
  
- `-m, --manifest-file <path>`
  The manifest file for which the schema will be rendered. The `type` argument determines the default manifest file used.
  For example, `polywrap manifest schema build` will use `polywrap.build.yaml` as its default manifest file.

#### `migrate | m`

Migrate a Project or Extension manifest file to the the latest version, or a version specified.

Usage:
```bash
# Migrate the current project manifest (polywrap.yaml)
polywrap manifest migrate
```
##### Arguments

- `type`
  The type of the manifest file. The default value for `type` is `project`.

##### Options
- `-f, --format <format>`
  Migrate to a specific format instead of the latest.
  
  Example:
  ```bash
  # Migrate the current project manfiest to format 0.2.0
  polywrap manifest migrate -f 0.2.0
  # or
  polywrap m m -f 0.2.0
  ```

- `-m, --manifest-file <path>`
  The manifest file for which the schema will be rendered. The `type` argument determines the default manifest file used.
  For example, `polywrap manifest migrate build` will use `polywrap.build.yaml` as its default manifest file.
  
  Example:
  ```bash
  # Migrate "custom-manifest.yaml" to the latest format
  polywrap manifest migrate -m custom-manifest.yaml
  # or
  polywrap m m -m custom-manifest.yaml
  ```

### The `-c, --client-config` option

The `build`, `codegen`, `docgen` and `test` commands allow the user to configure the Polywrap Client via the `-c, --client-config <config-path>` option.

You can supply a path to a Javascript or Typescript module which exports a function named `getClientConfig`:

```typescript
// asynchronous option
export async function getClientConfig(
  defaultConfigs: Partial<PolywrapClientConfig>
): Promise<Partial<PolywrapClientConfig>>

// synchronous option
export function getClientConfig(
  defaultConfigs: Partial<PolywrapClientConfig>
): Partial<PolywrapClientConfig>
```

### The `--wrapper-envs` option
All commands which support the `-c, --client-config` option also support the `--wrapper-envs <envs-path>` option.
This option allows the user to set environment values for Wrappers using a simple YAML or JSON file.

For example, if you would like to change the API key used within the Ethereum plugin wrapper, you can create a `envs.yaml` file:

```yaml
ens/ethereum.polywrap.eth:
  connection:
    node: https://mainnet.infura.io/v3/YOUR_API_KEY # Use Infura with your API key
    networkNameOrChainId: mainnet
```

You can then run the `build`, `codegen`, `docgen` and `test` and specify your custom `--wrapper-envs`:

```bash
polywrap codegen --wrapper-envs envs.yaml
```

You can also pass environment variables into the wrappper-envs file by using `$`:

```yaml
ens/ethereum.polywrap.eth:
  connection:
    node: $MY_INFURA_NODE # Use environment variable called MY_INFURA_NODE
    networkNameOrChainId: mainnet
```

If you need to use the `$` sign within your wrapper-envs file, you can escape it using `$$`.

## Logging

By default, the Polywrap CLI outputs all of its messages to the console.

### Logging levels
Different levels of output verbosity are supported by using the following options:

- `-v, --verbose`
  Enables logging of informational messages in addition to standard output.

- `-q, --quiet`
  Disables ALL logging. Overrides the `--verbose` option.

### Logging to a file
You can also tell the Polywrap CLI to save its output to a logfile using the `-l, --log-file [path]` option.

Specifying the `-l` option without a `path` parameter will create a log file within the `./.polywrap/logs` directory.

```bash
# Output will be saved to the "./.polywrap/logs" directory
polywrap codegen -l
```

Alternatively, you can specify your own log file path.

```bash
# Output will be saved to "my-log-file.log"
polywrap codegen -l my-log-file.log
```