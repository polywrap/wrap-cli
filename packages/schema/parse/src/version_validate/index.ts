import { writeFileSync } from 'fs';

import { stringifyObjects } from "./serializers";

import { typeInfo as t1 } from "./schemas/schema_1_1_1";
import { typeInfo as t2 } from "./schemas/schema_1_1_2";

let s1: unknown = stringifyObjects(t1 as unknown as Record<string, unknown>);
writeFileSync("/Users/niraj/Documents/projects/polywrap/monorepo/packages/schema/parse/src/version_validate/schemas/outv1.json", JSON.stringify(s1));


let s2: unknown = stringifyObjects(t2 as unknown as Record<string, unknown>);
writeFileSync("/Users/niraj/Documents/projects/polywrap/monorepo/packages/schema/parse/src/version_validate/schemas/outv2.json", JSON.stringify(s2));


// export function validatePatch(t1: TypeInfo, t2: TypeInfo): void {

// }