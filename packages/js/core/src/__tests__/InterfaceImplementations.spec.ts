import { Uri } from "../";
import { sanitizeInterfaceImplementations } from "../types";

describe("sanitizeInterfaceImplementations", () => {
  it("Returns empty array if empty array passed", () => {
    const interfaces = sanitizeInterfaceImplementations([]);

    expect(interfaces).toEqual([]);
  });

  it("Returns interfaces from interfaces definitions", () => {
    const interfaces = sanitizeInterfaceImplementations([
      {
        interface: "wrap://polywrap/interface",
        implementations: ["wrap://polywrap/wrapper1", "wrap://polywrap/wrapper2"]
      }
    ]);

    expect(interfaces).toEqual([
      {
        interface: new Uri("wrap://polywrap/interface"),
        implementations: [new Uri("wrap://polywrap/wrapper1"), new Uri("wrap://polywrap/wrapper2")]
      }
    ]);
  });
});
