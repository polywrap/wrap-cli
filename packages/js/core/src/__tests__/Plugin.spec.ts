import {
  Client,
  Plugin,
  PluginModules,
  PluginManifest,
  Uri,
  createSchemaDocument
} from "..";

const testPluginManifest: PluginManifest = {
  schema: createSchemaDocument(`
    type Query {
      testQuery: Number!
    }

    type Mutation {
      testMutation: Boolean!
    }
  `),
  imported: [new Uri("host/path")],
  implemented: [new Uri("host2/path2")]
}

class TestPlugin extends Plugin {
  public getModules(client: Client): PluginModules {
    return {
      query: {
        testQuery: (input: any, client: Client): number => {
          return 5;
        }
      },
      mutation: {
        testMutation: (input: any, client: Client): Promise<boolean> => {
          return Promise.resolve(true);
        }
      }
    }
  }
}

describe("Plugin", () => {
  const plugin = new TestPlugin();

  it("sanity", () => {
    const modules = plugin.getModules({} as any);

    expect(modules.mutation).toBeTruthy();
    expect(modules.mutation.testMutation).toBeTruthy();
  });
});
