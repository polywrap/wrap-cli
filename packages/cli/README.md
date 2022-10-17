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

Alternatively, you can use the help command or option within any command to get a full list of available subcommands, arguments and options.

```bash
polywrap create help
polywrap create --help
```

### `build | b`

Build Wasm and Interface Polywrap projects.
This outputs the project's ABI schema (Wasm and Interface) and binary package (Wasm) into the `./build` directory.

#### Options
- `-m, --manifest-file <path>`
  Specify your project's manifest file.
  By default, `build` searches for `polywrap.yaml`.

- `-o, --output-dir <path>`
  Specify an alternative directory for build output.
  The default codegen output directory is `./build`.

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

- `-n, --no-codegen`
  Don't perform codegen before building.
  By default, `build` performs a `codegen` step before building your Project. This option skips this step. This is especially useful when you are testing manual changes to your types/bindings.

- `-s, --strategy <strategy>`
  Specify which build strategy to use. By default, the `vm` build strategy is used.
  Available strategies:
  - `vm`: Uses Docker only for the source building part of the build process. At build time, it pulls a pre-built image with all necessary system dependencies, env vars and runtime; and it instantiates a Docker container with it. The Docker container instantiates bind-mounts (volumes) to copy the sources and dependencies from the host, build the sources inside the container, and copy the build artifacts back to the host machine. This approach ensures that the sources will be built in a reproducible environment but it doesn't use Docker for anything else and no image is built at runtime.
  - `image`: Implies building a Docker image at runtime, where dependencies are installed and sources are copied and built as Dockerfile instructions. On subsequent builds, Docker tries to reuse cached image layers and rebuild accordingly. This approach is notably slow but the complete process happens in Docker, and can be reproduced, examined and audited layer by layer (from dependency installation to build artifacts output).
  - `local` - does not use Docker at all. It simply executes a .sh file that contains the necessary instructions to install dependencies and build sources. While this is the fastest way of building, it requires you, the user, to have all prerequisite system dependencies installed. In addition, given that sources are built on the host machine and not a reproducible docker environment, reproducibility isn't guaranteed.

- `-w, --watch`
  Watch the Project's files and automatically rebuild when a file is changed.

### `codegen | g`

Generate code bindings for Polywrap projects.

This command generates types and bindings for your project based on your project's schema (found in `schema.graphql`).

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
  **TODO: Add details about the custom codegen script**

- `-c, --client-config <config-path>`
  Use a custom Polywrap Client configuration.

#### Special note

When running `codegen` for Plugin Projects, the Polywrap CLI will also output an ABI schema for your plugin into the `./build` directory. You can override this output directory by specifying `-p, --publish-dir <path>`.

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

**TODO: Add documentation**


### `infra | i`

Modular Infrastructure-As-Code Orchestrator

**TODO: Add documentation**

### `run | r`

Run Workflows

**TODO: Add documentation**

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

## Logging

By default, the Polywrap CLI outputs all of its messages to the console.
Different levels of output verbosity are supported by using the following options:

- `-v, --verbose`
  Enables logging of informational messages in addition to standard output.

- `-q, --quiet`
  Disables ALL logging. Overrides the `--verbose` option.


### 

### `-q`

https://docs.polywrap.io/reference/cli/polywrap-cli

## Examples

Demos:  
https://github.com/polywrap/demos

Integrations:  
https://github.com/polywrap/integrations
