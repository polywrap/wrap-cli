import { LogLevel } from "@polywrap/logging-js";
import { ConsoleLog, FileLog, Log, Logger } from "../../lib";
import path from "path";
import fs from "fs";

describe("Logging unit tests", () => {
  const testMessage = "Hello Polywrap!";

  describe("Logger", () => {
    class MockLog implements Log {
      public level: LogLevel;
      public log(message: string, level: LogLevel): void {}
    }

    it("should forward log calls to all of its logs", () => {
      const mockLog1 = new MockLog();
      const mockLog2 = new MockLog();

      const logger = new Logger({
        foo: mockLog1,
        bar: mockLog2,
      });

      const logSpy1 = jest.spyOn(mockLog1, "log");
      const logSpy2 = jest.spyOn(mockLog2, "log");

      logger.log(testMessage, LogLevel.INFO);
      logger.info(testMessage);
      logger.debug(testMessage);
      logger.warn(testMessage);
      logger.error(testMessage);

      expect(logSpy1).toBeCalledTimes(5);
      expect(logSpy2).toBeCalledTimes(5);
    });

    it("should set a log", () => {
      const mockLog1 = new MockLog();
      const mockLog2 = new MockLog();

      const logger = new Logger({
        foo: mockLog1,
      });

      logger.setLog("bar", mockLog2);

      expect(logger.getLog("foo")).toBe(mockLog1);
      expect(logger.getLog("bar")).toBe(mockLog2);

      // Test overwrite of log
      const mockLog3 = new MockLog();

      logger.setLog("foo", mockLog3);

      expect(logger.getLog("foo")).toBe(mockLog3);
    });

    it("should get a log", () => {
      const mockLog1 = new MockLog();
      const mockLog2 = new MockLog();

      const logger = new Logger({
        foo: mockLog1,
        bar: mockLog2,
      });

      expect(logger.getLog("foo")).toBe(mockLog1);
      expect(logger.getLog("bar")).toBe(mockLog2);
    });

    it("should remove a log", () => {
      const mockLog1 = new MockLog();
      const mockLog2 = new MockLog();

      const logger = new Logger({
        foo: mockLog1,
        bar: mockLog2,
      });

      const logSpy1 = jest.spyOn(mockLog1, "log");
      const logSpy2 = jest.spyOn(mockLog2, "log");

      logger.log(testMessage, LogLevel.INFO);

      logger.removeLog("bar");

      logger.info(testMessage);
      logger.debug(testMessage);
      logger.warn(testMessage);
      logger.error(testMessage);

      expect(logSpy1).toBeCalledTimes(5);
      expect(logSpy2).toBeCalledTimes(1);
    });

    it("should call shorthand log functions appropriately", () => {
      const mockLog = new MockLog();

      const logger = new Logger({
        foo: mockLog,
      });

      const logSpy = jest.spyOn(mockLog, "log");

      logger.info(testMessage);
      expect(logSpy).lastCalledWith(testMessage, LogLevel.INFO);
      logSpy.mockClear();

      logger.debug(testMessage);
      expect(logSpy).lastCalledWith(testMessage, LogLevel.DEBUG);
      logSpy.mockClear();

      logger.warn(testMessage);
      expect(logSpy).lastCalledWith(testMessage, LogLevel.WARN);
      logSpy.mockClear();

      logger.error(testMessage);
      expect(logSpy).lastCalledWith(testMessage, LogLevel.ERROR);
      logSpy.mockClear();
    });
  });

  describe("ConsoleLog", () => {
    it("should log to console", () => {
      const testLog = (
        logLevel: LogLevel,
        consoleFunctionName: "info" | "debug" | "warn" | "error"
      ) => {
        const log = new ConsoleLog(logLevel);

        const logSpy = jest.spyOn(console, consoleFunctionName);
        logSpy.mockImplementationOnce(() => {});
        log.log("Hello Polywrap!", logLevel);

        expect(logSpy).toHaveBeenCalled();
      };

      testLog(LogLevel.INFO, "info");
      testLog(LogLevel.DEBUG, "debug");
      testLog(LogLevel.WARN, "warn");
      testLog(LogLevel.ERROR, "error");
    });
  });

  describe("FileLog", () => {
    const tempFilesDir = path.join(__dirname, ".temp");

    beforeAll(() => {
      if (!fs.existsSync(tempFilesDir)) {
        fs.mkdirSync(tempFilesDir, { recursive: true });
      }
    });

    afterAll(() => {
      if (fs.existsSync(tempFilesDir)) {
        fs.rmdirSync(tempFilesDir, { recursive: true });
      }
    });

    it("Should log appropriate levels to a file", async () => {
      const infoLogFile = path.join(tempFilesDir, "info.log");
      const debugLogFile = path.join(tempFilesDir, "debug.log");
      const warnLogFile = path.join(tempFilesDir, "warn.log");
      const errorLogFile = path.join(tempFilesDir, "error.log");

      const infoLog = new FileLog(infoLogFile, LogLevel.INFO);
      const debugLog = new FileLog(debugLogFile, LogLevel.DEBUG);
      const warnLog = new FileLog(warnLogFile, LogLevel.WARN);
      const errorLog = new FileLog(errorLogFile, LogLevel.ERROR);

      const testLogLevels = async (
        log: FileLog,
        logFilePath: string,
        expectedNumberOfMessages: number
      ) => {
        log.log(testMessage, LogLevel.DEBUG);
        log.log(testMessage, LogLevel.INFO);
        log.log(testMessage, LogLevel.WARN);
        log.log(testMessage, LogLevel.ERROR);

        await log.end();

        const logFileContents = fs.readFileSync(logFilePath, {
          encoding: "utf-8",
        });

        let occurences = 0;

        for (const line of logFileContents.split("\n")) {
          if (line.includes(testMessage)) {
            occurences++;
          }
        }

        expect(occurences).toBe(expectedNumberOfMessages);
      };

      await testLogLevels(debugLog, debugLogFile, 4);
      await testLogLevels(infoLog, infoLogFile, 3);
      await testLogLevels(warnLog, warnLogFile, 2);
      await testLogLevels(errorLog, errorLogFile, 1);
    });
  });
});
