export interface AddResult {
  name: string;
  hash: string;
  size: string;
}

export function parseAddDirectoryResponse(body: string): AddResult[] {
  const results: AddResult[] = [];
  const rawResults = body.split("\n");
  for (let i = 0; i < rawResults.length - 1; i++) {
    const parsedResult = parseAddResponse(rawResults[i]);
    results.push(parsedResult);
  }
  return results;
}

function parseAddResponse(body: string): AddResult {
  const addResult: AddResult = { name: "", hash: "", size: "" };
  if (body != null) {
    const responseObj = JSON.parse(body);

    addResult.name = responseObj["Name"];
    addResult.hash = responseObj["Hash"];
    addResult.size = responseObj["Size"];
  }
  return addResult;
}
