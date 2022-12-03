import { fromFetchResponse, toRequestConfig } from "../../util";
import { Http_ResponseTypeEnum } from "../../wrap";

describe("converting axios response", () => {
  test("response type: text", () => {
    const response = fromFetchResponse({
      status: 200,
      statusText: "Ok",
      data: "body-content",
      headers: { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
      config: { responseType: "text" },
    });

    expect(response.headers).toStrictEqual(
      new Map([
        ["Accept", "application-json"],
        ["X-Header", "test-value"],
      ])
    );
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("Ok");
    expect(response.body).toBe("body-content");
  });

  test("response type: text; with header as a map", () => {
    const response = fromFetchResponse({
      status: 200,
      statusText: "Ok",
      data: "body-content",
      headers: {
        ["Accept"]: "application-json",
        ["X-Header"]: "test-value",
        ["set-cookie"]: ["key=val;", "key2=val2;"],
      },
      config: { responseType: "text" },
    });

    expect(response.headers).toStrictEqual(
      new Map([
        ["Accept", "application-json"],
        ["X-Header", "test-value"],
        ["set-cookie", "key=val; key2=val2;"],
      ])
    );
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("Ok");
    expect(response.body).toBe("body-content");
  });

  test("response type: arraybuffer", () => {
    const response = fromFetchResponse({
      status: 200,
      statusText: "Ok",
      data: Buffer.from("body-content"),
      headers: { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
      config: { responseType: "arraybuffer" },
    });

    expect(response.headers).toStrictEqual(
      new Map([
        ["Accept", "application-json"],
        ["X-Header", "test-value"],
      ])
    );
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("Ok");
    expect(response.body).toBe(Buffer.from("body-content").toString("base64"));
  });
});

describe("creating axios config", () => {
  test("with headers", () => {
    const config = toRequestConfig({
      headers: new Map([
        ["Accept", "application-json"],
        ["X-Header", "test-value"],
      ]),
      responseType: "TEXT",
      body: "body-content",
    });

    expect(config.headers).toStrictEqual({
      ["Accept"]: "application-json",
      ["X-Header"]: "test-value",
    });
    expect(config.params).toBeUndefined();
    expect(config.responseType).toBe("text");
  });

  test("with url params", () => {
    const config = toRequestConfig({
      urlParams: new Map([["tag", "data"]]),
      responseType: Http_ResponseTypeEnum.BINARY,
      body: "body-content",
    });

    expect(config.headers).toBeUndefined();
    expect(config.params).toStrictEqual({ ["tag"]: "data" });
    expect(config.responseType).toBe("arraybuffer");
  });
});
