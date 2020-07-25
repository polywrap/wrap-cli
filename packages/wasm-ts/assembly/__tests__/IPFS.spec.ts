import {
  IPFS,
  Buffer
} from "../";

describe("IPFS API Sanity Checks", () => {
  it("IPFS.add(data)", () => {
    const data = "Hello IPFS!";

    const hash = IPFS.add(
      Buffer.fromString(data)
    );

    expect(hash).toBe(data);
  });

  it("IPFS.get(hash)", () => {
    const hash = "QmTEST";

    const data = IPFS.add(
      Buffer.fromString(hash)
    );

    expect(data).toBe(hash);
  });
})
