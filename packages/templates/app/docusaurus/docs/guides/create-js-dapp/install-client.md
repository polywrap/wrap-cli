---
id: 'install-client'
title: 'Installing the Polywrap JS client'
---

## **Introduction**

If you're a JavaScript developer building Browser, Node.js, or React based dApps, this guide is for you.

:::tip
In the future, JavaScript will be one of many supported languages. Our goal is to enable the use of Polywraps in every major programming language.
:::

By the end of this document, you'll gain the following skills:

- How to instantiate the Polywrap client in your JavaScript dApp
- Query any Polywrap using the Polywrap client
- Configure custom Polywrap URI redirects
- Build React dApps with ease

If you get stuck during this guide, send us a message on our [Discord](https://discord.com/invite/Z5m88a5qWu)!

## **Prerequisites**

As prerequisites for this guide, we recommend having familiarity with [TypeScript](https://www.typescriptlang.org/). [React](https://reactjs.org/) will also be used in the latter sections.

## **Installation**

To use Polywraps in your dApp, all you need is the Polywrap Client!

```
npm install --save @web3api/client-js
```

The Polywrap JavaScript Client works in both Node.js, and browser applications.

:::warning
Currently Chrome and Brave are the only supported browsers. This restriction will be removed very shortly.
:::

> The next section assumes that you're integrating Polywrap into an existing dApp project. If you want a quick start with our template project, simply run:
>
> ```bash
> npx @web3api/cli create app react <project-name>
> ```
>
> Where `<project-name>` is replaced with a custom name of your choosing. For example `my-web3api`.
>
> This command will create a new project folder with a "Hello World" dApp that
> lets you interact with a simple Polywrap at `ens/helloworld.web3api.eth`.
