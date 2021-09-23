import { AddResult } from "./w3";
import { JSON } from "@web3api/wasm-as";

export function parseAddDirectoryResponse(body: string | null): AddResult[] {
    let results: AddResult[] = []
    if (body != null) {
        const rawResults = (body as string).split("\n");
        for (let i = 0; i < rawResults.length - 1; i++) {
            const parsedResult = parseAddResponse(rawResults[i]);
            results.push(parsedResult)
        }
    }
    return results;
}

export function parseAddFileResponse(body: string | null): AddResult {
    return parseAddResponse(body)
}

function parseAddResponse(body: string | null): AddResult {
    let addResult: AddResult = { name: "", hash: "", size: "" }
    if (body != null) {
        const responseObj: JSON.Obj = <JSON.Obj>(JSON.parse(body));
        const nameOrNull: JSON.Str | null = responseObj.getString("Name");
        if (nameOrNull != null) {
            addResult.name = nameOrNull.valueOf();
        }

        const hashOrNull: JSON.Str | null = responseObj.getString("Hash");
        if (hashOrNull != null) {
            addResult.hash = hashOrNull.valueOf();
        }

        const sizeOrNull: JSON.Str | null = responseObj.getString("Size");
        if (sizeOrNull != null) {
            addResult.size = sizeOrNull.valueOf();
        }
    }
    return addResult;
}