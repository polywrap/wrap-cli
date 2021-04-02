import { fromAxiosResponse, toAxiosRequest } from "../../util";
import {ResponseType} from "../../types"

describe("converting axios response", () => {
  test("response type: text", () => {
    const response = fromAxiosResponse({
      status: 200,
      statusText: "Ok",
      data: "body-content",
      headers: { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
      config: { responseType: "text" },
    });

    expect(response.headers).toStrictEqual([
      { key: "Accept", value: "application-json" },
      { key: "X-Header", value: "test-value" },
    ]);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("Ok");
    expect(response.body).toBe("body-content");
  });

  test("response type: arraybuffer", () => {
    const response = fromAxiosResponse({
      status: 200,
      statusText: "Ok",
      data: "body-content",
      headers: { ["Accept"]: "application-json", ["X-Header"]: "test-value" },
      config: { responseType: "arraybuffer" },
    });

    expect(response.headers).toStrictEqual([
      { key: "Accept", value: "application-json" },
      { key: "X-Header", value: "test-value" },
    ]);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("Ok");
    expect(response.body).toBe(Buffer.from("body-content").toString('base64'));
  });
});

describe("creating axios config", () => {
  test("with headers", () => {
    const axiosReq = toAxiosRequest({
      headers: [
        { key: "Accept", value: "application-json" },
        { key: "X-Header", value: "test-value" },
      ],
      responseType: ResponseType.TEXT,
    });

    expect(axiosReq.config.headers).toStrictEqual({
      ["Accept"]: "application-json",
      ["X-Header"]: "test-value",
    });
    expect(axiosReq.config.params).toBeUndefined();
    expect(axiosReq.config.responseType).toBe("text");
  });

  test("with url params", () => {
    const config = toAxiosRequest({
      urlParams: [{ key: "tag", value: "data" }],
      responseType: ResponseType.BINARY,
    });

    expect(config.config.headers).toBeUndefined();
    expect(config.config.params).toStrictEqual({ ["tag"]: "data" });
    expect(config.config.responseType).toBe("arraybuffer");
  });

  test("with body as form data", () => {
    const axiosReq = toAxiosRequest({
      headers: [
        { key: "Accept", value: "application-json" },
        { key: "X-Header", value: "test-value" },
      ],
      responseType: ResponseType.TEXT,
      body: {
        formDataBody: {
          data: [
            {
              key: "prop", 
              data: "test-data",
            }]
        }
      },
    });

    expect(axiosReq.config.headers["Accept"])
      .toStrictEqual("application-json");
    expect(axiosReq.config.headers["X-Header"])
      .toStrictEqual("test-value");      
    expect(axiosReq.config.headers["content-type"].startsWith("multipart/form-data;"))
      .toBeTruthy()
    expect(axiosReq.config.params).toBeUndefined();
    expect(axiosReq.config.responseType).toBe("text");
    expect(axiosReq.data).toHaveProperty("_valueLength");
    expect(axiosReq.data).toHaveProperty("_overheadLength");
  });

  test("with body as string", () => {
    const axiosReq = toAxiosRequest({
      headers: [
        { key: "Accept", value: "application-json" },
        { key: "X-Header", value: "test-value" },
      ],
      responseType: ResponseType.TEXT,
      body: {stringBody: "test-string-body"}
    });

    expect(axiosReq.config.headers).toStrictEqual({
      ["Accept"]: "application-json",
      ["X-Header"]: "test-value",
    });
    expect(axiosReq.config.params).toBeUndefined();
    expect(axiosReq.config.responseType).toBe("text");
    expect(axiosReq.data).toBe("test-string-body");
  });

  test("with body as raw bytes", () => {
    const axiosReq = toAxiosRequest({
      headers: [
        { key: "Accept", value: "application-json" },
        { key: "X-Header", value: "test-value" },
      ],
      responseType: ResponseType.TEXT,
      body: {rawBody: Uint8Array.from([21, 34, 45])}
    });

    expect(axiosReq.config.headers).toStrictEqual({
      ["Accept"]: "application-json",
      ["X-Header"]: "test-value",
    });
    expect(axiosReq.config.params).toBeUndefined();
    expect(axiosReq.config.responseType).toBe("text");
    expect(axiosReq.data).toStrictEqual(Uint8Array.from([21, 34, 45]));
  });
});
