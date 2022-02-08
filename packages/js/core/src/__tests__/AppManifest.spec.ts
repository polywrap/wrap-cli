import { appLanguage, namespace } from "../manifest/validators";

describe("App manifest validator", () => {

  it("appLanguage validator", () => {
    expect(appLanguage("app/typescript")).toBeTruthy();
    expect(appLanguage("app/notALanguage")).toBeTruthy();
    expect(appLanguage("typescript")).toBeFalsy();
    expect(appLanguage("plugin/typescript")).toBeFalsy();
  });

  it("namespace validator", () => {
    // should accept any string that is a valid javascript class and property name
    expect(namespace("Hi")).toBeTruthy();
    expect(namespace("hi")).toBeTruthy();
    expect(namespace("_Hi")).toBeTruthy();
    expect(namespace("hi_")).toBeTruthy();
    expect(namespace("H_i")).toBeTruthy();
    expect(namespace("Hi42")).toBeTruthy();
    expect(namespace("_Hi_42_")).toBeTruthy();
    // should reject any string that is NOT a valid class or property name
    expect(namespace("42hi")).toBeFalsy();
    expect(namespace("hi-hello")).toBeFalsy();
  });
});
