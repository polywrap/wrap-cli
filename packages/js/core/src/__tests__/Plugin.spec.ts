import {
  Client,
  Plugin,
  PluginModules,
  Uri
} from "../";

class TestPlugin extends Plugin {
  constructor() {
    super({
      imported: [new Uri("host/path")],
      implemented: [new Uri("host2/path2")]
    });
  }

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

class EmptyPlugin extends Plugin {
  constructor() {
    super({});
  }

  getModules() {
    return {}
  }
}

describe("Plugin", () => {
  const plugin = new TestPlugin();
  const empty = new EmptyPlugin();

  it("isImplemented", () => {
    expect(plugin.isImplemented(new Uri("host2/path2"))).toBeTruthy();
  });

  it("implemented", () => {
    expect(plugin.implemented()).toMatchObject([new Uri("host2/path2")]);
  });

  it("imported", () => {
    expect(plugin.imported()).toMatchObject([new Uri("host/path")]);
  });

  it("empty plugin returns an empty implemented array", () => {
    expect(empty.implemented()).toMatchObject([]);
  });

  it("empty plugin returns an empty imported array", () => {
    expect(empty.imported()).toMatchObject([]);
  });
});
