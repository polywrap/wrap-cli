import { Context } from "../msgpack/Context";


describe("Context class", () => {

  it("pushes and pops values", () => {
    const context: Context = new Context();
    expect(context.length).toStrictEqual(0);
    expect(context.isEmpty()).toStrictEqual(true);
    context.push("property", "string");
    context.push("property", "i32");
    context.push("property", "bool");
    expect(context.length).toStrictEqual(3);
    expect(context.isEmpty()).toStrictEqual(false);
    context.pop();
    context.pop();
    context.pop();
    expect(context.length).toStrictEqual(0);
    expect(context.isEmpty()).toStrictEqual(true);
  });

  it("prints in desired format", () => {
    const context: Context = new Context("Deserializing MyObject");
    context.push("propertyOne", "string");
    expect("\n" + context.toString()).toStrictEqual(
      `
Context: Deserializing MyObject
  at propertyOne: string`
    )

    expect(context.printWithContext("\nInvalid length")).toStrictEqual(
      `
Invalid length
  Context: Deserializing MyObject
    at propertyOne: string`
    )

  });

});