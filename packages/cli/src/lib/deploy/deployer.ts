/* eslint-disable @typescript-eslint/no-require-imports */
import { AsciiTree } from "./asciiTree";

import { Uri } from "@polywrap/core-js";

export interface Deployer {
  execute(uri: Uri, config?: unknown): Promise<Uri>;
}

interface List {
  name: string;
  children: List[];
}

export interface ResultList {
  name: string;
  input: {
    uri: string;
    config?: unknown;
  };
  result: string;
  children: ResultList[];
}

interface Handler {
  addNext(handler: Handler): void;
  handle(params: Uri): Promise<Uri[]>;
}

abstract class AbstractHandler implements Handler {
  private dependencyTree: AsciiTree;
  private nextHandlers: AbstractHandler[] = [];
  protected input: {
    uri: string;
    config?: unknown;
  };
  protected result: string;

  constructor(public name: string) {
    this.dependencyTree = new AsciiTree(this.name);
  }

  public addNext(handler: AbstractHandler): void {
    this.nextHandlers.push(handler);
    this.dependencyTree.add(handler.dependencyTree);
  }

  public async handle(uri: Uri): Promise<Uri[]> {
    const uris: Uri[][] = [];

    for await (const handler of this.nextHandlers) {
      uris.push(await handler.handle(uri));
    }

    return uris.flat();
  }

  public getList(): List {
    return {
      name: this.name,
      children: this.nextHandlers.map((n) => n.getList()),
    };
  }

  public getDependencyTree(): AsciiTree {
    return this.dependencyTree;
  }

  public getResultsList(): ResultList {
    return {
      name: this.name,
      input: this.input,
      result: this.result,
      children: this.nextHandlers.map((n) => n.getResultsList()),
    };
  }
}

export class DeployerHandler extends AbstractHandler {
  constructor(
    name: string,
    private deployer: Deployer,
    private config: unknown
  ) {
    super(name);
  }

  public async handle(uri: Uri): Promise<Uri[]> {
    console.info(
      `Executing stage: '${this.name}', with URI: '${uri.toString()}'`
    );

    try {
      this.input = {
        uri: uri.toString(),
        config: this.config,
      };
      const nextUri = await this.deployer.execute(uri, this.config);
      this.result = nextUri.toString();
      console.log(
        `%cSuccessfully executed stage '${this.name}'. Result: '${this.result}'`,
        "color: green"
      );
      return [nextUri, ...(await super.handle(nextUri))];
    } catch (e) {
      throw new Error(`Failed to execute stage '${this.name}'. Error: ${e}`);
    }
  }
}
