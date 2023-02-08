import {
  CoreClient,
  IUriResolutionContext,
  IUriResolver,
  Result,
  Uri,
  UriPackageOrWrapper,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "./helpers/expectHistory";
import { RequestSynchronizerResolver } from "../cache";
import { UriResolutionResult } from "../helpers";
import { PolywrapCoreClient } from "@polywrap/core-client-js";

jest.setTimeout(200000);

class SimpleAsyncRedirectResolver implements IUriResolver<Error> {
  async tryResolveUri(uri: Uri, client: CoreClient, resolutionContext: IUriResolutionContext): Promise<Result<UriPackageOrWrapper, Error>> {
    switch(uri.uri) {
      case "wrap://test/should-redirect":
        return new Promise<Result<UriPackageOrWrapper, Error>>(resolve => {
          setTimeout(() => {
            const result = UriResolutionResult.ok(new Uri("wrap://test/redirected"));

            resolutionContext.trackStep({
              sourceUri: uri,
              result,
              description: "SimpleAsyncRedirectResolver",
            });

            resolve(result);
          }, 100);
        });
      case "wrap://test/should-error":
        return new Promise<Result<UriPackageOrWrapper, Error>>(resolve => {
          setTimeout(() => {
            const result = UriResolutionResult.err(new Error("Test resolution error"));

            resolutionContext.trackStep({
              sourceUri: uri,
              result,
              description: "SimpleAsyncRedirectResolver",
            });

            resolve(result);
          }, 100);
        });
      case "wrap://test/should-error-2":
        return new Promise<Result<UriPackageOrWrapper, Error>>(resolve => {
          setTimeout(() => {
            const result = UriResolutionResult.err(new Error("Test resolution error 2"));

            resolutionContext.trackStep({
              sourceUri: uri,
              result,
              description: "SimpleAsyncRedirectResolver",
            });

            resolve(result);
          }, 100);
        });
      case "wrap://test/should-throw":
        return new Promise<Result<UriPackageOrWrapper, Error>>((_, reject) => {
          setTimeout(() => {
            reject(new Error("Test thrown exception"));
          }, 100);
        });
      default:
        throw new Error(`Unexpected URI: ${uri.uri}`);
    }
  }
}

describe("RequestSynchronizerResolver", () => {

  it("parallel requests with same uri trigger only one network request", async () => {
    const uri = new Uri("wrap://test/should-redirect");

    const client = new PolywrapCoreClient({
      resolver: RequestSynchronizerResolver.from(
        new SimpleAsyncRedirectResolver()
      )
    });

    const invocations: Promise<Result<UriPackageOrWrapper, unknown>>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri, resolutionContext });
      invocations.push(result);
      resolutionContexts.push(resolutionContext);
    }

    const resolutionResults = await Promise.all(invocations);

    let foundFirst = false;

    for (let i = 0; i < invocations.length; i++) {
      const result = resolutionResults[i];
      const resolutionContext = resolutionContexts[i];

      if (!result.ok) throw result.error;

      if (!foundFirst) {
        await expectHistory(
          resolutionContext.getHistory(),
          "synchronizer-without-cache"
        );
        expect(result.value.type).toEqual("uri");
        foundFirst = true;
        continue;
      }

      await expectHistory(
        resolutionContext.getHistory(),
        "synchronizer-with-cache"
      );

      expect(result.value.type).toEqual("uri");
    }
  });

  it("serial requests trigger multiple network requests", async () => {
    const uri = new Uri("wrap://test/should-redirect");

    const client = new PolywrapCoreClient({
      resolver: RequestSynchronizerResolver.from(
        new SimpleAsyncRedirectResolver()
      )
    });

    const resolutionResults: Result<UriPackageOrWrapper, unknown>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = await client.tryResolveUri({ uri, resolutionContext });
      resolutionResults.push(result);
      resolutionContexts.push(resolutionContext);
    }

    for (let i = 0; i < resolutionResults.length; i++) {
      const result = resolutionResults[i];
      const resolutionContext = resolutionContexts[i];

      if (!result.ok) throw result.error;

      await expectHistory(
        resolutionContext.getHistory(),
        "synchronizer-without-cache"
      );
      expect(result.value.type).toEqual("uri");
    }
  });

  it("parallel requests resulting in a thrown exception also throw", async () => {
    const uri = new Uri("wrap://test/should-throw");

    const client = new PolywrapCoreClient({
      resolver: RequestSynchronizerResolver.from(
        new SimpleAsyncRedirectResolver()
      )
    });

    const invocations: Promise<void>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri, resolutionContext });
      invocations.push(new Promise<void>(resolve => {
        result.then((r: unknown) => {
          throw new Error("Should not have resolved");
        }, (e: Error) => {
          expect(e.message).toEqual("Test thrown exception");
          resolve();
        })
      }));
      resolutionContexts.push(resolutionContext);
    }

    await Promise.all(invocations);
  });

  it("parallel requests resulting in a resolution error trigger multiple resolutions by default", async () => {
    const uri = new Uri("wrap://test/should-error");

    const client = new PolywrapCoreClient({
      resolver: RequestSynchronizerResolver.from(
        new SimpleAsyncRedirectResolver()
      )
    });

    const invocations: Promise<Result<UriPackageOrWrapper, unknown>>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri, resolutionContext });
      invocations.push(result);
      resolutionContexts.push(resolutionContext);
    }

    const resolutionResults = await Promise.all(invocations);

    for (let i = 0; i < invocations.length; i++) {
      const result = resolutionResults[i];
      const resolutionContext = resolutionContexts[i];

      await expectHistory(
        resolutionContext.getHistory(),
        "synchronizer-with-error-without-cache"
      );
      expect(result.ok).toBeFalsy();
    }
  });

  it("parallel requests resulting in a resolution error respect shouldUseCache", async () => {
    const client = new PolywrapCoreClient({
      resolver: RequestSynchronizerResolver.from(
        new SimpleAsyncRedirectResolver(),
        { 
          shouldUseCache: (error: Error) => {
            if (error.message === "Test resolution error") return false;
            return true;
          } 
        }
      )
    });

    // shouldUseCache is false, so this should retry (act without using cache)
    const uri = new Uri("wrap://test/should-error");
    const invocations: Promise<Result<UriPackageOrWrapper, unknown>>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri, resolutionContext });
      invocations.push(result);
      resolutionContexts.push(resolutionContext);
    }

    const resolutionResults = await Promise.all(invocations);

    for (let i = 0; i < invocations.length; i++) {
      const result = resolutionResults[i];
      const resolutionContext = resolutionContexts[i];

      await expectHistory(
        resolutionContext.getHistory(),
        "synchronizer-with-error-without-cache"
      );
      expect(result.ok).toBeFalsy();
    }

    // shouldUseCache is truthy, so this should not retry (use the error from cache)
    const uri2 = new Uri("wrap://test/should-error-2");
    const invocations2: Promise<Result<UriPackageOrWrapper, unknown>>[] = [];
    const resolutionContexts2: IUriResolutionContext[] = []

    for (let i = 0; i < 3; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri: uri2, resolutionContext });
      invocations.push(result);
      resolutionContexts.push(resolutionContext);
    }

    const resolutionResults2 = await Promise.all(invocations);

    let foundFirst = false;

    for (let i = 0; i < invocations2.length; i++) {
      const result = resolutionResults2[i];
      const resolutionContext = resolutionContexts2[i];

      if (!foundFirst) {
        await expectHistory(
          resolutionContext.getHistory(),
          "synchronizer-with-error-without-cache"
        );
        expect(result.ok).toBeFalsy();
        foundFirst = true;
        continue;
      }

      await expectHistory(
        resolutionContext.getHistory(),
        "synchronizer-with-error-and-cache"
      );
      expect(result.ok).toBeFalsy();
    }
  });
});
