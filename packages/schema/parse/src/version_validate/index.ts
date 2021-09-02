import { compare } from './comparators';
import { parseSchema } from '..';
import { TypeInfo } from './../typeInfo/index';
import { readFileSync } from "fs";

let s1: string = readFileSync("./src/version_validate/schemas/v1.graphql").toString();
let s2: string = readFileSync("./src/version_validate/schemas/v2.graphql").toString();

let t1: TypeInfo = parseSchema(s1);
let t2: TypeInfo = parseSchema(s2);

console.log(compare(t1, t2));