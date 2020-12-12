export { UINT8ARRAY_ID } from "../";

import { IPFS } from "../";

describe("IPFS API Sanity Checks", () => {
  it("IPFS.add(data)", () => {
    const data = "Hello IPFS!";

    const hash = IPFS.add(data);

    expect(hash).toBe(data);
  });

  it("IPFS.cat(hash)", () => {
    const hash = "QmTEST";

    const data = IPFS.cat(hash);

    expect(data).toStrictEqual(hash);
  });
});
