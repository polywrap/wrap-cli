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

Build Polywrap projects.

**TODO: Add documentation**

### `codegen | g`

Generate code bindings for Polywrap projects.

**TODO: Add documentation**

### `create | c`

Create a Polywrap project.

This command sets up a basic Polywrap-enabled project based on a pre-defined template.

#### Subcommands:

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

Generate wrapper documentation

**TODO: Add documentation**

### `manifest | m`

Inspect and migrate Polywrap manifests.

#### Subcommands:

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
