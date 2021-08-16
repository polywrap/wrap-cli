export class IpfsError extends Error {
  constructor(method: string, status?: number, statusText?: string, errorMessage?: string) {
    super(
      `IPFS ${method} Failed.\n`+
      `${status ? "" : "Status: " + status + "\n"}`+
      `${statusText ? "" : "Status message: " + statusText + "\n"}`+
      `${errorMessage ? "" : "Error message:" + errorMessage}`
    );
    this.name = "IPFSError";
  }
}

