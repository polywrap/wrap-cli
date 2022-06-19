import { normalizeLineEndings } from "@polywrap/os-js";
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

export function getSampleObjectOutput(): any {
  return {
    query: "./set.graphql",
    variables: {
      address: "$SimpleStorageAddr",
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
  };
}
