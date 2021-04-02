export class IpfsError extends Error { 
    constructor(method: string, status: number, statusText: string) {
      super(`IPFS ${method} Failed.\nStatus: ${status}\nMessage:${statusText}`);
      this.name = "IPFSError"
    }
}