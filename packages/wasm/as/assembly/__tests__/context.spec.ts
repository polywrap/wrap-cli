import { Context } from "../msgpack";


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
    context.push("propertyOne", "unknown", "searching for property type");

    expect("\n" + context.toString()).toStrictEqual(
      `
Context: Deserializing MyObject
  at propertyOne: unknown >> searching for property type`
    )

    expect(context.printWithContext("\nInvalid length")).toStrictEqual(
      `
Invalid length
  Context: Deserializing MyObject
    at propertyOne: unknown >> searching for property type`
    )

    context.push("propertyOne", "i32", "type found, reading property");

    expect(context.printWithContext("\nInvalid length")).toStrictEqual(
      `
Invalid length
  Context: Deserializing MyObject
    at propertyOne: i32 >> type found, reading property
      at propertyOne: unknown >> searching for property type`
    )

  });

});