/* eslint-disable @typescript-eslint/no-require-imports */
import { DirectoryBlob } from "./file";

export interface Deployer {
  deploy(buildDirBlob: DirectoryBlob, config?: unknown): Promise<string>;
}

export interface Publisher {
  publish(cid: string, config?: unknown): Promise<string>;
}

interface Handler {
  addNext(handler: Handler): void;
  handle(params: string): Promise<string[]>;
}

abstract class AbstractHandler implements Handler {
  private nextHandlers: Handler[] = [];

  public addNext(handler: Handler): void {
    this.nextHandlers.push(handler);
  }

  public async handle(uri: string): Promise<string[]> {
    const uris: string[][] = [];
    for await (const handler of this.nextHandlers) {
      uris.push(await handler.handle(uri));
    }

    return uris.flat();
  }
}

export class PublishHandler extends AbstractHandler {
  constructor(private publisher: Publisher, private config: unknown) {
    super();
  }

  public async handle(uri: string): Promise<string[]> {
    const nextUri = await this.publisher.publish(uri, this.config);
    return await super.handle(nextUri);
  }
}
