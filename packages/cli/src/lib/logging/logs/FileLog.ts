import { Log, LogLevel } from "../Log";

import fs, { WriteStream } from "fs";

export class FileLog extends Log {
  private _logFileStream: WriteStream;

  constructor(
    public readonly logFilePath: string,
    level: LogLevel
  ) {
    super(level);
    this._createWriteStream();
  }

  public end(): void {
    this._logFileStream.end();
  }

  public log(message: string, level: LogLevel): void {
    if (level < this.level || !this._logFileStream) {
      return;
    }

    let prefix = Date.now().toString() + " ";


    switch (level) {
      case LogLevel.DEBUG:
        prefix += "DEBUG: "
        break;
      case LogLevel.INFO:
        prefix += "INFO: "
        break;
      case LogLevel.WARN:
        prefix += "WARN: "
        break;
      case LogLevel.ERROR:
        prefix += "ERROR: "
        break;
    }

    this._logFileStream.write(
      prefix + message
    );
  }

  private _createWriteStream() {
    this._logFileStream = fs.createWriteStream(
      this.logFilePath,
      { encoding: "utf8" }
    );
  }
}
