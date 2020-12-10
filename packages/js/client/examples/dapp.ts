import { Web3APIClient } from "@web3api/client-js";

async function main() {
  const client = new Web3APIClient();

  const result = await client.query({
    uri: "api.example.eth",
    query: `query {
      doSomething(
        variable: $variable
        value: "important value"
      ) {
        returnData
      }
    }`,
    variables: {
      variable: 555
    }
  });

  console.log(result.errors);
  console.log(result.data.returnData);
}
