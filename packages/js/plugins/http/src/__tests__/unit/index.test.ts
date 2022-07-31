import { HttpPlugin } from "../..";
import { ResponseTypeEnum, Client } from "../../wrap";

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

// mock axios
jest.mock("axios");
const mockedAxios = jest.requireMock<jest.Mocked<typeof axios>>("axios");

describe("test http plugin", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get method", () => {
    const plugin = new HttpPlugin({});

    test("valid request: text response type", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        headers: { ["Content-Type"]: "application/json; charset=utf-8" },
        status: 200,
        statusText: "Ok",
        data: "{result: 1001}",
        config: {
          responseType: "text",
        },
      } as AxiosResponse);

      const response = await plugin.get({
        url: "/api/test",
        request: {
          headers: [
            { key: "Accept", value: "application/json" },
            { key: "X-Test-Header", value: "test-header-value" },
          ],
          urlParams: [{ key: "q", value: "test-param" }],
          responseType: ResponseTypeEnum.TEXT,
        },
      }, {} as Client);

      expect(mockedAxios.get).lastCalledWith("/api/test", {
        headers: {
          ["Accept"]: "application/json",
          ["X-Test-Header"]: "test-header-value",
        },
        params: { q: "test-param" },
        responseType: "text",
      } as AxiosRequestConfig);

      expect(response?.status).toBe(200);
      expect(response?.statusText).toBe("Ok");
      expect(response?.headers).toStrictEqual([
        { key: "Content-Type", value: "application/json; charset=utf-8" },
      ]);
      expect(response?.body).toBe("{result: 1001}");
    });

    test("valid request: arraybuffer response type", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        headers: { ["Content-Type"]: "application/json; charset=utf-8" },
        status: 200,
        statusText: "Ok",
        data: Buffer.from("{result: 1001}"),
        config: {
          responseType: "arraybuffer",
        },
      } as AxiosResponse);

      const response = await plugin.get({
        url: "/api/test",
        request: {
          headers: [
            { key: "Accept", value: "application/json" },
            { key: "X-Test-Header", value: "test-header-value" },
          ],
          urlParams: [{ key: "q", value: "test-param" }],
          responseType: "BINARY",
        }
      }, {} as Client);

      expect(mockedAxios.get).lastCalledWith("/api/test", {
        headers: {
          ["Accept"]: "application/json",
          ["X-Test-Header"]: "test-header-value",
        },
        params: { q: "test-param" },
        responseType: "arraybuffer",
      } as AxiosRequestConfig);

      expect(response?.status).toBe(200);
      expect(response?.statusText).toBe("Ok");
      expect(response?.headers).toStrictEqual([
        { key: "Content-Type", value: "application/json; charset=utf-8" },
      ]);
      expect(response?.body).toBeTruthy();
      if (response?.body) {
        expect(Buffer.from(response.body, 'base64').toString()).toBe("{result: 1001}");
      }
    });
  });

  describe("post method", () => {
    const plugin = new HttpPlugin({});

    test("valid request with headers", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: { ["Content-Type"]: "application/json; charset=utf-8" },
        status: 200,
        statusText: "Ok",
        data: "{response: 1001}",
        config: {
          responseType: "text",
        },
      } as AxiosResponse);

      const response = await plugin.post({
        url: "/api/test",
        request: {
          headers: [
            { key: "Accept", value: "application/json" },
            { key: "X-Test-Header", value: "test-header-value" },
          ],
          urlParams: [{ key: "q", value: "test-param" }],
          body: "{request: 1001}",
          responseType: "TEXT",
        }
      }, {} as Client);

      expect(mockedAxios.post).lastCalledWith("/api/test", "{request: 1001}", {
        headers: {
          ["Accept"]: "application/json",
          ["X-Test-Header"]: "test-header-value",
        },
        params: { q: "test-param" },
        responseType: "text",
      } as AxiosRequestConfig);

      expect(response?.status).toBe(200);
      expect(response?.statusText).toBe("Ok");
      expect(response?.headers).toStrictEqual([
        { key: "Content-Type", value: "application/json; charset=utf-8" },
      ]);
      expect(response?.body).toBe("{response: 1001}");
    });

    test("valid request with url params", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        headers: { ["Content-Type"]: "application/json; charset=utf-8" },
        status: 200,
        statusText: "Ok",
        data: Buffer.from("{response: 1001}"),
        config: {
          responseType: "arraybuffer",
        },
      } as AxiosResponse);

      const response = await plugin.post({
        url: "/api/test",
        request: {
          headers: [
            { key: "Accept", value: "application/json" },
            { key: "X-Test-Header", value: "test-header-value" },
          ],
          urlParams: [{ key: "q", value: "test-param" }],
          body: "{request: 1001}",
          responseType: "BINARY",
        }
      }, {} as Client);

      expect(mockedAxios.post).lastCalledWith("/api/test", "{request: 1001}", {
        headers: {
          ["Accept"]: "application/json",
          ["X-Test-Header"]: "test-header-value",
        },
        params: { q: "test-param" },
        responseType: "arraybuffer",
      } as AxiosRequestConfig);

      expect(response?.status).toBe(200);
      expect(response?.statusText).toBe("Ok");
      expect(response?.headers).toStrictEqual([
        { key: "Content-Type", value: "application/json; charset=utf-8" },
      ]);
      expect(response?.body).toBeTruthy();
      if (response?.body) {
        expect(Buffer.from(response.body, 'base64').toString()).toBe("{response: 1001}");
      }
    });
  });
});
