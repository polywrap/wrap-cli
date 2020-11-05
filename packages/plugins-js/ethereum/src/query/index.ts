interface CallViewInput { 
  address: string;
  method: string;
  args: string[];
}

export const callView = (client: EthereumClient) =>
  ((input: CallViewInput) => {

})
