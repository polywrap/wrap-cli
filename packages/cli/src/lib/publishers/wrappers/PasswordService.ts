import { promptForPassword } from "./utils";

import fs from "fs";
import path from "path";

export class PasswordService {
  private password?: string;
  private get passwordFilePath(): string {
    return path.join(__dirname, "./.password");
  }

  async getPassword(): Promise<string> {
    if (this.password) {
      return this.password;
    } else if (fs.existsSync(this.passwordFilePath)) {
      this.password = fs.readFileSync(this.passwordFilePath, {
        encoding: "utf-8",
      });
    } else {
      this.password = await promptForPassword();
    }

    return this.password as string;
  }

  setPassword(password: string | undefined): void {
    this.password = password;
  }

  savePassword(): void {
    if (!this.password) {
      throw Error("No password provided");
    }

    fs.writeFileSync(this.passwordFilePath, this.password, {
      encoding: "utf-8",
    });
    console.log("Saved password");
  }

  clearPassword(): void {
    if (fs.existsSync(this.passwordFilePath)) {
      fs.unlinkSync(this.passwordFilePath);
      console.log("Cleared saved password");
    }
  }
}
