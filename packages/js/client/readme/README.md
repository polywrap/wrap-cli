# @polywrap/client-js
<a href="https://www.npmjs.com/package/@polywrap/client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap client extends the PolywrapCoreClient to provide UX features, such as an additional constructor and additional configuration options.

## Installation

```bash
npm install --save @polywrap/client-js
```

## Usage

### Instantiate

Use the PolywrapClient [constructor](#constructor) to instantiate the client with the default configuration bundle.

```ts
$snippet: quickstart-instantiate
```

### Configure

Use the `@polywrap/client-config-builder-js` package to build a custom configuration for your project.

```ts
$snippet: quickstart-configure
```

### Invoke

Invoke a wrapper.

```ts
$snippet: quickstart-invoke
```

# Reference

## Configuration

Below you will find a reference of object definitions which can be used to configure the Polywrap client. Please note that the intended way of configuring the client is to use the `ClientConfigBuilder`, as explained above.

### ClientConfig
```ts
$snippet: ClientConfig
```

### PolywrapClientConfig
```ts
$snippet: PolywrapClientConfig
```

## PolywrapClient

### Constructor
```ts
$snippet: PolywrapClient-constructor
```