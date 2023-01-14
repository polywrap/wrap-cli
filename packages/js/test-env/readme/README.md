# @polywrap/test-env-js

Provides functions to setup a test environment with Polywrap CLI and Docker.

# Description

It allows user to initiate the test environment through a javascript function (it's the `infra` command in the CLI). It also exports the providers and ens addresses expected in the deployments (They are hard coded, because the initiation of the environment is deterministic)

# Usage

## Init test env

Spin up docker containers for Ganache and IPFS.

``` typescript
$snippet: quickstart-init
```

## Stop test env

Stop docker containers for Ganache and IPFS.

``` typescript
$snippet: quickstart-stop
```

## Build a wrapper

Build a local wrapper project.

``` typescript
$snippet: quickstart-build
```

## Execute the CLI

Execute a command with the Polywrap CLI.

``` typescript
$snippet: quickstart-runCLI
```

## Constants

### providers

```typescript
$snippet: providers
```

### ensAddresses

```typescript
$snippet: ensAddresses
```

### embeddedWrappers

```typescript
$snippet: embeddedWrappers
```

## Methods

### initTestEnvironment

```typescript
$snippet: initTestEnvironment
```

### stopTestEnvironment

```typescript
$snippet: stopTestEnvironment
```

### buildWrapper

```typescript
$snippet: buildWrapper
```

### buildAndDeployWrapper

```typescript
$snippet: buildAndDeployWrapper
```

### buildAndDeployWrapperToHttp

```typescript
$snippet: buildAndDeployWrapperToHttp
```

### runCLI

```typescript
$snippet: runCLI
```