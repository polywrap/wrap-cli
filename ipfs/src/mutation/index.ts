import { Http_Mutation, Http_ResponseType } from "./w3/imported";
import { Input_addFile, AddResult } from "./w3";
import { JSON } from "assemblyscript-json";

export function addFile(input: Input_addFile): AddResult {
  const url = input.ipfsUrl + "/api/v0/add";
  const addResponse = Http_Mutation.post({
    url: url,
    request: {
      headers: [],
      urlParams: [],
      responseType: Http_ResponseType.TEXT,
      body: {
        formDataBody: {
          data: [{key: input.fileName, data: String.UTF8.decode(input.data)}]
        },
        rawBody: null
      },
    }
  })

  if(addResponse == null || addResponse.status != 200) {
    throw new Error(`Failed to add file: ${input.fileName}`);
  }

  const responseObj: JSON.Obj = <JSON.Obj>(JSON.parse(addResponse.body));
  
  let addResult: AddResult = {name: "", hash: "", size: ""}

  const nameOrNull: JSON.Str | null = responseObj.getString("Name");
  if(nameOrNull != null) {
    addResult.name = nameOrNull.valueOf();
  }

  const hashOrNull: JSON.Str | null = responseObj.getString("Hash");
  if(hashOrNull != null) {
    addResult.hash = hashOrNull.valueOf();
  }

  const sizeOrNull: JSON.Str | null = responseObj.getString("Size");
  if(sizeOrNull != null) {
    addResult.size = sizeOrNull.valueOf();
  }


  return addResult;
}