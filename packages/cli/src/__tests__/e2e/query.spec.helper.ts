import { normalizeLineEndings } from "@web3api/os-js";
import { clearStyle } from "./utils";

export interface ISampleOutputOptions {
  SimpleStorageAddr: string;
}

export function checkSampleQueryOutput(
  output: string,
  { SimpleStorageAddr }: ISampleOutputOptions
) {
  expect(clearStyle(normalizeLineEndings(output, "\n"))).toContain(
    getSampleOutput({ SimpleStorageAddr })
  );

  expect(clearStyle(output)).toContain(getSampleOutputSetDataValue());
}

export function getSampleOutputWithClientConfig(
  options: ISampleOutputOptions
): string {
  return `-----------------------------------
mutation {
  setData(
    options: {
      address: $address
      value: $value
    }
    connection: {
      networkNameOrChainId: $network
    }
  ) {
    value
    txReceipt
  }
}

{
  "address": "${options.SimpleStorageAddr}",
  "value": 569,
  "network": "testnet"
}
-----------------------------------
-----------------------------------
{
  "setData": {
    "value": 569,
    "txReceipt": "0xdone"
  }
}
-----------------------------------
`;
}

export function getSampleOutput(options: ISampleOutputOptions): string {
  return `-----------------------------------
mutation {
  setData(
    options: {
      address: $address
      value: $value
    }
    connection: {
      networkNameOrChainId: $network
    }
  ) {
    value
    txReceipt
  }
}

{
  "address": "${options.SimpleStorageAddr}",
  "value": 569,
  "network": "testnet"
}
-----------------------------------
-----------------------------------
{
  "setData": {
    "txReceipt": "0x`;
}

export function getSampleOutputSetDataValue(): string {
  return `",
    "value": 569
  }
}
-----------------------------------
`;
}

export function getSampleJsonOutput(address: string): any {
  return [
    {
      uri: "ens/testnet/simplestorage.eth",
      query:
        "mutation {\n  setData(\n    options: {\n      address: $address\n      value: $value\n    }\n    connection: {\n      networkNameOrChainId: $network\n    }\n  ) {\n    value\n    txReceipt\n  }\n}\n",
      variables: {
        address: address,
        value: 569,
        network: "testnet",
      },
      output: {
        data: {
          setData: {
            value: 569,
          },
        },
      },
    },
  ];
}
