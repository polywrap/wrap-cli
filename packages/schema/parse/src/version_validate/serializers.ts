export function stringifyObjects(unknownObj: unknown): unknown { 
    let objType = typeof unknownObj;
    let obj: Record<string, unknown> = unknownObj as Record<string, unknown>;

    if (obj && objType == "object") {
        let output = [];
        if( Array.isArray(obj) ){
            obj = obj.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
        }
        let sortedKeys = Object.keys(obj).sort();
        for(let i=0; i<sortedKeys.length; i++) {
            if(sortedKeys[i] != "comment"){
                let propObj = obj[sortedKeys[i]];
                let prop = stringifyObjects(propObj);
                output.push(prop)
            }
        }
        return output;
    } else {
        return String(obj);
    }
}