import { Log } from "../Log";

import fs, { WriteStream } from "fs";
import path from "path";
import { LogLevel } from "@polywrap/logging-js";

export class FileLog extends Log {
  private _logFileStream: WriteStream;

  constructor(public readonly logFilePath: string, level: LogLevel) {
    super(level);
    this._createWriteStream();
  }

  public async end(): Promise<void> {
    return new Promise((resolve) => {
      this._logFileStream.end(resolve);
    });
  }

  public log(message: string, level: LogLevel): void {
    if (level < this.level || !this._logFileStream) {
      return;
    }

    let prefix = Date.now().toString() + " ";

    switch (level) {
      case LogLevel.DEBUG:
        prefix += "DEBUG: ";
        break;
      case LogLevel.INFO:
        prefix += "INFO: ";
        break;
      case LogLevel.WARN:
        prefix += "WARN: ";
        break;
      case LogLevel.ERROR:
        prefix += "ERROR: ";
        break;
    }

    this._logFileStream.write(prefix + message + "\n");
  }

  private _createWriteStream() {
    const dir = path.dirname(this.logFilePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this._logFileStream = fs.createWriteStream(this.logFilePath, {
      encoding: "utf8",
    });
  }
}
