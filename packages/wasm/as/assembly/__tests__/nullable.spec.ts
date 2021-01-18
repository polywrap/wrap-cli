import { Nullable } from "../msgpack/Nullable";

describe("Nullable: Sanity", () => {
  it("Works", () => {
    const value = Nullable.fromValue<u64>(500);
    const other = Nullable.fromNull<u64>();

    expect(value.value).toBe(500);
    expect(other).not.toBe(value);

    expect(value == other).toBe(false);
    expect(value != other).toBe(true);

    const sameValue = Nullable.fromValue(value.value);
    expect(sameValue == value).toBe(true);
  });
});
