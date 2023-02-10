import * as fs from "fs";
import path from "path";

export class FileLock {
  constructor(
    private _lockFilePath: string,
    private _onError: (message: string) => void
  ) {}

  // request lock and wait until it is obtained
  async request(): Promise<void> {
    // wait for lock availability
    while (fs.existsSync(this._lockFilePath)) {
      // check if process holding the lock is still running
      const lockPid: string = await fs.promises.readFile(
        this._lockFilePath,
        "utf8"
      );
      const isRunning: boolean = this._isRunning(parseInt(lockPid));
      // if process is not running and file exists, the lock is orphaned and can be destroyed
      if (!isRunning) {
        try {
          await this.release();
          break;
        } catch (e) {
          // can ignore exception if cause is race condition
          if (!fs.existsSync(this._lockFilePath)) {
            throw e;
          }
        }
      }
      // sleep to wait for lock
      await new Promise((r) => setTimeout(r, 1000));
    }
    // try to get the lock, and recurse if another process gets the lock first.
    try {
      fs.mkdirSync(path.dirname(this._lockFilePath), { recursive: true });
      await fs.promises.writeFile(this._lockFilePath, `${process.pid}`, {
        flag: "wx",
      });
    } catch {
      return this.request();
    }
  }

  // release lock by deleting lock file
  async release(): Promise<void> {
    try {
      await fs.promises.unlink(this._lockFilePath);
    } catch {
      this._onError("Tried to release a file lock that doesn't exist");
    }
  }

  // check if process is running
  private _isRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
      return true;
    } catch (e) {
      return false;
    }
  }
}
