import {
  filterResults
} from "../";

describe("filterResults", () => {

  it("works in the typical case", () => {
    const result = {
      rootA: {
        prop1: "hey",
        prop2: "heyu"
      },
      rootB: {
        prop3: 5,
        prop4: {
          deep: 1.5
        }
      }
    };
    const filter = {
      rootA: {
        prop1: true
      },
      rootB: true
    };

    expect(filterResults(result, filter))
      .toMatchObject({
        rootA: {
          prop1: "hey"
        },
        rootB: {
          prop3: 5,
          prop4: {
            deep: 1.5
          }
        }
      });
  });

  it("throws if you try to filter a value property", () => {
    const result = {
      rootA: {
        prop1: "hey",
        prop2: "heyu"
      }
    };
    const filter = {
      rootA: {
        prop1: { }
      }
    };
    expect(() => filterResults(result, filter))
      .toThrowError(/The result given is not an object./)
  });

  it("throws if you try to filter a value", () => {
    const result = 5;
    const filter = {
      rootA: true
    };

    expect(() => filterResults(result, filter))
      .toThrowError(/The result given is not an object./);
  });

  it("throws if you try to filter something that isn't there", () => {
    const result = {
      rootA: {
        prop1: "hey"
      }
    };
    const filter = {
      rootA: {
        prop3: true
      }
    };

    expect(filterResults(result, filter))
      .toMatchObject({
        rootA: {
          prop3: undefined
        }
      });
  });

  it("returns null if result is null", () => {
    const filter = {
      rootA: true
    };

    expect(filterResults(null, filter))
      .toBeNull();

    expect(filterResults(undefined, filter))
      .toBeUndefined();
  });
});
