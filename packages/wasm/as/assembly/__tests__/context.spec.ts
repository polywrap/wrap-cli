import { MsgPackContext } from "../msgpack/MsgPackContext";


describe("Context class", () => {

  it("pushes and pops values", () => {
    const context: MsgPackContext = new MsgPackContext();
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
    const context: MsgPackContext = new MsgPackContext("Deserializing MyObject");
    context.push("propertyOne", "string");
    expect(context.toString()).toStrictEqual(
      `Context: Deserializing MyObject
               at propertyOne: string`
    )

  });

});