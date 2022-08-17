import { Connections } from "../Connections";
import { Connection } from "../Connection";
import {
  providers,
} from "@polywrap/test-env-js";

jest.setTimeout(10000);

type BasicNetwork = "mainnet" | "rinkeby" | "ropsten" | "goerli" | "kovan";

const getRpcUri = (network: BasicNetwork): string => {
  return `https://${network}.infura.io/v3/d119148113c047ca90f0311ed729c466`;
}

describe("Connections Store", () => {
  let connections: Connections;
  let testnet: Connection;
  let goerli: Connection;


  beforeAll(async () => {
    // connections
    testnet = new Connection({ provider: providers.ethereum });
    goerli = new Connection({ provider: getRpcUri("goerli") });
    connections = new Connections({
      networks: { testnet, goerli },
      defaultNetwork: "testnet",
    });
  });


  test("get", async () => {
    expect(connections.get("testnet")).toBe(testnet);
    expect(connections.get("goerli")).toBe(goerli);
    expect(connections.get()).toBe(testnet);
    expect(connections.get("rinkeby")).toBeUndefined();
  });

  describe("set", () => {
    it("sets a new network", async () => {
      const kovan = new Connection({ provider: getRpcUri("kovan") });
      expect(connections.get("kovan")).toBeUndefined();
      connections.set("kovan", kovan);
      expect(connections.get("kovan")).toBe(kovan);
    });

    it("sets new network by passing provider directly", async () => {
      const rinkebyUri = getRpcUri("rinkeby");
      const rinkeby = new Connection({ provider: rinkebyUri});
      connections.set("rinkeby", rinkebyUri);
      expect(connections.get("rinkeby")).toStrictEqual(rinkeby);
    });

    it("replaces existing network", async () => {
      const ropsten = new Connection({ provider: getRpcUri("ropsten") });
      connections.set("existingNetwork", ropsten);
      expect(connections.get("existingNetwork")).toBe(ropsten);
      connections.set("existingNetwork", goerli);
      expect(connections.get("existingNetwork")).toBe(goerli);
    });
  });

  test("getDefaultNetwork", async () => {
    expect(connections.getDefaultNetwork()).toEqual("testnet");
  });

  describe("setDefaultNetwork", () => {
    it("replaces defaultNetwork with existing network", async () => {
      connections.setDefaultNetwork("goerli");
      expect(connections.getDefaultNetwork()).toEqual("goerli");
    });

    it("replaces default network by passing a new connection", async () => {
      connections.setDefaultNetwork("newDefault", goerli);
      expect(connections.getDefaultNetwork()).toEqual("newDefault");
      expect(connections.get("newDefault")).toBe(goerli);
    });
  });
});