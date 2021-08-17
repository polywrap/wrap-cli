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
        interface: "w3://w3/interface",
        implementations: ["w3://w3/api1", "w3://w3/api2"]
      }
    ]);

    expect(interfaces).toEqual([
      {
        interface: new Uri("w3://w3/interface"),
        implementations: [new Uri("w3://w3/api1"), new Uri("w3://w3/api2")]
      }
    ]);
  });
});
