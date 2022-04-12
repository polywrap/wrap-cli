/* eslint-disable @typescript-eslint/no-require-imports */
import { Uri } from "@web3api/core-js";

export interface Deployer {
  execute(uri: Uri, config?: unknown): Promise<Uri>;
}

interface List {
  name: string;
  children: List[];
}

interface ResultList {
  name: string;
  result: string;
  children: ResultList[];
}

interface Handler {
  addNext(handler: Handler): void;
  handle(params: Uri): Promise<Uri[]>;
}

abstract class AbstractHandler implements Handler {
  private nextHandlers: AbstractHandler[] = [];
  protected result: string;

  constructor(public name: string) {}

  public addNext(handler: AbstractHandler): void {
    this.nextHandlers.push(handler);
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

  public getResultsList(): ResultList {
    return {
      name: this.name,
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
    const nextUri = await this.deployer.execute(uri, this.config);
    this.result = nextUri.toString();
    return [nextUri, ...(await super.handle(nextUri))];
  }
}
