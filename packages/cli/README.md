# Polywrap CLI (polywrap)

A command-line utility for building and deploying Polywrap projects.

# Usage

``` shell
npx polywrap --help

```

|                               |                                        |
|-------------------------------|----------------------------------------|
| app \| a                      | Build/generate types for your app      |
| build \| b [options]          | Builds a wrapper                       |
| codegen \| g [options]        | Auto-generate Wrapper Types            |
| create \| c                   | Create a new project with polywrap CLI |
| deploy \| d [options]         | Deploys/Publishes a Polywrap           |
| plugin \| p                   | Build/generate types for the plugin    |
| infra \| i [options] <action> | Manage infrastructure for your wrapper |
| run \| r [options] <workflow> | Runs workflow script                   |
| help [command]                | display help for command               |

# Workflows

The CLI provides a "run" command which a workflow script and performs a chain of actions with multiple wrappers. For detailed examples see `src/__tests__/e2e/run.spec.ts`.

# TODO:
  - introduce high level usages (create, build, test, publish)
  - type --help for full usage
  - [Getting Started Video](link)
  - [generated documentation](link)

^^^
Make sure this is a "self documenting" process. This way we don't have to update as the tool's features changes over time.
