import {
  IPFS,
  Buffer
} from "../";

describe("IPFS Standard API", () => {
  it("IPFS.add(...)", () => {
    const data = "Hello sdfsdfsdfsdfIPFS!";

    const hash = IPFS.add(
      Buffer.fromString(data)
    );

    expect(hash).toBe("foo")
  });

  it("IPFS.get(...)", () => {

  })
})
